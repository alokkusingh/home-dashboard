import React, { Component } from 'react'
import { Container, Table } from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { Button, Modal } from 'semantic-ui-react';

class OdionSummary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accountsBalance: [],
      count: 0,
      lastTransactionDate: "",
      transactionModalShow: false,
      tranDetails: []
    };
  }

  async componentDidMount() {
    const response = await fetch('/fin/odion/accounts');
    const body = await response.json();
    this.setState({
        accountsBalance: body.accountBalances
    });
  }

  render() {
    const {accountsBalance} = this.state;

    const accountsBalanceList = accountsBalance.map(record => {
        if (record.balance < 0)
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} onClick={this.showModal}>
                  <td style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{record.account}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(Math.abs(record.balance))}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(0)}</td>
                </tr>
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} onClick={this.showModal}>
                  <td style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{record.account}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(0)}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(record.balance)}</td>
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
                            <th width="10%" style={{textAlign: "center", fontSize: '1rem'}}>Account</th>
                            <th width="10%" style={{textAlign: "right", fontSize: '1rem'}}>Debit</th>
                            <th width="10%" style={{textAlign: "right", fontSize: '1rem'}}>Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                        {accountsBalanceList}
                        </tbody>
                    </Table>
                    </div>
                    </Card>
            </div>
    );
  }
}
export default OdionSummary;
