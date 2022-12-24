import React, { Component } from 'react'
import { Container, Table, Row, Col, Modal, ModalHeader } from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import OdionExpensesPiChart from "./charts/odionExpensesPiChart";
import OdionFundingsPiChart from "./charts/odionFundingsPiChart";

class OdionSummary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accountsBalance: [],
      count: 0,
      lastTransactionDate: "",
      transactionModalShow: false,
      accountTransactionsRows: "",
      monthlyInterests: [],
      monthlyMaxGains: [],
      monthlySavings: [],
      monthlyOdions: [],
      monthlyMiscs: [],
      expenses: [],
      fundings: [],
      total: 0
    };
  }

  showModal = (event) => {
    console.log("event: ", event.target.getAttribute("id"))

    fetch("/home/api/odion/transactions/" + event.target.getAttribute("id"))
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
    const response = await fetch('/home/api/odion/accounts');
    const body = await response.json();
    this.setState({
        accountsBalance: body.accountBalances
    });
    const expenses = [];
    const fundings = [];
    var total = 0;
    body.accountBalances.map(record => {
          if (record.account === 'INTEREST') {
             expenses.push({
               'head': 'Interest',
               'amount': Math.abs(record.balance)
            });
            total += Math.abs(record.balance);
          }
          if (record.account === 'ODION') {
             expenses.push({
               'head': 'Odion',
               'amount': Math.abs(record.balance)
            });
            total += Math.abs(record.balance);
          }
          if (record.account === 'MISC') {
             expenses.push({
               'head': 'Miscellaneous',
               'amount': Math.abs(record.balance)
            });
            total += Math.abs(record.balance);
          }

          if (record.account === 'SAVING') {
             fundings.push({
               'head': 'Saving',
               'amount': Math.abs(record.balance)
            });
          }
          if (record.account === 'SBI_MAX_GAIN') {
             fundings.push({
               'head': 'SBI Max Gain',
               'amount': Math.abs(record.balance)
            });
          }
       }
     );
     this.setState({
         fundings: fundings
     });
     this.setState({
         expenses: expenses
     });
     this.setState({
         total: total
     });
     const monthlyResponse = await fetch('/home/api/odion/monthly/transaction');
     const bodyMonthly = await monthlyResponse.json();
     const interests = bodyMonthly.accountMonthTransaction.INTEREST;
     const monthlyInterests = [];
     Object.keys(interests).forEach(
         yearMonth => {
            monthlyInterests.push({
              'month': yearMonth,
              'amount': interests[yearMonth]
            });
         }
     );
     this.setState({ monthlyInterests: monthlyInterests });

     const sbiMaxGain = bodyMonthly.accountMonthTransaction.SBI_MAX_GAIN;
     const monthlyMaxGains = [];
     Object.keys(sbiMaxGain).forEach(
          yearMonth => {
             monthlyMaxGains.push({
               'month': yearMonth,
               'amount': sbiMaxGain[yearMonth]
             });
          }
     );
     this.setState({ monthlyMaxGains: monthlyMaxGains });


     const saving = bodyMonthly.accountMonthTransaction.SAVING;
     const monthlySavings = [];
     Object.keys(saving).forEach(
          yearMonth => {
             monthlySavings.push({
               'month': yearMonth,
               'amount': saving[yearMonth]
             });
          }
     );
     this.setState({ monthlySavings: monthlySavings });

     const odion = bodyMonthly.accountMonthTransaction.ODION;
     const monthlyOdions = [];
     Object.keys(odion).forEach(
          yearMonth => {
             monthlyOdions.push({
               'month': yearMonth,
               'amount': odion[yearMonth]
             });
          }
     );
     this.setState({ monthlyOdions: monthlyOdions });

     const misc = bodyMonthly.accountMonthTransaction.MISC;
     const monthlyMiscs = [];
     Object.keys(misc).forEach(
          yearMonth => {
             monthlyMiscs.push({
               'month': yearMonth,
               'amount': misc[yearMonth]
             });
          }
     );
     this.setState({ monthlyMiscs: monthlyMiscs });
  }

  render() {
    const {
      accountsBalance,
      transactionModalShow,
      accountTransactionsRows,
      monthlyInterests,
      monthlyMaxGains,
      monthlySavings,
      monthlyOdions,
      monthlyMiscs,
      expenses,
      fundings,
      total
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

    const monthlyInterestRows = monthlyInterests.map(record => {
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} >
                  <td style={{whiteSpace: 'nowrap', textAlign: "Center", fontSize: '.8rem'}}>{format(parseISO(record.month), 'MMM yyyy')}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(record.amount)}</td>
                </tr>
    });

    const monthlyMaxGainRows = monthlyMaxGains.map(record => {
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} >
                  <td style={{whiteSpace: 'nowrap', textAlign: "Center", fontSize: '.8rem'}}>{format(parseISO(record.month), 'MMM yyyy')}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(record.amount)}</td>
                </tr>
    });
    const monthlySavingRows = monthlySavings.map(record => {
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} >
                  <td style={{whiteSpace: 'nowrap', textAlign: "Center", fontSize: '.8rem'}}>{format(parseISO(record.month), 'MMM yyyy')}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(record.amount)}</td>
                </tr>
    });
    const monthlyOdionRows = monthlyOdions.map(record => {
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} >
                  <td style={{whiteSpace: 'nowrap', textAlign: "Center", fontSize: '.8rem'}}>{format(parseISO(record.month), 'MMM yyyy')}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(record.amount)}</td>
                </tr>
    });
    const monthlyMiscRows = monthlyMiscs.map(record => {
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} >
                  <td style={{whiteSpace: 'nowrap', textAlign: "Center", fontSize: '.8rem'}}>{format(parseISO(record.month), 'MMM yyyy')}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(record.amount)}</td>
                </tr>
    });
    return (
            <div id="cards" align="center" >
              <Row>
               <Col m={6} s={6} l={6}>
                <Card className="teal lighten-4" textClassName="black-text">
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
                   </Col>
                    <Col m={6} s={6} l={6}>
                       <Card className="teal lighten-4" textClassName="black-text">
                         <div>
                           <OdionExpensesPiChart data={expenses} total={total} />
                         </div>
                       </Card>
                    </Col>
                    <Col m={6} s={6} l={6}>
                       <Card className="teal lighten-4" textClassName="black-text">
                         <div>
                           <OdionFundingsPiChart data={fundings} total={total} />
                         </div>
                       </Card>
                    </Col>
                </Row>
                <Row>
                  <Col m={6} s={6} l={6}>
                    <Card className="teal lighten-4" textClassName="black-text" title="Interest">
                       <div>
                         <Table striped bordered hover size="sm">
                           <thead>
                             <tr>
                               <th width="10%" style={{textAlign: "center"}}>Month</th>
                               <th width="10%" style={{textAlign: "center"}}>Amount</th>
                             </tr>
                           </thead>
                           <tbody>
                             {monthlyInterestRows}
                           </tbody>
                         </Table>
                       </div>
                     </Card>
                  </Col>
                  <Col m={6} s={6} l={6}>
                    <Card className="teal lighten-4" textClassName="black-text" title="Max Gain">
                       <div>
                         <Table striped bordered hover size="sm">
                           <thead>
                             <tr>
                               <th width="10%" style={{textAlign: "center"}}>Month</th>
                               <th width="10%" style={{textAlign: "center"}}>Amount</th>
                             </tr>
                           </thead>
                           <tbody>
                             {monthlyMaxGainRows}
                           </tbody>
                         </Table>
                       </div>
                     </Card>
                  </Col>
                  <Col m={6} s={6} l={6}>
                    <Card className="teal lighten-4" textClassName="black-text" title="Saving">
                       <div>
                         <Table striped bordered hover size="sm">
                           <thead>
                             <tr>
                               <th width="10%" style={{textAlign: "center"}}>Month</th>
                               <th width="10%" style={{textAlign: "center"}}>Amount</th>
                             </tr>
                           </thead>
                           <tbody>
                             {monthlySavingRows}
                           </tbody>
                         </Table>
                       </div>
                     </Card>
                  </Col>
                  <Col m={6} s={6} l={6}>
                    <Card className="teal lighten-4" textClassName="black-text" title="Odion">
                       <div>
                         <Table striped bordered hover size="sm">
                           <thead>
                             <tr>
                               <th width="10%" style={{textAlign: "center"}}>Month</th>
                               <th width="10%" style={{textAlign: "center"}}>Amount</th>
                             </tr>
                           </thead>
                           <tbody>
                             {monthlyOdionRows}
                           </tbody>
                         </Table>
                       </div>
                     </Card>
                  </Col>
                  <Col m={6} s={6} l={6}>
                    <Card className="teal lighten-4" textClassName="black-text" title="Miscellaneous">
                       <div>
                         <Table striped bordered hover size="sm">
                           <thead>
                             <tr>
                               <th width="10%" style={{textAlign: "center"}}>Month</th>
                               <th width="10%" style={{textAlign: "center"}}>Amount</th>
                             </tr>
                           </thead>
                           <tbody>
                             {monthlyMiscRows}
                           </tbody>
                         </Table>
                       </div>
                     </Card>
                  </Col>
                </Row>
            </div>
    );
  }
}
export default OdionSummary;
