import React, { Component } from 'react'
import { Table, Row, Col, Modal, ModalHeader } from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { NumberFormatNoCurrency } from "./utils/NumberFormatNoCurrency";
import DrawPiChart from "./charts/drawPiChart";

class EstateSummary extends Component {

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
      monthlyLicHfl: [],
      monthlyHdfcHfl: [],
      monthlySavings: [],
      monthlyOdions: [],
      monthlyAdarsh: [],
      monthlyJyothi: [],
      monthlyMiscs: [],
      monthlyMiscsAdarsh: [],
      monthlyMiscsJyothi: [],
      expenses: [],
      fundings: [],
      loans: [],
      loanTotal: 0,
      fundingsProperty: [],
      expensesAdarsh: [],
      expensesJyothi: [],
      total: 0,
      totalAdarsh: 0,
      totalJyothi: 0,
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
    const loans = [];
    var loanTotal = 0;
    const fundingsProperty = [];
    const expensesAdarsh = [];
    const expensesJyothi = [];
    var total = 0;
    var totalAdarsh = 0;
    var totalJyothi = 0;
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
             loans.push({
               'head': 'SBI Max Gain',
               'amount': Math.abs(record.balance)
            });
            loanTotal += Math.abs(record.balance);
          }
          if (record.account === 'BOB_ADVANTAGE') {
             fundings.push({
               'head': 'BoB Advantage',
               'amount': Math.abs(record.balance)
            });
             loans.push({
               'head': 'BoB Advantage',
               'amount': Math.abs(record.balance)
            });
            loanTotal += Math.abs(record.balance);
          }
          if (record.account === 'LIC_HFL') {
             fundings.push({
               'head': 'LIC HFL',
               'amount': Math.abs(record.balance)
            });
             loans.push({
               'head': 'LIC HFL',
               'amount': Math.abs(record.balance)
            });
            loanTotal += Math.abs(record.balance);
          }
          if (record.account === 'HDFC_HFL') {
             fundings.push({
               'head': 'HDFC HFL',
               'amount': Math.abs(record.balance)
            });
             loans.push({
               'head': 'HDFC HFL',
               'amount': Math.abs(record.balance)
            });
            loanTotal += Math.abs(record.balance);
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
          if (record.account === 'INTEREST_JYOTHI') {
             expensesJyothi.push({
               'head': 'Interest Jyothi',
               'amount': Math.abs(record.balance)
            });
            totalJyothi += Math.abs(record.balance);
          }
          if (record.account === 'MISC_JYOTHI') {
             expensesJyothi.push({
               'head': 'Misc Jyothi',
               'amount': Math.abs(record.balance)
            });
            totalJyothi += Math.abs(record.balance);
          }
          if (record.account === 'JYOTHI') {
             expensesJyothi.push({
               'head': 'Jyothi',
               'amount': Math.abs(record.balance)
            });
            totalJyothi += Math.abs(record.balance);
          }
       }
     );

     this.setState({
         fundings: fundings
     });
     this.setState({
         loans: loans
     });
     this.setState({
         loanTotal: loanTotal
     });
     this.setState({
         expenses: expenses
     });
      this.setState({
          expensesAdarsh: expensesAdarsh
      });
      this.setState({
          expensesJyothi: expensesJyothi
      });
     this.setState({
         total: total
     });
      this.setState({
          totalAdarsh: totalAdarsh
      });
      this.setState({
          totalJyothi: totalJyothi
      });

      fundingsProperty.push({
         'head': 'Odion',
         'amount': total
      });
      fundingsProperty.push({
         'head': 'Adarsh',
         'amount': totalAdarsh
      });
      fundingsProperty.push({
         'head': 'Jyothi',
         'amount': totalJyothi
      })
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

    const interestsJyothi = bodyMonthly.accountMonthTransaction.INTEREST_JYOTHI;
    const monthlyInterestsJyothi = [];
    Object.keys(interestsJyothi).forEach(
        yearMonth => {
           monthlyInterestsJyothi.push({
             'month': yearMonth,
             'amount': interestsJyothi[yearMonth]
           });
        }
    );
    this.setState({ monthlyInterestsJyothi: monthlyInterestsJyothi });

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

      const miscsJyothi = bodyMonthly.accountMonthTransaction.MISC_JYOTHI;
      const monthlyMiscsJyothi = [];
      Object.keys(miscsJyothi).forEach(
          yearMonth => {
             monthlyMiscsJyothi.push({
               'month': yearMonth,
               'amount': miscsJyothi[yearMonth]
             });
          }
      );
      this.setState({ monthlyMiscsJyothi: monthlyMiscsJyothi });

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

       const licHflAttribute = bodyMonthly.accountMonthTransaction.LIC_HFL;
       const monthlyLicHfl = [];
        Object.keys(licHflAttribute).forEach(
             yearMonth => {
                monthlyLicHfl.push({
                  'month': yearMonth,
                  'amount': licHflAttribute[yearMonth]
                });
             }
        );
        this.setState({ monthlyLicHfl: monthlyLicHfl });

       const hdfcHflAttribute = bodyMonthly.accountMonthTransaction.HDFC_HFL;
       const monthlyHdfcHfl = [];
        Object.keys(hdfcHflAttribute).forEach(
             yearMonth => {
                monthlyHdfcHfl.push({
                  'month': yearMonth,
                  'amount': hdfcHflAttribute[yearMonth]
                });
             }
        );
        this.setState({ monthlyHdfcHfl: monthlyHdfcHfl });

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
      this.setState({ monthlyJyothi: monthlyJyothi })

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
      monthlyMaxGains,
      monthlyBob,
      monthlySavings,
      fundings,
      loans,
      loanTotal,
      fundingsProperty,
      total,
      totalAdarsh,
      totalJyothi,
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
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.ADARSH[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.MISC_ADARSH[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.INTEREST_ADARSH[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.ODION[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.MISC[month])}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(accountMonthTransaction.INTEREST[month])}</td>
                </tr>
    });
    console.log (monthTransactionsRows);


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

    return (
            <div id="cards" align="center" >
              <Row>
               <Col m={6} s={6} l={6}>
                <Card className="teal lighten-4" textClassName="black-text" title="Account Statement">
                    <div>
                    <Table className="mt-4" hover>
                        <thead>
                          <tr>
                            <th width="10%" style={{textAlign: "center", fontSize: '1rem'}}>Head</th>
                            <th width="10%" style={{textAlign: "center", fontSize: '1rem'}}>Account</th>
                            <th width="10%" style={{textAlign: "right", fontSize: '1rem'}}>Debit</th>
                            <th width="10%" style={{textAlign: "right", fontSize: '1rem'}}>Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                        {accountsBalanceRows}
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
                      <Card className="teal lighten-4" textClassName="black-text" title="Funding by Source">
                        <div>
                          <DrawPiChart data={fundings} total={total + totalAdarsh + totalJyothi} divContainer="funding-source-pie-container" heads={['Saving', 'SBI Max Gain', 'BoB Advantage']} />
                        </div>
                      </Card>
                   </Col>
                    <Col m={6} s={6} l={6}>
                       <Card className="teal lighten-4" textClassName="black-text" title="Funded in Property">
                         <div>
                           <DrawPiChart data={fundingsProperty} total={total + totalAdarsh + totalJyothi} divContainer="funding-property-pie-container" heads={['Odion', 'Adarsh', 'Jyothi']} />
                         </div>
                       </Card>
                    </Col>
                   <Col m={6} s={6} l={6}>
                      <Card className="teal lighten-4" textClassName="black-text" title="Loans">
                        <div>
                          <DrawPiChart data={loans} total={loanTotal} divContainer="loans-pie-container" heads={['SBI Max Gain', 'BoB Advantage', 'LIC HFL', 'HDFC HFL']} />
                        </div>
                      </Card>
                   </Col>
                </Row>
               <Row>
                  <Col m={6} s={6} l={6}>
                      <Card className="teal lighten-4" textClassName="black-text" title="Monthly Transactions">
                         <div>
                           <Table striped bordered hover size="sm">
                             <thead>
                               <tr>
                                 <th rowspan="2" width="10%" style={{textAlign: "center"}}>Month</th>
                                 <th colspan="3" width="10%" style={{textAlign: "center", backgroundColor: "lightgrey"}}>Funding</th>
                                 <th colspan="3" width="10%" style={{textAlign: "center", backgroundColor: "lightblue"}}>Adarsh</th>
                                 <th colspan="3" width="10%" style={{textAlign: "center", backgroundColor: "lightpink"}}>Odion</th>
                               </tr>
                               <tr>
                                 <th width="10%" style={{textAlign: "center", backgroundColor: "lightgrey"}}>Saving</th>
                                 <th width="10%" style={{textAlign: "center", backgroundColor: "lightgrey"}}>SBI MG</th>
                                 <th width="10%" style={{textAlign: "center", backgroundColor: "lightgrey"}}>BoB</th>
                                 <th width="10%" style={{textAlign: "center", backgroundColor: "lightblue"}}>Adarsh</th>
                                 <th width="10%" style={{textAlign: "center", backgroundColor: "lightblue"}}>Misc</th>
                                 <th width="10%" style={{textAlign: "center", backgroundColor: "lightblue"}}>Interest</th>
                                 <th width="10%" style={{textAlign: "center", backgroundColor: "lightpink"}}>Odion</th>
                                 <th width="10%" style={{textAlign: "center", backgroundColor: "lightpink"}}>Misc</th>
                                 <th width="10%" style={{textAlign: "center", backgroundColor: "lightpink"}}>Interest</th>
                               </tr>
                             </thead>
                             <tbody>
                               {monthTransactionsRows}
                             </tbody>
                           </Table>
                         </div>
                      </Card>
                  </Col>
                </Row>
                <Row>
                   <Col m={6} s={6} l={6}>
                    <Card className="teal lighten-4" textClassName="black-text" title="Max Gain Monthly Transactions">
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
                  <Card className="teal lighten-4" textClassName="black-text" title="BoB Monthly Transactions">
                     <div>
                       <Table striped bordered hover size="sm">
                         <thead>
                           <tr>
                             <th width="10%" style={{textAlign: "center"}}>Month</th>
                             <th width="10%" style={{textAlign: "center"}}>Amount</th>
                           </tr>
                         </thead>
                         <tbody>
                           {monthlyBobRows}
                         </tbody>
                       </Table>
                     </div>
                   </Card>
                </Col>
                  <Col m={6} s={6} l={6}>
                    <Card className="teal lighten-4" textClassName="black-text" title="Saving Monthly Transactions">
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
                </Row>

            </div>
    );
  }
}
export default EstateSummary;
