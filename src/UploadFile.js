import React, { Component } from 'react';
import { Table, Row, Col, Modal, ModalHeader } from 'reactstrap';
import { Card } from 'react-materialize';
import {
    FormInput,
    Button,
    Form,
    Segment,
    Divider,
    Label,
    Icon,
    Dimmer,
    Loader
} from 'semantic-ui-react';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { uploadHeadersJson, fetch_retry_async_json } from './api/APIUtils';
import { fetchProcessedFilesJson } from './api/EtlAPIManager.js';
import { fetchTransactionsByStatementFileJson } from './api/BankAPIManager.js';
import { getOrCreateIdempotencyKey, clearIdempotencyKey } from './utils/IdempotencyUtils';

class UploadFile extends Component {
    state = {
        formInProgress: false,
        processedFiles: [],
        processedFilesCount: 0,
        fileTransactionsRow: [],
        fileTransactionModalShow: false
    }

    async componentDidMount() {
        try {
            const body = await fetchProcessedFilesJson();
            this.handleFetchProcessedFiles(body);
        } catch (error) {
            console.error("Failed to load processed files on mount:", error);
        }
    }

    handleFetchProcessedFiles = (body) => {
        if (body && body.files) {
            this.setState({
                processedFiles: body.files,
                processedFilesCount: body.count || 0
            });
        }
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    }

    handleSubmit = async () => {
        this.setState({ formInProgress: true });
        try {
            const fileInput = document.getElementById("fileInput");
            if (!fileInput || !fileInput.files[0]) {
                alert("Please select a valid file first!");
                this.setState({ formInProgress: false });
                return;
            }

            const formFile = fileInput.files[0];
            const fileName = formFile.name;
            console.log('Selected File:', fileName);

            let data = new FormData();
            data.append('file', formFile, fileName);

            const idempotencyKey = getOrCreateIdempotencyKey('upload-file-form');
            await this.uploadFile(data, idempotencyKey);
            clearIdempotencyKey('upload-file-form');

            this.setState({ file: '' });

            // Refresh the table list after a successful upload execution
            const body = await fetchProcessedFilesJson();
            this.handleFetchProcessedFiles(body);
        } catch (err) {
            alert("Upload failed: " + err);
        }
        this.setState({ formInProgress: false });
    }

    uploadFile = async (data, idempotencyKey) => {
        let requestOptions = {
            method: 'POST',
            headers: uploadHeadersJson(idempotencyKey),
            body: data
        };

        const responsePromise = await fetch_retry_async_json(
            '/home/etl/file/upload',
            requestOptions,
            1
        );
        return await responsePromise.json();
    }

    // 1. Changed to accept fileName directly, avoiding fragile event target lookups
    fileTransactionsShowModal = (fileName) => {
        if (!fileName) return;

        fetchTransactionsByStatementFileJson(fileName)
            .then(recordsJson => {
                if (!recordsJson || !recordsJson.transactions) return;

                // 2. Attached unique key parameters explicitly to tr loop mappings
                const transactionRows = recordsJson.transactions.map((record, index) => {
                    const uniqueKey = record.id || `trans-${record.date}-${index}`;
                    return (
                        <tr key={uniqueKey}>
                            <td style={{ whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem' }}>{record.date}</td>
                            <td style={{ whiteSpace: 'wrap', textAlign: "left", fontSize: '.8rem' }}>{record.head}</td>
                            <td style={{ whiteSpace: 'wrap', textAlign: "left", fontSize: '.8rem' }}>{record.subHead}</td>
                            <td style={{ whiteSpace: 'wrap', textAlign: "left", fontSize: '.8rem' }}>{record.bank}</td>
                            <td style={{ whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem' }}>{NumberFormatNoDecimal(record.debit)}</td>
                            <td style={{ whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem' }}>{NumberFormatNoDecimal(record.credit)}</td>
                            <td style={{ whiteSpace: 'wrap', textAlign: "left", fontSize: '.6rem' }}>{record.description}</td>
                        </tr>
                    );
                });

                this.setState({
                    fileTransactionsRow: transactionRows,
                    fileTransactionModalShow: true
                });
            })
            .catch(err => console.error("Error loading file transactions:", err));
    };

    hideFileTransactionModal = () => {
        this.setState({ fileTransactionModalShow: false });
    };

    render() {
        const { file, formInProgress, processedFiles, fileTransactionsRow, fileTransactionModalShow } = this.state;

        const processedFilesRows = processedFiles.map((record) => {
            // 3. Extracted event click parameters neatly using arrow function wrappers
            return (
                <tr key={record.name} style={{ cursor: 'pointer' }} onClick={() => this.fileTransactionsShowModal(record.name)}>
                    <td style={{ whiteSpace: 'nowrap', textAlign: "center", fontSize: '.8rem' }}>{record.id}</td>
                    <td style={{ whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem' }}>{record.date}</td>
                    <td style={{ whiteSpace: 'wrap', textAlign: "left", fontSize: '.9rem' }}>{record.name}</td>
                </tr>
            );
        });

        return (
            <div id="cards" align="left">
                <Row>
                    <Col m={6} s={6} l={6}>
                        <Segment raised color="brown">
                            <Dimmer active={formInProgress}>
                                <Loader>Uploading</Loader>
                            </Dimmer>
                            <Label ribbon size="huge">Upload Statement</Label>
                            <Divider />
                            <Segment inverted color="brown">
                                <Form inverted size="large" onSubmit={this.handleSubmit}>
                                    <FormInput id="fileInput" type="file" placeholder='File' name='file' value={file || ''} onChange={this.handleChange} width={6} required />
                                    <Button type='submit' loading={formInProgress} color='teal' size='large' icon labelPosition='right'>
                                        Upload
                                        <Icon name='upload' />
                                    </Button>
                                </Form>
                            </Segment>
                        </Segment>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Card className="teal lighten-4" textClassName="black-text" title="Processed Files">
                            <Table striped bordered hover size="sm">
                                <thead>
                                <tr>
                                    <th width="1%" style={{ textAlign: "center" }}>ID</th>
                                    <th width="2%" style={{ textAlign: "center" }}>Date</th>
                                    <th width="5%" style={{ textAlign: "left" }}>Name</th>
                                </tr>
                                </thead>
                                <tbody>
                                {processedFilesRows}
                                </tbody>
                            </Table>

                            {/* 4. Swapped out invalid onClose wrapper for Reactstrap's toggle configuration */}
                            <Modal isOpen={fileTransactionModalShow} toggle={this.hideFileTransactionModal} contentLabel="Transaction" className="custom-modal-style" size="lg">
                                <ModalHeader toggle={this.hideFileTransactionModal}>File Transactions</ModalHeader>
                                <div style={{ padding: '1rem', overflowX: 'auto' }}>
                                    <Table bordered hover>
                                        <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Head</th>
                                            <th>Sub Head</th>
                                            <th>Bank</th>
                                            <th>Debit</th>
                                            <th>Credit</th>
                                            <th>Description</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {fileTransactionsRow}
                                        </tbody>
                                    </Table>
                                </div>
                            </Modal>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default UploadFile;