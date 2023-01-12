import React, { Component } from 'react'
import { Container, Table } from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormat } from "./utils/NumberFormat";
import { Button, Modal } from 'semantic-ui-react';

class OdionTransactionList extends Component {

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
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));

      var requestOptions = {
        method: 'GET',
        headers: myHeaders
      };
    const response = await fetch('/home/api/odion/transactions', requestOptions);
    const body = await response.json();
    this.setState({
        transactions: body.transactions
    });
  }

  render() {
    const {transactions} = this.state;

    const transactionList = transactions.map(transaction => {
        return <tr id={transaction.id} style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} onClick={this.showModal}>
                <td id={transaction.id} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{format(parseISO(transaction.date), 'dd MMM yyyy')}</td>
                <td id={transaction.id} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{transaction.particular}</td>
                <td id={transaction.id} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{transaction.debitAccount}</td>
                <td id={transaction.id} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{transaction.creditAccount}</td>
                <td id={transaction.id} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormat(transaction.amount)}</td>
            </tr>
    });

    return (
            <div id="cards" align="center" >
                <Card
                      className="teal lighten-4"
                      textClassName="black-text"
                    >
                    <div>
                    <Table className="mt-4" hover>
                        <thead>
                          <tr>
                            <th width="10%" style={{textAlign: "center", fontSize: '1rem'}}>Date</th>
                            <th width="10%" style={{textAlign: "center", fontSize: '1rem'}}>Particular</th>
                            <th width="10%" style={{textAlign: "center", fontSize: '1rem'}}>Debit Account</th>
                            <th width="10%" style={{textAlign: "center", fontSize: '1rem'}}>Credit Account</th>
                            <th width="10%" style={{textAlign: "right", fontSize: '1rem'}}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                        {transactionList}
                        </tbody>
                    </Table>
                    </div>
                    </Card>
            </div>
    );
  }
}
export default OdionTransactionList;
