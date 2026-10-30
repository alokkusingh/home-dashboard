import React, { Component } from 'react';
import { Col, Row, Button, Input } from 'reactstrap';
import { fetchDocsTreeJson, fetchDocsStream } from './api/DocsAPIManager.js';
import { getHeadersNoAuthJson } from "./api/APIUtils";

// Recursive Folder Tree Node Component
class DocsTreeNode extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
    }

    componentDidUpdate(prevProps) {
        if (this.props.searchFilter !== prevProps.searchFilter && this.props.searchFilter) {
            this.setState({ isOpen: true });
        }
    }

    toggleOpen = () => {
        this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    };

    render() {
        const { node, onPdfSelect, selectedPath, searchFilter } = this.props;
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
                        style={{ cursor: 'pointer', padding: '6px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', userSelect: 'none' }}
                    >
                        {isOpen ? '📁' : '📁'} {node.name}
                    </div>
                    {isOpen && node.children && (
                        <div style={{ borderLeft: '1px dashed #ccc', marginLeft: '6px' }}>
                            {filteredChildren.map((child, idx) => (
                                <DocsTreeNode
                                    key={idx}
                                    node={child}
                                    onPdfSelect={onPdfSelect}
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

        // Clean file extensions for rendering
        const displayName = node.name
            .replace(/\.pdf$/i, '')
            .replace(/\.png$/i, '')
            .replace(/\.jpg$/i, '')
            .replace(/\.jpeg$/i, '');

        return (
            <div
                onClick={() => onPdfSelect(node.relativePath)}
                style={{
                    marginLeft: '20px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? '#28a745' : 'transparent',
                    color: isSelected ? '#fff' : '#333',
                    transition: 'background-color 0.2s'
                }}
            >
                📄 {displayName}
            </div>
        );
    }
}

// Main Media Viewer Dashboard Page
class HomeDocs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pdfTree: null,
            selectedPath: '',
            pdfBlobUrl: '',
            fileType: '', // Tracks the dynamic Content-Type (e.g., 'application/pdf' or 'image/png')
            isSidebarOpen: true,
            searchQuery: ''
        };
    }

    async componentDidMount() {
        try {
            const data = await fetchDocsTreeJson();
            this.setState({ pdfTree: data });
        } catch (error) {
            console.error("Error loading document tree configuration structure:", error);
        }
    }

    componentWillUnmount() {
        if (this.state.pdfBlobUrl) {
            URL.revokeObjectURL(this.state.pdfBlobUrl);
        }
    }

    toggleSidebar = () => {
        this.setState(prevState => ({ isSidebarOpen: !prevState.isSidebarOpen }));
    };

    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value });
    };

    handlePdfSelect = async (relativePath) => {
        if (this.state.pdfBlobUrl) {
            URL.revokeObjectURL(this.state.pdfBlobUrl);
        }

        this.setState({ selectedPath: relativePath, pdfBlobUrl: '', fileType: '' });

        try {
            const streamUrl = `/home/docs/pdfs/stream?path=${encodeURIComponent(relativePath)}`;

            const response = await fetch(streamUrl, {
                method: 'GET',
                headers: getHeadersNoAuthJson(),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Document download error. Status: ${response.status}`);
            }

            // Extract the true content type header from your Cloudflare/API response
            const contentType = response.headers.get('Content-Type') || '';

            const blob = await response.blob();
            const localBlobUrl = URL.createObjectURL(blob);

            this.setState({
                pdfBlobUrl: localBlobUrl,
                fileType: contentType
            });
        } catch (error) {
            console.error("Failed to proxy frame target source:", error);
        }
    };

    render() {
        const { pdfTree, selectedPath, pdfBlobUrl, fileType, isSidebarOpen, searchQuery } = this.state;

        const filteredTree = pdfTree ? pdfTree.filter(node => {
            if (!searchQuery) return true;
            const checkNodeDeep = (n) => {
                if (n.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
                if (n.children) return n.children.some(checkNodeDeep);
                return false;
            };
            return checkNodeDeep(node);
        }) : [];

        // Check if the current file type is an image
        const isImage = fileType.startsWith('image/');

        return (
            <div className="container-fluid" style={{ padding: '20px' }}>
                <div className="mb-3 d-flex align-items-center">
                    <Button color="secondary" outline size="sm" onClick={this.toggleSidebar}>
                        {isSidebarOpen ? ' Hide Media Library' : ' Show Media Library'}
                    </Button>
                </div>

                <Row>
                    {/* Collapsible Sidebar Navigator */}
                    {isSidebarOpen && (
                        <Col md="3" style={{ borderRight: '1px solid #dee2e6', maxHeight: '85vh', overflowY: 'auto' }}>
                            <div className="mb-3">
                                <Input
                                    type="text"
                                    placeholder="Search library..."
                                    value={searchQuery}
                                    onChange={this.handleSearchChange}
                                    size="sm"
                                />
                            </div>
                            <h4 className="mb-3" style={{ fontSize: '1.25rem' }}>Explorer</h4>
                            {filteredTree.length > 0 ? (
                                filteredTree.map((childNode, idx) => (
                                    <DocsTreeNode
                                        key={idx}
                                        node={childNode}
                                        onPdfSelect={this.handlePdfSelect}
                                        selectedPath={selectedPath}
                                        searchFilter={searchQuery}
                                    />
                                ))
                            ) : (
                                <div className="text-muted small pl-2">
                                    {pdfTree ? "No matching files found." : "Loading explorer..."}
                                </div>
                            )}
                        </Col>
                    )}

                    {/* Full Canvas Viewport Presentation Block */}
                    <Col md={isSidebarOpen ? "9" : "12"} style={{ paddingLeft: isSidebarOpen ? '30px' : '15px' }}>
                        {selectedPath ? (
                            <div style={{ width: '100%', height: '82vh', borderRadius: '4px', border: '1px solid #ccc', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
                                {pdfBlobUrl ? (
                                    isImage ? (
                                        <img
                                            src={pdfBlobUrl}
                                            alt="Loaded asset preview"
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <embed
                                            src={pdfBlobUrl}
                                            type="application/pdf"
                                            width="100%"
                                            height="100%"
                                        />
                                    )
                                ) : (
                                    <div className="text-center text-muted">
                                        Streaming document structure bytes safely...
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-muted text-center" style={{ marginTop: '180px' }}>
                                <h3>No File Loaded</h3>
                                <p>Select an asset from the repository list tree to render its content view panel.</p>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default HomeDocs;