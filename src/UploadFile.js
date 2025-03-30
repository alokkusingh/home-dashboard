import React, { Component } from 'react';
import { Table, Row, Col, Modal, ModalHeader} from 'reactstrap';
import {Card} from 'react-materialize';
import {
  FormInput,
  Button,
  Form,
  Segment,
  Divider,
  Label,
  Container,
  Header,
  Icon,
  Dimmer,
  Loader
} from 'semantic-ui-react'
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import {uploadHeadersJson, fetch_retry_async_json} from './api/APIUtils'
import {fetchProcessedFilesJson} from './api/EtlAPIManager.js'
import {fetchTransactionsByStatementFileJson} from './api/BankAPIManager.js'

class UploadFile extends Component {

  state = {
    formInProgress: false,
    processedFiles: [],
    processedFilesCount: 0,
    fileTransactionsRow: [],
    fileTransactionModalShow: false
  }

  async componentDidMount() {

    await Promise.all([
      fetchProcessedFilesJson().then(this.handleFetchProcessedFiles),
    ]);
    // All fetch calls are done now
    console.log(this.state);
  }

  handleFetchProcessedFiles = (body) => {
    console.log(body);
    this.setState({
        processedFiles: body.files,
        processedFilesCount: body.count
    });
  }

  handleChange = (e, { name, value }) => {
    console.log(e);
    console.log(name);
    console.log(value);
    console.log(document.getElementById("fileInput").files[0]);
    this.setState({ [name]: value });
  }

  handleSubmit = async() => {
    this.setState({formInProgress: true});
    const { file } = this.state
    try {

      const formFile = document.getElementById("fileInput").files[0];
      const fileName = formFile.name;
      console.log('Selected File', fileName);

      let data = new FormData();
      data.append('file', formFile, fileName);
      await this.uploadFile(data);
      this.setState({ file: ''});
    } catch(err) {
      alert(err);
    }
    this.setState({formInProgress: false});
  }

  uploadFile = async(data) => {

    console.log(data)
    let requestOptions = {
      method: 'POST',
      headers: uploadHeadersJson(),
      body: data
    };

    const responsePromise = await fetch_retry_async_json(
      '/home/etl/file/upload',
      requestOptions,
      1
    );
    const responseJson = await responsePromise.json();

    return responseJson;
  }

  fileTransactionsShowModal = (event) => {
    let fileName = event.target.getAttribute("transId");
    console.log("event: " + fileName)
    const transactionRow = [];

    fetchTransactionsByStatementFileJson(event.target.getAttribute("transId"))
        .then(recordsJson => {
            const transactionRows = recordsJson.transactions.map( record => {
                return <tr>
                    <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{record.date}</td>
                    <td style={{whiteSpace: 'wrap', textAlign: "Left" , fontSize: '.8rem'}}>{record.head}</td>
                    <td style={{whiteSpace: 'wrap', textAlign: "Left" , fontSize: '.8rem'}}>{record.subHead}</td>
                    <td style={{whiteSpace: 'wrap', textAlign: "Left" , fontSize: '.8rem'}}>{record.bank}</td>
                    <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(record.debit)}</td>
                    <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(record.credit)}</td>
                    <td style={{whiteSpace: 'wrap', textAlign: "Left" , fontSize: '.6rem'}}>{record.description}</td>
                 </tr>
            });
            this.setState({ fileTransactionsRow: transactionRows });
            this.setState({ fileTransactionModalShow: !this.state.fileTransactionModalShow });
        }
    );
  };

  hideFileTransactionModal = () => {
    this.setState({ fileTransactionModalShow: !this.state.fileTransactionModalShow});
  };

   render() {
        const { file, formInProgress, processedFiles, fileTransactionsRow, fileTransactionModalShow } = this.state

        const processedFilesRows = processedFiles.map(record => {
          return <tr key={record.name}  >
            <td transId={record.name} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.8rem'}} onClick={this.fileTransactionsShowModal}>{record.id}</td>
            <td transId={record.name} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}} onClick={this.fileTransactionsShowModal}>{record.date}</td>
            <td transId={record.name} style={{whiteSpace: 'wrap', textAlign: "left", fontSize: '.9rem'}} onClick={this.fileTransactionsShowModal}>{record.name}</td>
          </tr>
        });

        return (
        <div id="cards" align="left" >
          <Row>
            <Col m={6} s={6} l={6}>
              <Segment raised color="brown">
                <Dimmer active={formInProgress}>
                  <Loader>Uploading</Loader>
                </Dimmer>
                <Label ribbon size="huge">Upload Statement</Label>
                <Divider />
                <Segment inverted color="brown">
                  <Form inverted size="large" onSubmit={this.handleSubmit} success error>
                    <FormInput id="fileInput" type="file" placeholder='File' name='file' value={file} onChange={this.handleChange} width={6} required />
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
            <Card className="teal lighten-4" textClassName="black-text" title="Processed Files" >
                  <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th width="1%" style={{textAlign: "center"}}>ID</th>
                          <th width="2%" style={{textAlign: "center"}}>Date</th>
                          <th width="5%" style={{textAlign: "left"}}>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processedFilesRows}
                      </tbody>
                  </Table>
                  <Modal isOpen={fileTransactionModalShow} onClose={this.hideFileTransactionModal} contentLabel="Transaction" modalClassName="custom-modal-style">
                    <ModalHeader toggle={this.hideFileTransactionModal}>File Transactions</ModalHeader>
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
                   </Modal>
                </Card>
            </Col>
          </Row>
        </div>
        )
    }
}

export default UploadFile
