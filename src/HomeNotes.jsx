import React, { Component } from 'react';
import { Col, Row, Button, Input } from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchFileTreeJson, fetchNoteContentText } from './api/NotesAPIManager.js';
import rehypeRaw from 'rehype-raw';
import {getHeadersNoAuthJson} from "./api/APIUtils";

// Recursive File Tree Node Subcomponent
class TreeNode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    // Automatically expand folders if a search filter is currently applied
    componentDidUpdate(prevProps) {
        if (this.props.searchFilter !== prevProps.searchFilter && this.props.searchFilter) {
            this.setState({ isOpen: true });
        }
    }

    toggleOpen = () => {
        this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    };

    render() {
        const { node, onFileSelect, selectedPath, searchFilter } = this.props;
        const { isOpen } = this.state;

        if (!node) return null;

        if (node.directory) {
            // Filter children to match search query
            const filteredChildren = node.children ? node.children.filter(child => {
                if (!searchFilter) return true;

                // Helper to check if name matches or any deep descendants match
                const matchesDeep = (n) => {
                    if (n.name.toLowerCase().includes(searchFilter.toLowerCase())) return true;
                    if (n.children) return n.children.some(matchesDeep);
                    return false;
                };
                return matchesDeep(child);
            }) : [];

            if (searchFilter && filteredChildren.length === 0) return null;

            return (
                <div style={{ marginLeft: '12px' }}>
                    <div
                        onClick={this.toggleOpen}
                        style={{ cursor: 'pointer', padding: '6px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', userSelect: 'none' }}
                    >
                        {isOpen ? '📂' : '📁'} {node.name || "Root"}
                    </div>
                    {isOpen && node.children && (
                        <div style={{ borderLeft: '1px dashed #ccc', marginLeft: '6px' }}>
                            {filteredChildren.map((child, idx) => (
                                <TreeNode
                                    key={idx}
                                    node={child}
                                    onFileSelect={onFileSelect}
                                    selectedPath={selectedPath}
                                    searchFilter={searchFilter}
                                />
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // File Leaf Node
        const isSelected = selectedPath === node.relativePath;
        const matchesSearch = !searchFilter || node.name.toLowerCase().includes(searchFilter.toLowerCase());

        if (!matchesSearch) return null;

        return (
            <div
                onClick={() => onFileSelect(node.relativePath)}
                style={{
                    marginLeft: '20px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? '#007bff' : 'transparent',
                    color: isSelected ? '#fff' : '#333',
                    transition: 'background-color 0.2s'
                }}
            >
                📄 {node.name.replace('.md', '')}
            </div>
        );
    }
}

// Main Page Component
class HomeNotes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileTree: null,
            selectedPath: '',
            markdownContent: '',
            isSidebarOpen: true,
            searchQuery: '' // State tracker for live file search
        };
    }

    async componentDidMount() {
        try {
            const treeData = await fetchFileTreeJson();
            this.setState({ fileTree: treeData });
        } catch (error) {
            console.error("Error loading note structure tree:", error);
        }
    }

    toggleSidebar = () => {
        this.setState(prevState => ({ isSidebarOpen: !prevState.isSidebarOpen }));
    };

    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value });
    };

    handleFileSelect = async (relativePath) => {
        // Import your header utility if it isn't already at the top of the file
        // import { getHeadersNoAuthJson } from './utils/HeaderUtil.js';

        this.setState({ selectedPath: relativePath, markdownContent: 'Loading content...' });
        try {
            let textContent = await fetchNoteContentText(relativePath);

            // 1. Strip out Front Matter metadata blocks
            textContent = textContent.replace(/^---[\s\S]*?---/, '');

            // 2. Discover all WikiLink image tokens: ![[Image Name.ext]]
            const imageMatches = [...textContent.matchAll(/!\[\[(.*?)\]\]/g)];
            const imageBlobMap = {};

            // 3. Pre-fetch all images concurrently using your required authentication headers
            const IMAGE_BASE_URL = '/home/docs/notes/images'; // Relative proxy path

            await Promise.all(imageMatches.map(async (match) => {
                const cleanFileName = match[1].trim();
                const proxyUrl = `${IMAGE_BASE_URL}/${encodeURIComponent(cleanFileName)}`;

                try {
                    const response = await fetch(proxyUrl, {
                        method: 'GET',
                        headers: getHeadersNoAuthJson(), // Injects mandatory validation headers
                        credentials: 'include'           // Passes cookies along if needed
                    });

                    if (response.ok) {
                        const blob = await response.blob();
                        // Generate a local browser URL pointer bound to your frontend workspace
                        imageBlobMap[cleanFileName] = URL.createObjectURL(blob);
                    }
                } catch (err) {
                    console.error(`Failed to pre-fetch asset: ${cleanFileName}`, err);
                }
            }));

            // 4. Replace WikiLink image text with a direct HTML tag pointing to our loaded Blobs
            textContent = textContent.replace(/!\[\[(.*?)\]\]/g, (match, fileName) => {
                const cleanFileName = fileName.trim();
                // Use the pre-fetched local safe memory URL, fallback to raw proxy URL if fetch failed
                const finalImageUrl = imageBlobMap[cleanFileName] || `${IMAGE_BASE_URL}/${encodeURIComponent(cleanFileName)}`;

                return `<img src="${finalImageUrl}" alt="${cleanFileName}" style="max-width:100%; height:auto; border-radius:4px; margin:10px 0; display:block;" />`;
            });

            this.setState({ markdownContent: textContent });
        } catch (error) {
            console.error("Error loading markdown file content:", error);
            this.setState({ markdownContent: "### Error\nFailed to load the file contents." });
        }
    };


    render() {
        const { fileTree, selectedPath, markdownContent, isSidebarOpen, searchQuery } = this.state;

        // Apply a high-level filter to the root tree elements
        const filteredTree = fileTree ? fileTree.filter(node => {
            if (!searchQuery) return true;
            const checkNodeDeep = (n) => {
                if (n.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
                if (n.children) return n.children.some(checkNodeDeep);
                return false;
            };
            return checkNodeDeep(node);
        }) : [];

        return (
            <div className="container-fluid" style={{ padding: '20px' }}>
                {/* Control Action Header */}
                <div className="mb-3 d-flex align-items-center">
                    <Button
                        color="secondary"
                        outline
                        size="sm"
                        onClick={this.toggleSidebar}
                        style={{ fontWeight: '500' }}
                    >
                        {isSidebarOpen ? '📁 Hide Sidebar' : '📂 Show Sidebar'}
                    </Button>
                </div>

                <Row>
                    {/* Collapsible Sidebar Explorer with Input Filter */}
                    {isSidebarOpen && (
                        <Col md="3" style={{ borderRight: '1px solid #dee2e6', maxHeight: '85vh', overflowY: 'auto' }}>
                            <div className="mb-3">
                                <Input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={this.handleSearchChange}
                                    size="sm"
                                />
                            </div>
                            <h4 className="mb-3" style={{ fontSize: '1.25rem' }}>Notes Explorer</h4>
                            {filteredTree.length > 0 ? (
                                filteredTree.map((childNode, idx) => (
                                    <TreeNode
                                        key={idx}
                                        node={childNode}
                                        onFileSelect={this.handleFileSelect}
                                        selectedPath={selectedPath}
                                        searchFilter={searchQuery}
                                    />
                                ))
                            ) : (
                                <div className="text-muted small pl-2">
                                    {fileTree ? "No matching notes found." : "Loading explorer..."}
                                </div>
                            )}
                        </Col>
                    )}

                    {/* Fluid Main Content Area */}
                    <Col md={isSidebarOpen ? "9" : "12"} style={{ paddingLeft: isSidebarOpen ? '30px' : '15px', maxHeight: '85vh', overflowY: 'auto' }}>
                        {selectedPath ? (
                            <article className="prose" style={{ maxWidth: isSidebarOpen ? '800px' : '100%', transition: 'max-width 0.2s' }}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {markdownContent}
                                </ReactMarkdown>
                            </article>
                        ) : (
                            <div className="text-muted text-center" style={{ marginTop: '150px' }}>
                                <h3>No Note Selected</h3>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default HomeNotes;