import React, { Component } from 'react';
import { Col, Row, Button, Input, Spinner } from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { fetchFileTreeJson, fetchNoteContentText } from './api/NotesAPIManager.js';
import { getHeadersNoAuthJson } from "./api/APIUtils";

// Enhanced Folder Tree Node Component
class TreeNode extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
    }

    componentDidUpdate(prevProps) {
        if (this.props.searchFilter !== prevProps.searchFilter && this.props.searchFilter) {
            this.setState({ isOpen: true });
        }
    }

    toggleOpen = (e) => {
        e.stopPropagation();
        this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    };

    render() {
        const { node, onFileSelect, selectedPath, searchFilter } = this.props;
        const { isOpen } = this.state;

        if (!node) return null;

        if (node.directory) {
            const filteredChildren = node.children ? node.children.filter(child => {
                if (!searchFilter) return true;
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
                        style={{
                            cursor: 'pointer',
                            padding: '6px 8px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            userSelect: 'none',
                            borderRadius: '4px',
                            fontSize: '0.9rem'
                        }}
                    >
                        <span style={{ fontSize: '0.75rem', color: '#6c757d', display: 'inline-block', width: '12px' }}>
                            {isOpen ? '▼' : '▶'}
                        </span>
                        <span>{isOpen ? '📂' : '📁'}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name || "Root"}</span>
                    </div>
                    {isOpen && node.children && (
                        <div style={{ borderLeft: '1px dashed #ced4da', marginLeft: '14px', paddingLeft: '4px' }}>
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

        const isSelected = selectedPath === node.relativePath;
        const matchesSearch = !searchFilter || node.name.toLowerCase().includes(searchFilter.toLowerCase());

        if (!matchesSearch) return null;

        return (
            <div
                onClick={() => onFileSelect(node.relativePath)}
                style={{
                    marginLeft: '20px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? '#007bff' : 'transparent',
                    color: isSelected ? '#fff' : '#495057',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '2px',
                    transition: 'all 0.15s ease-in-out'
                }}
            >
                <span>📝</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {node.name.replace(/\.md$/i, '')}
                </span>
            </div>
        );
    }
}

// Optimized Notes Explorer Dashboard
class HomeNotes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileTree: null,
            selectedPath: '',
            markdownContent: '',
            isSidebarOpen: true,
            searchQuery: '',
            isLoadingFile: false
        };
        this.activeBlobUrls = []; // Track generated image URLs to prevent RAM leaks
    }

    async componentDidMount() {
        try {
            const treeData = await fetchFileTreeJson();
            this.setState({ fileTree: treeData });
        } catch (error) {
            console.error("Error loading note structure tree:", error);
        }
    }

    componentWillUnmount() {
        this.cleanupActiveBlobs();
    }

    cleanupActiveBlobs = () => {
        if (this.activeBlobUrls.length > 0) {
            this.activeBlobUrls.forEach(url => URL.revokeObjectURL(url));
            this.activeBlobUrls = [];
        }
    };

    toggleSidebar = () => {
        this.setState(prevState => ({ isSidebarOpen: !prevState.isSidebarOpen }));
    };

    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value });
    };

    handleFileSelect = async (relativePath) => {
        // Clean up memory from the previous note's embedded images before fetching the next one
        this.cleanupActiveBlobs();

        this.setState({ selectedPath: relativePath, markdownContent: '', isLoadingFile: true });

        try {
            let textContent = await fetchNoteContentText(relativePath);

            // Strip Front Matter metadata
            textContent = textContent.replace(/^---[\s\S]*?---/, '');

            const imageMatches = [...textContent.matchAll(/!\[\[(.*?)\]\]/g)];
            const imageBlobMap = {};
            const IMAGE_BASE_URL = '/home/docs/notes/images';

            await Promise.all(imageMatches.map(async (match) => {
                const cleanFileName = match[1].trim();
                const proxyUrl = `${IMAGE_BASE_URL}/${encodeURIComponent(cleanFileName)}`;

                try {
                    const response = await fetch(proxyUrl, {
                        method: 'GET',
                        headers: getHeadersNoAuthJson(),
                        credentials: 'include'
                    });

                    if (response.ok) {
                        const blob = await response.blob();
                        const localBlobUrl = URL.createObjectURL(blob);
                        imageBlobMap[cleanFileName] = localBlobUrl;
                        this.activeBlobUrls.push(localBlobUrl); // Queue url for layout garbage collection
                    }
                } catch (err) {
                    console.error(`Failed to pre-fetch asset: ${cleanFileName}`, err);
                }
            }));

            // Replace WikiLinks with clean markdown preview images
            textContent = textContent.replace(/!\[\[(.*?)\]\]/g, (match, fileName) => {
                const cleanFileName = fileName.trim();
                const finalImageUrl = imageBlobMap[cleanFileName] || `${IMAGE_BASE_URL}/${encodeURIComponent(cleanFileName)}`;
                return `<img src="${finalImageUrl}" alt="${cleanFileName}" style="max-width:100%; height:auto; border-radius:6px; margin:14px 0; display:block; box-shadow: 0 2px 8px rgba(0,0,0,0.05);" />`;
            });

            this.setState({ markdownContent: textContent, isLoadingFile: false });
        } catch (error) {
            console.error("Error loading markdown file content:", error);
            this.setState({
                markdownContent: "### ⚠️ Error\nFailed to load the file contents properly.",
                isLoadingFile: false
            });
        }
    };

    render() {
        const { fileTree, selectedPath, markdownContent, isSidebarOpen, searchQuery, isLoadingFile } = this.state;

        const filteredTree = fileTree ? fileTree.filter(node => {
            if (!searchQuery) return true;
            const checkNodeDeep = (n) => {
                if (n.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
                if (n.children) return n.children.some(checkNodeDeep);
                return false;
            };
            return checkNodeDeep(node);
        }) : [];

        const currentFilename = selectedPath.split('/').pop()?.replace(/\.md$/i, '') || '';

        return (
            <div className="container-fluid" style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Control Action Header */}
                <div className="mb-3 d-flex align-items-center">
                    <Button color="secondary" outline size="sm" onClick={this.toggleSidebar}>
                        {isSidebarOpen ? '← Hide Sidebar' : '→ Show Sidebar'}
                    </Button>
                </div>

                <Row className="flex-grow-1" style={{ minHeight: 0 }}>
                    {/* Collapsible Sidebar Explorer with Input Filter */}
                    {isSidebarOpen && (
                        <Col md="3" className="d-flex flex-column" style={{ borderRight: '1px solid #dee2e6', height: '82vh' }}>
                            <div className="mb-2">
                                <Input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={this.handleSearchChange}
                                    size="sm"
                                    style={{ borderRadius: '6px' }}
                                />
                            </div>
                            <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
                                <h4 className="mb-3" style={{ fontSize: '1.15rem', paddingLeft: '8px', color: '#495057' }}>Notes Explorer</h4>
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
                                    <div className="text-muted small pl-2 mt-2">
                                        {fileTree ? "No matching notes found." : "Loading explorer tree..."}
                                    </div>
                                )}
                            </div>
                        </Col>
                    )}

                    {/* Fluid Main Content Area Presentation block */}
                    <Col md={isSidebarOpen ? "9" : "12"} className="d-flex flex-column" style={{ paddingLeft: isSidebarOpen ? '24px' : '15px', height: '82vh' }}>
                        {selectedPath ? (
                            <div className="d-flex flex-column w-100 h-100" style={{ border: '1px solid #ced4da', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>

                                {/* Action Toolbar Header */}
                                <div className="d-flex justify-content-between align-items-center bg-light border-bottom px-3 py-2" style={{ minHeight: '48px' }}>
                                    <div style={{ maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '600', color: '#343a40' }}>
                                        {currentFilename}
                                    </div>
                                </div>

                                {/* Active Markdown viewport container */}
                                <div className="flex-grow-1 p-4" style={{ backgroundColor: '#fff', overflowY: 'auto' }}>
                                    {isLoadingFile ? (
                                        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                                            <Spinner size="md" color="primary" className="mb-2" />
                                            <span>Parsing note links securely...</span>
                                        </div>
                                    ) : (
                                        <article className="prose" style={{ maxWidth: '100%', color: '#212529', lineHeight: '1.6' }}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeRaw]}
                                            >
                                                {markdownContent}
                                            </ReactMarkdown>
                                        </article>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted text-center m-auto">
                                <span style={{ fontSize: '3rem' }}>📓</span>
                                <h4 className="mt-2">No Note Selected</h4>
                                <p className="text-muted small">Select a file from the tree workspace configuration matrix to display its markdown content view panels.</p>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default HomeNotes;