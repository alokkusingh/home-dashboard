import React, { Component } from 'react'
import { Table } from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormat } from "./utils/NumberFormat";
import { Button, Modal, Input } from 'semantic-ui-react';
import {fetchAllTransactionsJson, fetchTransactionByIdJson} from './api/BankAPIManager.js'
import {etlDownloadTransactions} from './api/EtlAPIManager.js'
import {searchTransactionsJson} from './api/SearchAPIManager.js'

class TransactionList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      count: 0,
      lastTransactionDate: "",
      transactionModalShow: false,
      tranDetails: []
    };
  }

  async componentDidMount() {

    await Promise.all([
      fetchAllTransactionsJson().then(this.handleAllTransactions),
    ]);
    // All fetch calls are done now
    console.log(this.state);
  }

  handleAllTransactions = (body) => {
    this.setState({
        transactions: body.transactions,
        count: body.count,
        lastTransactionDate: body.lastTransactionDate
    });
  }

  searchTransactionByDescription = async(event) => {
      console.log("event: ", event)
      var description = document.getElementById("search-input").value;
      console.log(Text)
      try {
        searchTransactionsJson(description).then(this.handleAllTransactions);
      } catch(err) {
        alert("Expense Refresh failed, error: " + err);
      }
  }

  searchClear = async(event) => {
        try {
          fetchAllTransactionsJson().then(this.handleAllTransactions);
        } catch(err) {
          alert("Expense Refresh failed, error: " + err);
        }
    }

  showModal = (event) => {
    console.log("event: ", event.target.getAttribute("id"))

    let tranDetails = [];
    fetchTransactionByIdJson(event.target.getAttribute("id"))
        .then(data => {
            tranDetails[1] = data.id;
            tranDetails[2] = data.date;
            tranDetails[3] = data.debit;
            tranDetails[4] = data.credit;
            tranDetails[5] = data.head;
            tranDetails[6] = data.description;

            this.setState(
              {
                tranDetails: tranDetails,
                transactionModalShow: !this.state.transactionModalShow
              }
            );
        }
    );
  };

  hideModal = () => {
    this.setState({ transactionModalShow: !this.state.transactionModalShow});
  };

  downloadTransactions = () => {
    etlDownloadTransactions();
  }

  render() {
    const {transactions} = this.state;
    const {tranDetails} = this.state;
    const {transactionModalShow} = this.state;

    const transactionList = transactions.map(transaction => {
        return <tr id={transaction.id} style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} onClick={this.showModal}>
                <td id={transaction.id} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{format(parseISO(transaction.date), 'dd MMM yyyy')}</td>
                <td id={transaction.id} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{transaction.head}</td>
                <td id={transaction.id} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormat(transaction.credit)}</td>
                <td id={transaction.id} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormat(transaction.debit)}</td>
                <td id={transaction.id} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{transaction.bank}</td>
                <td id={transaction.id} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{transaction.subHead}</td>
            </tr>
    });

    return (
            <div id="cards" align="center" >
                <Card
                      className="teal lighten-4"
                      textClassName="black-text"
                    >
                    <div style={{float: 'left'}}>
                      <Input id='search-input' type='text' placeholder='Search...' action>
                          <input />
                          <Button type='button' onClick={this.searchTransactionByDescription}>Search</Button>
                          <Button type='button' onClick={this.searchClear}>Reset</Button>
                      </Input>
                    </div>
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
                    <Modal size='tiny' open={transactionModalShow} onClose={this.hideModal}>
                      <Modal.Header>Transaction Details</Modal.Header>
                      <Modal.Content>
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
                      </Modal.Content>
                      <Modal.Actions>
                        <Button positive onClick={this.hideModal}>
                          Close
                        </Button>
                      </Modal.Actions>
                    </Modal>
                    </div>
                    </Card>
            </div>
    );
  }
}
export default TransactionList;
