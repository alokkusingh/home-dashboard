import React, { Component } from 'react'
import { Table, Row, Col } from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { NumberFormatNoCurrency } from "./utils/NumberFormatNoCurrency";
import DrawPiChart from "./charts/drawPiChart";
import {fetchAccountBalancesJson, fetchTransactionsJson, fetchATransactionJson} from './api/EstateAPIManager.js'

class Jyothi extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accountsBalance: [],
      headAccountBalances: "",
      balanceByHeadDebit: [],
      balanceByHeadCredit: [],
      count: 0,
      lastTransactionDate: "",
      transactionModalShow: false,
      accountTransactionsRows: "",
      monthlyInterests: [],
      monthlyMaxGains: [],
      monthlyBob: [],
      monthlySavings: [],
      monthlyJyothi: [],
      monthlyMiscs: [],
      expenses: [],
      fundings: [],
      fundingsProperty: [],
      total: 0,
      months: [],
      accountMonthTransaction: ""
    };
  }

  async componentDidMount() {
    await Promise.all([
      fetchAccountBalancesJson().then(this.handleAccountBalances),
      fetchTransactionsJson().then(this.handleTransactions)
    ]);
    // All fetch calls are done now
    console.log(this.state);
  }

  handleAccountBalances = (body) => {
    const balanceByHeadCredit = [];
    const balanceByHeadDebit = [];
    for (const [head, accountsBalance] of Object.entries(body.headAccountBalances)) {
      var totalCredit = 0;
      var totalDebit = 0;
      accountsBalance.map(record => {
          if (record.balance < 0) {
            totalDebit += record.balance;
          } else {
            totalCredit += record.balance;
          }
      });
      balanceByHeadDebit[head] = Math.abs(totalDebit);
      balanceByHeadCredit[head] = Math.abs(totalCredit);
    }
    this.setState({
        accountsBalance: body.accountBalances,
        headAccountBalances: body.headAccountBalances,
        balanceByHeadCredit: balanceByHeadCredit,
        balanceByHeadDebit: balanceByHeadDebit
    });
    const expenses = [];
    const fundings = [];
    const fundingsProperty = [];
    var total = 0;
    body.accountBalances.map(record => {
          if (record.account === 'INTEREST_JYOTHI') {
             expenses.push({
               'head': 'Interest',
               'amount': Math.abs(record.balance)
            });
            total += Math.abs(record.balance);
          }
          if (record.account === 'JYOTHI') {
             expenses.push({
               'head': 'Jyothi',
               'amount': Math.abs(record.balance)
            });
            total += Math.abs(record.balance);
          }
          if (record.account === 'MISC_JYOTHI') {
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
          if (record.account === 'BOB_ADVANTAGE') {
             fundings.push({
               'head': 'BoB Advantage',
               'amount': Math.abs(record.balance)
            });
          }
          if (record.account === 'LIC_HFL') {
             fundings.push({
               'head': 'LIC HFL',
               'amount': Math.abs(record.balance)
            });
          }
          if (record.account === 'HDFC_HFL') {
             fundings.push({
               'head': 'HDFC HFL',
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

      fundingsProperty.push({
         'head': 'Jyothi',
         'amount': total
      });
      this.setState({
          fundingsProperty: fundingsProperty
      });
  }

  handleTransactions = (bodyMonthly) => {
    this.setState({ accountMonthTransaction: bodyMonthly.accountMonthTransaction });

    const jyothi = bodyMonthly.accountMonthTransaction.JYOTHI;
     const monthlyJyothi = [];
     Object.keys(jyothi).forEach(
         yearMonth => {
            monthlyJyothi.push({
              'month': yearMonth,
              'amount': jyothi[yearMonth]
            });
         }
     );
     this.setState({ monthlyJyothi: monthlyJyothi });

     const interests = bodyMonthly.accountMonthTransaction.INTEREST_JYOTHI;
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

      const miscs = bodyMonthly.accountMonthTransaction.MISC_JYOTHI;
      const monthlyMiscs = [];
      Object.keys(miscs).forEach(
          yearMonth => {
             monthlyMiscs.push({
               'month': yearMonth,
               'amount': miscs[yearMonth]
             });
          }
      );
      this.setState({ monthlyMiscs: monthlyMiscs });

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

     const bobAttribute = bodyMonthly.accountMonthTransaction.BOB_ADVANTAGE;
     const monthlyBob = [];
      Object.keys(bobAttribute).forEach(
           yearMonth => {
              monthlyBob.push({
                'month': yearMonth,
                'amount': bobAttribute[yearMonth]
              });
           }
      );
      this.setState({ monthlyBob: monthlyBob });

     const saving = bodyMonthly.accountMonthTransaction.SAVING;
     const monthlySavings = [];
     const months = [];
     Object.keys(saving).forEach(
          yearMonth => {
             monthlySavings.push({
               'month': yearMonth,
               'amount': saving[yearMonth]
             });
             months.push(yearMonth);
          }
     );
     this.setState({ monthlySavings: monthlySavings });
     this.setState({ months: months });
  }

  showModal = (event) => {
    console.log("event: ", event.target.getAttribute("id"))

//    var myHeaders = new Headers();
//
//    var requestOptions = {
//      method: 'GET',
//      headers: myHeaders
//    };

    fetchATransactionJson(event.target.getAttribute("id"))
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

  render() {
    const {
      headAccountBalances,
      balanceByHeadCredit,
      balanceByHeadDebit,
      monthlyInterests,
      monthlyMiscs,
      monthlyJyothi,
      expenses,
      total,
      months,
      accountMonthTransaction
    } = this.state;

    let accountsBalanceRows = [];
    for (const [head, accountsBalance] of Object.entries(headAccountBalances)) {
        accountsBalanceRows.push(<tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}}>
              <td id={head} style={{textAlign: "left", fontSize: '.8rem', whiteSpace: 'wrap', fontWeight: 'bold'}}>{head}</td>
              <td id={head} style={{textAlign: "left", fontSize: '.8rem', whiteSpace: 'wrap'}}></td>
              <td id={head} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap', fontWeight: 'bold'}}>{NumberFormatNoCurrency(balanceByHeadDebit[head])}</td>
              <td id={head} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap', fontWeight: 'bold'}}>{NumberFormatNoCurrency(balanceByHeadCredit[head])}</td>
            </tr>);
        accountsBalance.map(record => {
          if (record.balance < 0) {
            accountsBalanceRows.push(<tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} onClick={this.showModal}>
                  <td id={record.account} style={{textAlign: "left", fontSize: '.8rem', whiteSpace: 'wrap'}}></td>
                  <td id={record.account} style={{textAlign: "left", fontSize: '.8rem', whiteSpace: 'wrap'}}>{record.account}</td>
                  <td id={record.account} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoCurrency(Math.abs(record.balance))}</td>
                  <td id={record.account} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoCurrency(0)}</td>
                </tr>);
          } else { accountsBalanceRows.push(<tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} onClick={this.showModal}>
                  <td id={record.account} style={{textAlign: "left", fontSize: '.8rem', whiteSpace: 'wrap'}}></td>
                  <td id={record.account} style={{textAlign: "left", fontSize: '.8rem', whiteSpace: 'wrap'}}>{record.account}</td>
                  <td id={record.account} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoCurrency(0)}</td>
                  <td id={record.account} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoCurrency(record.balance)}</td>
                </tr>);
          }
      });
    }

    const monthTransactionsRows = months.map(month => {
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} >
                  <td style={{whiteSpace: 'nowrap', textAlign: "Center", fontSize: '.8rem'}}>{format(parseISO(month), 'MMM yyyy')}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.SAVING[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.SBI_MAX_GAIN[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.BOB_ADVANTAGE[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.JYOTHI[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.MISC_JYOTHI[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.INTEREST_JYOTHI[month])}</td>
                </tr>
    });
    console.log (monthTransactionsRows);


    const monthlyInterestRows = monthlyInterests.map(record => {
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} >
                  <td style={{whiteSpace: 'nowrap', textAlign: "Center", fontSize: '.8rem'}}>{format(parseISO(record.month), 'MMM yyyy')}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(record.amount)}</td>
                </tr>
    });
    const monthlyJyothiRows = monthlyJyothi.map(record => {
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
                     <Card className="teal lighten-4" textClassName="black-text" title="Expense by Head">
                       <div>
                         <DrawPiChart data={expenses} total={total} divContainer="jyothi-expenses-pie-container" heads={['Jyothi', 'Interest', 'Miscellaneous']} />
                       </div>
                     </Card>
                  </Col>

                  <Col m={6} s={6} l={6}>
                    <Card className="teal lighten-4" textClassName="black-text" title="Jyothi Builders">
                       <div>
                         <Table striped bordered hover size="sm">
                           <thead>
                             <tr>
                               <th width="10%" style={{textAlign: "center"}}>Month</th>
                               <th width="10%" style={{textAlign: "center"}}>Amount</th>
                             </tr>
                           </thead>
                           <tbody>
                             {monthlyJyothiRows}
                           </tbody>
                         </Table>
                       </div>
                     </Card>
                  </Col>
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
export default Jyothi;
