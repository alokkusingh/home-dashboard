import React, { Component } from 'react'
import { Button, ButtonGroup, Container, Table, Modal, ModalHeader } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import {Toast, ToastBody, ToastHeader, Spinner} from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {CardPanel, Icon, Card} from 'react-materialize';
import { NumberFormat } from "./utils/NumberFormat";

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
    console.log("event: ", event.target.getAttribute("tranId"))

    let tranDetails = [];

    fetch("/fin/bank/transactions/" + event.target.getAttribute("tranId"))
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
        return <tr key={transaction.id} onClick={this.showModal}>
                <td tranId={transaction.id} style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(transaction.date), 'dd MMM yyyy')}</td>
                <td tranId={transaction.id} style={{textAlign: "center"}}>{transaction.head}</td>
                <td tranId={transaction.id} style={{textAlign: "right"}}>{NumberFormat(transaction.credit)}</td>
                <td tranId={transaction.id} style={{textAlign: "right"}}>{NumberFormat(transaction.debit)}</td>
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
                      <a
                        href="#" onClick={this.downloadTransactions}
                        class="waves-effect waves-light btn-small">
                            <i class="material-icons right"></i>
                            Download
                      </a>
                    </div>
                    <div>

                    <Table className="mt-4" hover="true">
                        <thead>
                          <tr>
                            <th width="10%" style={{textAlign: "center"}}>Date</th>
                            <th width="10%" style={{textAlign: "center"}}>Head</th>
                            <th width="10%" style={{textAlign: "right"}}>Debit</th>
                            <th width="10%" style={{textAlign: "right"}}>Credit</th>
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
                            <th>Field</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Id</td>
                            <td>{tranDetails[1]}</td>
                          </tr>
                          <tr>
                            <td>Date</td>
                            <td>{tranDetails[2]}</td>
                          </tr>
                          <tr>
                            <td>Debit</td>
                            <td>{tranDetails[3]}</td>
                          </tr>
                          <tr>
                            <td>Credit</td>
                            <td>{tranDetails[4]}</td>
                          </tr>
                          <tr>
                            <td>Head</td>
                            <td>{tranDetails[5]}</td>
                          </tr>
                          <tr>
                            <td>Description</td>
                            <td>{tranDetails[6]}</td>
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
