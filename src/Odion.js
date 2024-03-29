import React, { Component } from 'react'
import { Table, Row, Col, Modal, ModalHeader } from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { NumberFormatNoCurrency } from "./utils/NumberFormatNoCurrency";
import DrawPiChart from "./charts/drawPiChart";

class Odion extends Component {

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
      monthlyInterestsAdarsh: [],
      monthlyMaxGains: [],
      monthlyBob: [],
      monthlySavings: [],
      monthlyOdions: [],
      monthlyAdarsh: [],
      monthlyMiscs: [],
      monthlyMiscsAdarsh: [],
      expenses: [],
      fundings: [],
      fundingsProperty: [],
      expensesAdarsh: [],
      total: 0,
      totalAdarsh: 0,
      months: [],
      accountMonthTransaction: ""
    };
  }

  showModal = (event) => {
    console.log("event: ", event.target.getAttribute("id"))

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };

    fetch("/home/api/odion/transactions/" + event.target.getAttribute("id"), requestOptions)
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
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };
    const response = await fetch('/home/api/odion/accounts', requestOptions);
    const body = await response.json();

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
    const expensesAdarsh = [];
    var total = 0;
    var totalAdarsh = 0;
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
          if (record.account === 'BOB_ADVANTAGE') {
             fundings.push({
               'head': 'BoB Advantage',
               'amount': Math.abs(record.balance)
            });
          }
          if (record.account === 'INTEREST_ADARSH') {
             expensesAdarsh.push({
               'head': 'Interest Adarsh',
               'amount': Math.abs(record.balance)
            });
            totalAdarsh += Math.abs(record.balance);
          }
          if (record.account === 'MISC_ADARSH') {
             expensesAdarsh.push({
               'head': 'Misc Adarsh',
               'amount': Math.abs(record.balance)
            });
            totalAdarsh += Math.abs(record.balance);
          }
          if (record.account === 'ADARSH') {
             expensesAdarsh.push({
               'head': 'Adarsh',
               'amount': Math.abs(record.balance)
            });
            totalAdarsh += Math.abs(record.balance);
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
          expensesAdarsh: expensesAdarsh
      });
     this.setState({
         total: total
     });
      this.setState({
          totalAdarsh: totalAdarsh
      });

      fundingsProperty.push({
         'head': 'Odion',
         'amount': total
      });
      fundingsProperty.push({
         'head': 'Adarsh',
         'amount': totalAdarsh
      });
      this.setState({
          fundingsProperty: fundingsProperty
      });

     const monthlyResponse = await fetch('/home/api/odion/monthly/transaction', requestOptions);
     const bodyMonthly = await monthlyResponse.json();
     this.setState({ accountMonthTransaction: bodyMonthly.accountMonthTransaction });


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

    const interestsAdarsh = bodyMonthly.accountMonthTransaction.INTEREST_ADARSH;
    const monthlyInterestsAdarsh = [];
    Object.keys(interestsAdarsh).forEach(
        yearMonth => {
           monthlyInterestsAdarsh.push({
             'month': yearMonth,
             'amount': interestsAdarsh[yearMonth]
           });
        }
    );
    this.setState({ monthlyInterestsAdarsh: monthlyInterestsAdarsh });

      const miscsAdarsh = bodyMonthly.accountMonthTransaction.MISC_ADARSH;
      const monthlyMiscsAdarsh = [];
      Object.keys(miscsAdarsh).forEach(
          yearMonth => {
             monthlyMiscsAdarsh.push({
               'month': yearMonth,
               'amount': miscsAdarsh[yearMonth]
             });
          }
      );
      this.setState({ monthlyMiscsAdarsh: monthlyMiscsAdarsh });

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

      const adarsh = bodyMonthly.accountMonthTransaction.ADARSH;
      const monthlyAdarsh = [];
      Object.keys(adarsh).forEach(
           yearMonth => {
              monthlyAdarsh.push({
                'month': yearMonth,
                'amount': adarsh[yearMonth]
              });
           }
      );
      this.setState({ monthlyAdarsh: monthlyAdarsh })

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
      headAccountBalances,
      balanceByHeadCredit,
      balanceByHeadDebit,
      transactionModalShow,
      accountTransactionsRows,
      monthlyInterests,
      monthlyInterestsAdarsh,
      monthlyMiscsAdarsh,
      monthlyMaxGains,
      monthlyBob,
      monthlySavings,
      monthlyOdions,
      monthlyAdarsh,
      monthlyMiscs,
      expenses,
      fundings,
      fundingsProperty,
      total,
      expensesAdarsh,
      totalAdarsh,
      months,
      accountMonthTransaction
    } = this.state;

//    const accountsBalanceRows = accountsBalance.map(record => {
//        if (record.balance < 0)
//        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} onClick={this.showModal}>
//                  <td id={record.account} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{record.account}</td>
//                  <td id={record.account} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(Math.abs(record.balance))}</td>
//                  <td id={record.account} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(0)}</td>
//                </tr>
//        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} onClick={this.showModal}>
//                  <td id={record.account} style={{textAlign: "center", fontSize: '.8rem', whiteSpace: 'wrap'}}>{record.account}</td>
//                  <td id={record.account} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(0)}</td>
//                  <td id={record.account} style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(record.balance)}</td>
//                </tr>
//    });

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
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.ADARSH[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.MISC_ADARSH[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.INTEREST_ADARSH[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.ODION[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.MISC[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.INTEREST[month])}</td>
                </tr>
    });
    console.log (monthTransactionsRows);


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
    const monthlyBobRows = monthlyBob.map(record => {
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
    const monthlyInterestAdarshRows = monthlyInterestsAdarsh.map(record => {
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} >
                  <td style={{whiteSpace: 'nowrap', textAlign: "Center", fontSize: '.8rem'}}>{format(parseISO(record.month), 'MMM yyyy')}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(record.amount)}</td>
                </tr>
    });
    const monthlyAdarshRows = monthlyAdarsh.map(record => {
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} >
                  <td style={{whiteSpace: 'nowrap', textAlign: "Center", fontSize: '.8rem'}}>{format(parseISO(record.month), 'MMM yyyy')}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(record.amount)}</td>
                </tr>
    });
    const monthlyMiscsAdarshRows = monthlyMiscsAdarsh.map(record => {
        return <tr style={{textAlign: "center", fontSize: '1rem', whiteSpace: 'wrap'}} >
                  <td style={{whiteSpace: 'nowrap', textAlign: "Center", fontSize: '.8rem'}}>{format(parseISO(record.month), 'MMM yyyy')}</td>
                  <td style={{textAlign: "right", fontSize: '.8rem', whiteSpace: 'wrap'}}>{NumberFormatNoDecimal(record.amount)}</td>
                </tr>
    });

    return (
            <div id="cards" align="center" >
                <Row>
                  <Col m={6} s={6} l={6}>
                     <Card className="teal lighten-4" textClassName="black-text" title="Odion Expense by Head">
                       <div>
                         <DrawPiChart data={expenses} total={total} divContainer="Odion-expenses-pie-container" heads={['Odion', 'Interest', 'Miscellaneous']} />
                       </div>
                     </Card>
                  </Col>

                  <Col m={6} s={6} l={6}>
                    <Card className="teal lighten-4" textClassName="black-text" title="Interest Odion">
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
                    <Card className="teal lighten-4" textClassName="black-text" title="Miscs Odion">
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
export default Odion;
