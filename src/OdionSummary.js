import React, { Component } from 'react'
import { Container, Table, Modal, ModalHeader } from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";

class OdionSummary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accountsBalance: [],
      count: 0,
      lastTransactionDate: "",
      transactionModalShow: false,
      accountTransactionsRows: ""
    };
  }

    showModal = (event) => {
      console.log("event: ", event.target.getAttribute("id"))

      fetch("/fin/odion/transactions/" + event.target.getAttribute("id"))
          .then(response => response.json())
          .then(transactionsJson => {
              const accountTransactionsRows = transactionsJson.transactions.map( transaction => {
                  return <tr>
                      <td style={{whiteSpace: 'nowrap', textAlign: "Left", fontSize: '.8rem'}}>{format(parseISO(transaction.date), 'dd MMM yyyy')}</td>
                      <td style={{whiteSpace: 'wrap', textAlign: "Left" , fontSize: '.8rem'}}>{transaction.particular}</td>
                      <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(transaction.debit)}</td>
                      <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(transaction.credit)}</td>
                   </tr>
              });
              this.setState({ accountTransactionsRows: accountTransactionsRows });
              this.setState({ transactionModalShow: !this.state.transactionModalShow });
          }
      );
    };

    hideModal = () => {
      this.setState({ transactionModalShow: !this.state.transactionModalShow});
    };

  async componentDidMount() {
    const response = await fetch('/fin/odion/accounts');
    const body = await response.json();
    this.setState({
        accountsBalance: body.accountBalances
    });
  }

  render() {
    const {
      accountsBalance,
      transactionModalShow,
      accountTransactionsRows
    } = this.state;

    const accountsBalanceList = accountsBalance.map(record => {
        if (record.balance < 0)
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} onClick={this.showModal}>
                  <td id={record.account} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{record.account}</td>
                  <td id={record.account} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(Math.abs(record.balance))}</td>
                  <td id={record.account} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(0)}</td>
                </tr>
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} onClick={this.showModal}>
                  <td id={record.account} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{record.account}</td>
                  <td id={record.account} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(0)}</td>
                  <td id={record.account} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(record.balance)}</td>
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
                    <Modal isOpen={transactionModalShow} onClose={this.hideModal} contentLabel="AccountTransactions">
                      <ModalHeader toggle={this.hideModal}/>
                      <Table striped bordered hover>
                         <thead >
                           <tr>
                             <th>Date</th>
                             <th>Particular</th>
                             <th>Debit</th>
                             <th>Credit</th>
                           </tr>
                         </thead>
                         <tbody>
                           {accountTransactionsRows}
                         </tbody>
                       </Table>
                    </Modal>
                    </div>
                    </Card>
            </div>
    );
  }
}
export default OdionSummary;
