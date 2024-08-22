import {React, Component} from 'react'
import { Table, Row, Col, Modal, ModalHeader} from 'reactstrap';
import {Card} from 'react-materialize';
import {
  FormInput,
  Button,
  ButtonGroup,
  ButtonOr,
  Form,
  Segment,
  Divider,
  Label,
  Icon,
  Dimmer,
  Loader
} from 'semantic-ui-react'
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { formatDate } from "./utils/FormatDate";

import {submitExpenseForm} from './api/FormAPIManager.js'
import {fetchUnverifiedTransactionEmailsJson, updateEmailTransactionAccepted, updateEmailTransactionRejected} from './api/EmailAPIManager.js'

class FormExpense extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formInProgress: false,
      copiedFromUnverifiedTrans: false,
      transactionEmailRecords: [],
      transactionEmailIdRecordMap: new Map(),
      transactionModalShow: false,
      transactionRow: ""
    }
  }

  async componentDidMount() {
     await Promise.all([
        fetchUnverifiedTransactionEmailsJson().then(this.handleUnverifiedTransactionEmails)
     ]);
     // All fetch calls are done now
      console.log(this.state);
  }

  handleUnverifiedTransactionEmails = (records) => {
     this.setState({ transactionEmailRecords: records });
     let transactionEmailIdRecordMap = new Map();
     records.map(record => {
        transactionEmailIdRecordMap.set(record.id, record);
     });
     this.setState({ transactionEmailIdRecordMap: transactionEmailIdRecordMap });
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = async() => {
    this.setState({formInProgress: true});
    const { head, amount, comment, copiedFromUnverifiedTrans, id } = this.state
    try {
      await submitExpenseForm(head, amount, comment);
      this.setState({ head: '', amount: '', comment: '' });
      if (copiedFromUnverifiedTrans) {
        console.log("Copied from unverified transaction");
        try {
          await updateEmailTransactionAccepted(id, head, amount, comment);
        } catch(err) {
          alert(err);
        }
        await Promise.all([
          fetchUnverifiedTransactionEmailsJson().then(this.handleUnverifiedTransactionEmails)
        ]);
        this.setState({ copiedFromUnverifiedTrans: false, id: '' });
      }
    } catch(err) {
      alert(err);
    }
    this.setState({formInProgress: false});
  }

  handleAccept = async(event) => {
    const { transactionEmailIdRecordMap} = this.state
    const id = event.target.getAttribute("transId");
    console.log("Accepted: " + id);
    console.log(transactionEmailIdRecordMap.get(id));
    this.handleChange(event, {
      name: "amount",
      value: transactionEmailIdRecordMap.get(id).amount
    })
    this.handleChange(event, {
      name: "comment",
      value: transactionEmailIdRecordMap.get(id).description
    })
    this.handleChange(event, {
      name: "id",
      value: id
    })
    this.handleChange(event, {
      name: "copiedFromUnverifiedTrans",
      value: true
    })

  }
  handleReject = async(event) => {
    const id = event.target.getAttribute("transId");
    console.log("Rejected: " + id);
    try {
      await updateEmailTransactionRejected(id);
    } catch(err) {
      alert(err);
    }
    await Promise.all([
      fetchUnverifiedTransactionEmailsJson().then(this.handleUnverifiedTransactionEmails)
    ]);
  }

  showModal = (event) => {
      let id = event.target.getAttribute("transId");
      console.log("event: " + id)
      const { transactionEmailIdRecordMap} = this.state
      const transactionEmailRecord = transactionEmailIdRecordMap.get(id);
      const transactionRow = [];
      Object.keys(transactionEmailRecord).forEach(
        function(key) {
          transactionRow.push(
            <tr>
             <td style={{whiteSpace: 'nowrap', textAlign: "Left", fontSize: '.8rem'}}>{key}</td>
             <td style={{whiteSpace: 'nowrap', textAlign: "Left", fontSize: '.8rem'}}>{transactionEmailRecord[key]}</td>
            </tr>
          )
      });
      this.setState({ transactionRow: transactionRow });
      this.setState({ transactionModalShow: !this.state.transactionModalShow });
    };

    hideModal = () => {
      this.setState({ transactionModalShow: !this.state.transactionModalShow});
    };

  render() {
    const { head, amount, comment, formInProgress, transactionEmailRecords, transactionRow, transactionModalShow} = this.state

    const transactionTableRows = transactionEmailRecords.map(record => {
      return <tr key={record.id}  >
        <td transId={record.id} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}} onClick={this.showModal}>{formatDate(record.timestamp, 'dd MMM')}</td>
        <td transId={record.id} style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.9rem'}} onClick={this.showModal}>{NumberFormatNoDecimal(record.amount,)}</td>
        <td transId={record.id} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>
            <ButtonGroup>
              <Button transId={record.id} positive onClick={this.handleAccept}>Accept</Button>
              <ButtonOr />
              <Button transId={record.id} negative onClick={this.handleReject}>Reject</Button>
            </ButtonGroup>
        </td>
      </tr>
    });

    return (
<div id="cards" align="left" >
<Row>
  <Col m={6} s={6} l={6}>
      <Segment raised color="brown">
        <Dimmer active={formInProgress}>
          <Loader>Submitting</Loader>
        </Dimmer>
        <Label ribbon size="huge">Expense Entry Form</Label>
        <Divider />
        <Form inverted size="large" onSubmit={this.handleSubmit} success error>
          <Segment inverted color="brown">
            <FormInput label="Head" placeholder='Head' name='head' value={head} onChange={this.handleChange} width={6} required />
            <FormInput label="Amount" placeholder='Amount' name='amount' value={amount} onChange={this.handleChange} width={5} required type="number"/>
            <FormInput label="Comment" placeholder='Comment' name='comment' value={comment} onChange={this.handleChange} width={10}  />
          </Segment>
          <Button type='submit' loading={formInProgress} color='teal' size='large' icon labelPosition='right'>
            Submit
            <Icon name='send' />
          </Button>
        </Form>
      </Segment>
  </Col>
</Row>
<Row>
  <Col>
    <Card className="teal lighten-4" textClassName="black-text" title="Unverified Transactions" >
      <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th width="10%" style={{textAlign: "center"}}>Date</th>
              <th width="10%" style={{textAlign: "center"}}>Amount</th>
              <th width="10%" style={{textAlign: "center"}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactionTableRows}
          </tbody>
      </Table>
      <Modal isOpen={transactionModalShow} onClose={this.hideModal} contentLabel="Transaction" modalClassName="custom-modal-style">
        <ModalHeader toggle={this.hideModal}>Transaction Details</ModalHeader>
        <Table bordered hover>
           <thead>
             <tr>
               <th>Head</th>
               <th>Value</th>
             </tr>
           </thead>
           <tbody>
             {transactionRow}
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

export default FormExpense
