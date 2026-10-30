import React, { Component } from 'react';
import { Col, Row, Button, Input, Spinner } from 'reactstrap';
import { fetchDocsTreeJson } from './api/DocsAPIManager.js';
import { getHeadersNoAuthJson } from "./api/APIUtils";

// Enhanced Folder Tree Node Component
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

    toggleOpen = (e) => {
        e.stopPropagation();
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
                        {/* Smooth CSS transition style alternative */}
                        <span style={{ fontSize: '0.75rem', color: '#6c757d', display: 'inline-block', width: '12px' }}>
                            {isOpen ? '▼' : '▶'}
                        </span>
                        <span>{isOpen ? '📂' : '📁'}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name}</span>
                    </div>
                    {isOpen && node.children && (
                        <div style={{ borderLeft: '1px dashed #ced4da', marginLeft: '14px', paddingLeft: '4px' }}>
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
                    padding: '6px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? '#28a745' : 'transparent',
                    color: isSelected ? '#fff' : '#495057',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '2px',
                    transition: 'all 0.15s ease-in-out'
                }}
            >
                <span>📄</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
            </div>
        );
    }
}

// Optimized Media Dashboard
class HomeDocs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pdfTree: null,
            selectedPath: '',
            pdfBlobUrl: '',
            fileType: '',
            isSidebarOpen: true,
            searchQuery: '',
            isLoadingFile: false // Added state rule to show spinner during fetch streams
        };
    }

    async componentDidMount() {
        try {
            const data = await fetchDocsTreeJson();
            this.setState({ pdfTree: data });
        } catch (error) {
            console.error("Error loading document configuration structure:", error);
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

        this.setState({ selectedPath: relativePath, pdfBlobUrl: '', fileType: '', isLoadingFile: true });

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

            const contentType = response.headers.get('Content-Type') || '';
            const blob = await response.blob();
            const localBlobUrl = URL.createObjectURL(blob);

            this.setState({
                pdfBlobUrl: localBlobUrl,
                fileType: contentType,
                isLoadingFile: false
            });
        } catch (error) {
            console.error("Failed to proxy frame target source:", error);
            this.setState({ isLoadingFile: false });
        }
    };

    // Safe File Download trigger using active stream blob references
    handleDownloadFile = () => {
        const { pdfBlobUrl, selectedPath } = this.state;
        if (!pdfBlobUrl) return;

        const filename = selectedPath.split('/').pop() || 'download';
        const link = document.createElement('a');
        link.href = pdfBlobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    render() {
        const { pdfTree, selectedPath, pdfBlobUrl, fileType, isSidebarOpen, searchQuery, isLoadingFile } = this.state;

        const filteredTree = pdfTree ? pdfTree.filter(node => {
            if (!searchQuery) return true;
            const checkNodeDeep = (n) => {
                if (n.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
                if (n.children) return n.children.some(checkNodeDeep);
                return false;
            };
            return checkNodeDeep(node);
        }) : [];

        const isImage = fileType.startsWith('image/');
        const currentFilename = selectedPath.split('/').pop() || '';

        return (
            <div className="container-fluid" style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div className="mb-3 d-flex align-items-center">
                    <Button color="secondary" outline size="sm" onClick={this.toggleSidebar}>
                        {isSidebarOpen ? '← Hide Explorer' : '→ Show Explorer'}
                    </Button>
                </div>

                <Row className="flex-grow-1" style={{ minHeight: 0 }}>
                    {/* Collapsible Sidebar Navigator */}
                    {isSidebarOpen && (
                        <Col md="3" className="d-flex flex-column" style={{ borderRight: '1px solid #dee2e6', height: '82vh' }}>
                            <div className="mb-2">
                                <Input
                                    type="text"
                                    placeholder="Search folders or files..."
                                    value={searchQuery}
                                    onChange={this.handleSearchChange}
                                    size="sm"
                                    style={{ borderRadius: '6px' }}
                                />
                            </div>
                            <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
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
                                    <div className="text-muted small pl-2 mt-2">
                                        {pdfTree ? "No matching files found." : "Loading explorer tree..."}
                                    </div>
                                )}
                            </div>
                        </Col>
                    )}

                    {/* Viewport Frame Presentation canvas block */}
                    <Col md={isSidebarOpen ? "9" : "12"} className="d-flex flex-column" style={{ paddingLeft: isSidebarOpen ? '24px' : '15px', height: '82vh' }}>
                        {selectedPath ? (
                            <div className="d-flex flex-column w-100 h-100" style={{ border: '1px solid #ced4da', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>

                                {/* Dynamic Content Preview Action Toolbar Block */}
                                <div className="d-flex justify-content-between align-items-center bg-light border-bottom px-3 py-2">
                                    <div style={{ maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500', color: '#495057' }}>
                                        {currentFilename}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button color="primary" size="sm" disabled={!pdfBlobUrl} onClick={this.handleDownloadFile}>
                                            💾 Download
                                        </Button>
                                        <a href={pdfBlobUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-sm btn-outline-secondary ${!pdfBlobUrl ? 'disabled' : ''}`}>
                                            ↗ Open In New Tab
                                        </a>
                                    </div>
                                </div>

                                {/* Active canvas screen wrapper frame */}
                                <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f8f9fa', position: 'relative' }}>
                                    {isLoadingFile ? (
                                        <div className="text-center text-muted">
                                            <Spinner size="md" color="secondary" className="mb-2" /><br />
                                            Streaming document bytes safely...
                                        </div>
                                    ) : pdfBlobUrl ? (
                                        isImage ? (
                                            <img
                                                src={pdfBlobUrl}
                                                alt="Asset preview container"
                                                style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: '4px' }}
                                            />
                                        ) : (
                                            <embed
                                                src={pdfBlobUrl}
                                                type="application/pdf"
                                                width="100%"
                                                height="100%"
                                            />
                                        )
                                    ) : null}
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted text-center m-auto">
                                <span style={{ fontSize: '3rem' }}>📂</span>
                                <h4 className="mt-2">No Document Selected</h4>
                                <p className="text-muted small">Select a directory asset from the explorer navigation panel to view its full content canvas.</p>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default HomeDocs;