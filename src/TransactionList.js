import React, { Component } from 'react'
import { Container, Table, Modal, ModalHeader } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import {Toast, ToastBody, ToastHeader, Spinner} from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {CardPanel, Icon, Card} from 'react-materialize';
import { NumberFormat } from "./utils/NumberFormat";
import { Button } from 'semantic-ui-react'

class TransactionList extends Component {

  constructor() {
    super();
    this.state = {
      transactions: [],
      count: 0,
      lastTransactionDate: "",
      transactionModalShow: false,
      tranDetails: []
    };
  }

  showModal = (event) => {
    console.log("event: ", event.target.getAttribute("id"))

    let tranDetails = [];

    fetch("/fin/bank/transactions/" + event.target.getAttribute("id"))
        .then(response => response.json())
        .then(data => {
              tranDetails[1] = data.id;
              tranDetails[2] = data.date;
              tranDetails[3] = data.debit;
              tranDetails[4] = data.credit;
              tranDetails[5] = data.head;
              tranDetails[6] = data.description;

              this.setState(
                  { tranDetails: tranDetails }
              );
              this.setState({transactionModalShow: !this.state.transactionModalShow});
        }
    );
  };

  hideModal = () => {
    this.setState({ transactionModalShow: !this.state.transactionModalShow});
  };

  async componentDidMount() {
    const response = await fetch('/fin/bank/transactions');
    const body = await response.json();
    this.setState({
        transactions: body.transactions,
        count: body.count,
        lastTransactionDate: body.lastTransactionDate
    });
  }

  downloadTransactions = () => {
  		fetch('/fin/report/download')
  			.then(response => {
  				response.blob().then(blob => {
  					let url = window.URL.createObjectURL(blob);
  					let a = document.createElement('a');
  					a.href = url;
  					a.download = 'transactions.csv';
  					a.click();
  				});
  				//window.location.href = response.url;
  		});
  	}

  render() {
    const {transactions} = this.state;
    const {count} = this.state;
    const {lastTransactionDate} = this.state;
    const {tranDetails} = this.state;
    const {transactionModalShow} = this.state;
    const title = "Transactions (" + count + ")";

    const transactionList = transactions.map(transaction => {
        return <tr id={transaction.id} style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} onClick={this.showModal}>
                <td id={transaction.id} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{format(parseISO(transaction.date), 'dd MMM yyyy')}</td>
                <td id={transaction.id} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{transaction.head}</td>
                <td id={transaction.id} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormat(transaction.credit)}</td>
                <td d={transaction.id} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormat(transaction.debit)}</td>
                <td id={transaction.id} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{transaction.bank}</td>
                <td id={transaction.id} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{transaction.subHead}</td>
            </tr>
    });

    return (
         <div className="teal lighten-5">
             <AppNavbar title="Bank Transaction"/>
                <Container fluid>
                <Card
                      className="teal lighten-4"
                      textClassName="black-text"
                    >
                    <div style={{float: 'right'}}>
                      <Button.Group basic size='medium'>
                        <Button icon='download' onClick={this.downloadTransactions} />
                      </Button.Group>
                    </div>
                    <div>
                    <Table className="mt-4" hover>
                        <thead>
                          <tr>
                            <th width="10%" style={{textAlign: "center", fontSize: '1rem'}}>Date</th>
                            <th width="10%" style={{textAlign: "center", fontSize: '1rem'}}>Head</th>
                            <th width="10%" style={{textAlign: "right", fontSize: '1rem'}}>Debit</th>
                            <th width="10%" style={{textAlign: "right", fontSize: '1rem'}}>Credit</th>
                            <th width="10%" style={{textAlign: "center", fontSize: '1rem'}}>Bank</th>
                            <th width="10%" style={{textAlign: "center", fontSize: '1rem'}}>Sub Head</th>
                          </tr>
                        </thead>
                        <tbody>
                        {transactionList}
                        </tbody>
                    </Table>
                    <Modal isOpen={transactionModalShow} onClose={this.hideModal} contentLabel="Expenses">
                    <ModalHeader toggle={this.hideModal}/>
                      <Table striped bordered hover>
                        <thead >
                          <tr>
                            <th style={{textAlign: "center", fontSize: '1rem'}}>Field</th>
                            <th style={{textAlign: "center", fontSize: '1rem'}}>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}}>Id</td>
                            <td style={{textAlign: "left", fontSize: '.8rem', whiteSpace: 'wrap'}}>{tranDetails[1]}</td>
                          </tr>
                          <tr>
                            <td style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}}>Date</td>
                            <td style={{textAlign: "left", fontSize: '.8rem', whiteSpace: 'wrap'}}>{tranDetails[2]}</td>
                          </tr>
                          <tr>
                            <td style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}}>Debit</td>
                            <td style={{textAlign: "left", fontSize: '.8rem', whiteSpace: 'wrap'}}>{tranDetails[3]}</td>
                          </tr>
                          <tr>
                            <td style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}}>Credit</td>
                            <td style={{textAlign: "left", fontSize: '.8rem', whiteSpace: 'wrap'}}>{tranDetails[4]}</td>
                          </tr>
                          <tr>
                            <td style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}}>Head</td>
                            <td style={{textAlign: "left", fontSize: '.8rem', whiteSpace: 'wrap'}}>{tranDetails[5]}</td>
                          </tr>
                          <tr>
                            <td style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}}>Description</td>
                            <td style={{textAlign: "left", fontSize: '.8rem', whiteSpace: 'wrap'}}>{tranDetails[6]}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Modal>
                    </div>
                    </Card>
                </Container>
         </div>
    );
  }
}
export default TransactionList;
