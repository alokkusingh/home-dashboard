import React, { Component, useState, useEffect } from 'react';
import './css/App.css';
import { Table, Row, Col, Modal, ModalHeader} from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {Icon, Card} from 'react-materialize';
import { NumberFormat } from "./utils/NumberFormat";
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { NumberFormatNoCurrency } from "./utils/NumberFormatNoCurrency";
import { formatYearMonth } from "./utils/FormatYearMonth";
import ExpenseMonthBarChart from './charts/expenseMonthBarChart';
import ExpenseMonthByCategoryPiChart from './charts/expenseMonthByCategoryPiChart';
import ExpenseVsIncomeLineChart from './charts/expenseVsIncomeLineChart';
import { Dimmer, Loader } from 'semantic-ui-react'
import {fetchCurrentMonthExpenseByDayJson, fetchExpenseByCategoryMonthJson, fetchExpenseHeadsJson, fetchExpenseByCategoryForYearJson} from './api/ExpensesAPIManager.js'
import {fetchMonthlyIncomeExpenseSummaryJson} from './api/SummaryAPIManager.js'
import {fetchInvestmentReturnsProto, fetchInvestmentSummaryProto, fetchInvestmentsForHeadProto} from './api/InvestmentAPIManager.js'
import {fetchAccountBalancesJson, fetchTransactionsJson} from './api/EstateAPIManager.js'
import {TileCard} from './cards/tileCard'
import {getCurrentMonth, getPreviousMonth, getCurrentMonthFull, getPreviousMonthFull, getCurrentYear, getPreviousYear} from './utils/dateUtils'
import "./css/modal.css"

class HomeCards extends Component {

  constructor() {
    super();
    this.state = {
      expCategories: [],
      monthExpenses: [],
      expensesByCategory: [],
      expensesByMonth: [],
      monthExpensesByDay: [],
      monthExpensesByCategory: [],
      monthlySummary: [],
      totalMonthExpense: 0,
      totalLastMonthExpense: 0,
      totalYearExpense: 0,
      totalLastYearExpense: 0,
      investmentTotalValue: 0,
      investmentLastMonthReturn: 0,
      investmentThisYearReturn: 0,
      investmentCumulativeReturn: 0,
      estateInvestmentAmount: 0,
      estateOdionInvestment: 0,
      estateAdarshInvestment: 0,
      estateJGETInvestment: 0,
      loanAmount: 0,
      loanInterestLastMonth: 0,
      loanInterestThisYear: 0,
      loanInterestLastYear: 0,
      count: 0,
      expenseModalShow: false,
      expenseCatModalShow: false,
      dayExpensesRows: "",
      catExpensesRows: "",
      dimmerActive: {},
      isYearSummaryModalOpen: false,
      yearlySummary: {}
    };
  }

  async componentDidMount() {
    await Promise.all([
        fetchExpenseHeadsJson().then(this.handleExpenseHeads),
        fetchCurrentMonthExpenseByDayJson().then(this.handleCurrentMonthExpenseByDay),
        fetchExpenseByCategoryMonthJson().then(this.handleExpenseByCategoryMonth),
        fetchMonthlyIncomeExpenseSummaryJson().then(this.handleMonthlyIncomeExpenseSummary),
        fetchInvestmentReturnsProto().then(this.handleInvestmentReturns),
        fetchAccountBalancesJson().then(this.handleEstateAccountBalances),
        fetchTransactionsJson().then(this.handleTransactionsJson)
    ]);
    // All fetch calls are done now
    console.log(this.state);
  }

  handleExpenseHeads = (body) => {
         this.setState({
             expCategories: body
         });

         this.setState({ dimmerActive: false })
  }

  handleCurrentMonthExpenseByDay = (body) => {
      if (body === undefined || body.expenses === undefined) {
        return;
      }
      this.setState({
          monthExpensesByDay: body.expenses,
          monthExpensesByCategory: body.categoryExpenses
      });

      var sum = 0;
      body.expenses.forEach(function(d) {
          sum += d.amount;
      });
      this.setState({
          totalMonthExpense: sum
      });
  }

  handleExpenseByCategoryMonth = (body) => {
      if (body === undefined || body.expenseCategorySums === undefined) {
        return
      }
      this.setState({
          expensesByCategory: body.expenseCategorySums
      });

  }

  handleMonthlyIncomeExpenseSummary = (body) => {
       if (body === undefined || body.records === undefined) {
        return
       }
       this.setState({
           monthlySummary: body.records
       });

       let totalLastMonthExpense = 0;
       let totalYearExpense = 0;
       let totalLastYearExpense = 0;
       const today = new Date();
       body.records.forEach(function(d) {
          // Date() month index starts with 0 (Jan) but d.month Jan is 1
          if (today.getMonth() === 0) {
            if (d.year === today.getFullYear() - 1 && d.month === 12) {
              totalLastMonthExpense += d.expenseAmount;
            }
          } else if (d.year === today.getFullYear() && d.month === today.getMonth()) {
              totalLastMonthExpense += d.expenseAmount;
          }

          if (d.year === today.getFullYear()) {
              totalYearExpense += d.expenseAmount;
          }

          if (d.year === today.getFullYear() - 1) {
              totalLastYearExpense += d.expenseAmount;
           }
       });

       this.setState({
          totalLastMonthExpense: totalLastMonthExpense,
          totalYearExpense: totalYearExpense,
          totalLastYearExpense: totalLastYearExpense
      });
  }

  handleInvestmentReturns = (investmentReturnList) => {
    let investmentTotalValue = 0;
    let investmentLastMonthReturn = 0;
    let investmentThisYearReturn = 0;
    let investmentCumulativeReturn = 0;

   investmentReturnList.forEach(function(d) {
      if (d.metric === ("RoR - " + getPreviousMonth().toUpperCase())) {
        investmentLastMonthReturn = (d.total.end - d.total.beg - d.total.inv )
      }
      if (d.metric === "Cumulative Return (%)") {
        investmentTotalValue = d.total.end;
        investmentCumulativeReturn = (d.total.end - d.total.inv);
      }
      if (d.metric === ("RoR - " + getCurrentYear())) {
        investmentThisYearReturn = (d.total.end - d.total.beg - d.total.inv)
      }
   });

    this.setState({
       investmentTotalValue: investmentTotalValue,
       investmentLastMonthReturn: investmentLastMonthReturn,
       investmentThisYearReturn: investmentThisYearReturn,
       investmentCumulativeReturn: investmentCumulativeReturn
    });
  }

  handleEstateAccountBalances = (body) => {

    if (body === undefined || body.headAccountBalances === undefined) {
      return;
    }
    let estateOdionInvestment = 0;
    let estateAdarshInvestment = 0;
    let estateJGETInvestment = 0;
    let loanAmount = 0;
    for (const [head, accountsBalance] of Object.entries(body.headAccountBalances)) {
      if (head === "ODION") {
        accountsBalance.forEach(function(d) {
          estateOdionInvestment += d.balance;
        });
      }
      if (head === "ADARSH") {
        accountsBalance.forEach(function(d) {
          estateAdarshInvestment += d.balance;
        });
      }
      if (head === "JYOTHI") {
        accountsBalance.forEach(function(d) {
          estateJGETInvestment += d.balance;
        });
      }

      if (head === "SAVINGS_BANKS") {
        accountsBalance.forEach(function(d) {
          if (d.account === "SBI_MAX_GAIN" || d.account === "BOB_ADVANTAGE") {
            loanAmount += d.balance;
          }
        });
      }
    }

    this.setState({
     estateInvestmentAmount: (estateOdionInvestment + estateAdarshInvestment + estateJGETInvestment) * -1,
     estateOdionInvestment: estateOdionInvestment * -1,
     estateAdarshInvestment: estateAdarshInvestment * -1,
     estateJGETInvestment: estateJGETInvestment * -1,
     loanAmount: loanAmount
    });
  }

  handleTransactionsJson = (body) => {

    if (body === undefined || body.accountMonthTransaction === undefined) {
      return;
    }

    let loanInterestLastMonth = 0;
    let loanInterestThisYear = 0;
    let loanInterestLastYear = 0;
    const today = new Date();
    for (const [month, amount] of Object.entries(body.accountMonthTransaction.INTEREST)) {
      // Date() month index starts with 0 (Jan) but d.month Jan is 1
      var lastYearMonth = null;
      if (today.getMonth() === 0) {
        lastYearMonth = formatYearMonth(today.getFullYear() - 1, 12, "yyyy-MM");
      } else {
        lastYearMonth = formatYearMonth(today.getFullYear(), today.getMonth(), "yyyy-MM")
      }

      if (month === lastYearMonth) {
        loanInterestLastMonth += amount;
      }
      if (month.split("-")[0] == today.getFullYear()) {
        loanInterestThisYear += amount;
      }
      if (month.split("-")[0] == today.getFullYear()-1) {
        loanInterestLastYear += amount;
      }
    }
    for (const [month, amount] of Object.entries(body.accountMonthTransaction.INTEREST_ADARSH)) {
      if (month === lastYearMonth) {
        loanInterestLastMonth += amount;
      }
      if (month.split("-")[0] == today.getFullYear()) {
        loanInterestThisYear += amount;
      }
      if (month.split("-")[0] == today.getFullYear()-1) {
        loanInterestLastYear += amount;
      }
    }

    this.setState({
      loanInterestLastMonth: loanInterestLastMonth,
      loanInterestThisYear: loanInterestThisYear,
      loanInterestLastYear: loanInterestLastYear
    });
  }

  showExpenseModal = (event) => {
      console.log("event: ", event.target.getAttribute("id"))
      let expenseDayDetails = [];
      this.state.monthExpensesByDay.forEach(
        record => {
            if (record.date == event.target.getAttribute("id")) {
                expenseDayDetails = record.expenses;
            }
        }
      );
      const dayExpensesRows = expenseDayDetails.map(expense => {
        return <tr>
                  <td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>{expense.date}</td>
                  <td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>{expense.head}</td>
                  <td style={{whiteSpace: 'wrap', textAlign: "left", fontSize: '.8rem'}}>{expense.comment}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{expense.amount}</td>
               </tr>
        });

      this.setState({dayExpensesRows: dayExpensesRows});

      this.setState({ expenseModalShow: !this.state.expenseModalShow });
  }

  closeExpenseModal = () => {
      this.setState({ expenseModalShow: !this.state.expenseModalShow });
  };

  showCategoryExpenseModal = (event) => {
      console.log("event: ", event.target.getAttribute("id"))
      let expenses = [];
      this.state.monthExpensesByCategory.forEach(
        record => {
            if (record.category == event.target.getAttribute("id")) {
                expenses = record.expenses;
            }
        }
      );
      const catExpensesRows = expenses.map(expense => {
        return <tr>
                  <td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>{expense.date}</td>
                  <td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>{expense.head}</td>
                  <td style={{whiteSpace: 'wrap', textAlign: "left", fontSize: '.8rem'}}>{expense.comment}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{expense.amount}</td>
               </tr>
        });

      this.setState({catExpensesRows: catExpensesRows});

      this.setState({ expenseCatModalShow: !this.state.expenseCatModalShow });
  }

  closeCategoryExpenseModal = () => {
      this.setState({ expenseCatModalShow: !this.state.expenseCatModalShow });
  };

  showYearSummaryModal = async(event) => {
      console.log("event: ", event.target.getAttribute("id"))
      var year = event.target.getAttribute("id");
      //var yearSummaryRecord = this.yearlySummary.get(year);

      const yearSummaryModalRows = [];

//      yearSummaryModalRows.push(<tr>);
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>{year}</td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>"Income"</td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "left", fontSize: '.8rem'}}></td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormat(yearSummaryRecord.income)}</td>)
//      yearSummaryModalRows.push(</tr>);
//
//      yearSummaryModalRows.push(<tr>);
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>{year}</td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>"Transfer"</td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "left", fontSize: '.8rem'}}></td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormat(yearSummaryRecord.transferAmount)}</td>)
//      yearSummaryModalRows.push(</tr>);
//
//      yearSummaryModalRows.push(<tr>);
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>{year}</td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>"Savings"</td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "left", fontSize: '.8rem'}}></td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormat(yearSummaryRecord.savings)}</td>)
//      yearSummaryModalRows.push(</tr>);
//
//      yearSummaryModalRows.push(<tr>);
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>{year}</td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>"Investment"</td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "left", fontSize: '.8rem'}}></td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormat(yearSummaryRecord.investmentAmount)}</td>)
//      yearSummaryModalRows.push(</tr>);
//
//      yearSummaryModalRows.push(<tr>);
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>{year}</td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>"Expense"</td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'wrap', textAlign: "left", fontSize: '.8rem'}}></td>)
//      yearSummaryModalRows.push(<td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormat(yearSummaryRecord.expenseAmount)}</td>)
//      yearSummaryModalRows.push(</tr>);

      const response = await fetchExpenseByCategoryForYearJson(year);
      if (response != undefined && response.expenseCategorySums != undefined) {
         response.expenseCategorySums.forEach(function(record) {
                     yearSummaryModalRows.push(<tr>
                       <td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>{year}</td>
                       <td style={{whiteSpace: 'wrap', textAlign: "Left", fontSize: '.8rem'}}>Expense</td>
                       <td style={{whiteSpace: 'wrap', textAlign: "left", fontSize: '.8rem'}}>{record.category}</td>
                       <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormat(record.sum)}</td>
                       </tr>);
             }
         );
      }

      this.setState({ yearSummaryModalRows: yearSummaryModalRows });
      this.setState({ isYearSummaryModalOpen: !this.state.isYearSummaryModalOpen });
  }

  closeYearSummaryModal = () => {
      this.setState({ isYearSummaryModalOpen: !this.state.isYearSummaryModalOpen });
  };

  render() {
      const {
        monthExpenses,
        expensesByCategory,
        monthExpensesByDay,
        monthExpensesByCategory,
        monthlySummary,
        totalMonthExpense,
        totalLastMonthExpense,
        totalYearExpense,
        totalLastYearExpense,
        investmentTotalValue,
        investmentLastMonthReturn,
        investmentThisYearReturn,
        investmentCumulativeReturn,
        estateInvestmentAmount,
        estateJGETInvestment,
        estateAdarshInvestment,
        estateOdionInvestment,
        loanAmount,
        loanInterestLastMonth,
        loanInterestThisYear,
        loanInterestLastYear,
        expenseModalShow,
        expenseCatModalShow,
        dayExpensesRows,
        catExpensesRows,
        expCategories,
        dimmerActive,
        isYearSummaryModalOpen,
        yearSummaryModalRows
      } =  this.state;

      const monthExpenseList = monthExpenses.map(expense => {
          return <tr key={expense.id} onClick={this.showModal}>
                  <td id={expense.id} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.75rem'}}>{format(parseISO(expense.date), 'dd MMM yyyy')}</td>
                  <td id={expense.id} style={{whiteSpace: 'wrap', textAlign: "center", fontSize: '.75rem'}}>{expense.head}</td>
                  <td id={expense.id} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormat(expense.amount)}</td>
              </tr>
      });

      const monthExpensesByDayList = monthExpensesByDay.map(expense => {
          return <tr key={expense.date} onClick={this.showExpenseModal}>
                  <td id={expense.date} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.75rem'}}>{format(parseISO(expense.date), 'dd MMM yyyy')}</td>
                  <td id={expense.date} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormat(expense.amount)}</td>
              </tr>
      });

     // Lets show only current month
     const currentDate = new Date();
     const currentYear = currentDate.getFullYear();
     const currentMonth = currentDate.getMonth()+1
     const expensesByCategoryList = expensesByCategory.map(expense => {
          if (expense.year === currentYear && expense.month === currentMonth)
          return <tr key={expense.category} onClick={this.showCategoryExpenseModal}>
                  <td id={expense.category} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.75rem'}}>{formatYearMonth(expense.year, expense.month)}</td>
                  <td id={expense.category} style={{textAlign: "center", fontSize: '.75rem'}}>{expense.category}</td>
                  <td id={expense.category} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormat(expense.sum)}</td>
              </tr>
      });

       const yearlySummary = new Map();
     const total = {income: 0, expenseAmount: 0, transferAmount: 0, investmentAmount: 0, savings: 0};
     const monthlySummaryList = monthlySummary.map(record => {
          var income = record.incomeAmount + record.investmentByCompany;
          var savings = income - record.investmentAmount - record.expenseAmount - record.transferAmount;

          if (!yearlySummary.has(record.year)) {
            yearlySummary.set(record.year, {income: 0, expenseAmount: 0, transferAmount: 0, investmentAmount: 0, savings: 0});
          }
          var summary = yearlySummary.get(record.year);
          summary.income += income;
          summary.expenseAmount += record.expenseAmount;
          summary.transferAmount += record.transferAmount;
          summary.investmentAmount += record.investmentAmount;
          summary.savings += savings;
          yearlySummary.set(record.year, summary);

          total.income += income;
          total.expenseAmount += record.expenseAmount;
          total.transferAmount += record.transferAmount;
          total.investmentAmount += record.investmentAmount;
          total.savings += savings;

          return <tr key={'' + record.year + record.month} onClick={this.showModal}>
                   <td id={'' + record.year + record.month + 0} width="15%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.75rem'}}>{formatYearMonth(record.year, record.month)}</td>
                   <td id={'' + record.year + record.month + 1} width="20%" style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoCurrency(Math.round(income))}</td>
                   <td id={'' + record.year + record.month + 2} width="15%" style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoCurrency(Math.round(record.expenseAmount))}</td>
                   <td id={'' + record.year + record.month + 3} width="20%" style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoCurrency(Math.round(record.transferAmount))}</td>
                   <td id={'' + record.year + record.month + 4} width="15%" style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoCurrency(Math.round(record.investmentAmount))}</td>
                   <td id={'' + record.year + record.month + 5} width="15%" style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoCurrency(Math.round(savings))}</td>
               </tr>
      });

      // Sore in state to be used for modal on click
      //this.setState({yearlySummary, yearlySummary});

      const yearlySummaryList = [];
      yearlySummary.forEach((record, year) => {
          yearlySummaryList.push(<tr key={year} onClick={this.showYearSummaryModal}>
                   <td id={year} width="15%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.75rem'}}>{year}</td>
                   <td id={year} width="20%" style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoCurrency(Math.round(record.income)/1000)}K</td>
                   <td id={year} width="15%" style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoCurrency(Math.round(record.expenseAmount)/1000)}K</td>
                   <td id={year} width="20%" style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoCurrency(Math.round(record.transferAmount)/1000)}K</td>
                   <td id={year} width="15%" style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoCurrency(Math.round(record.investmentAmount)/1000)}K</td>
                   <td id={year} width="15%" style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoCurrency(Math.round(record.savings)/1000)}K</td>
               </tr>)
      });
      yearlySummaryList.push(<tr key={"Total"}>
                    <td id={'Total' + 0} width="15%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.75rem', fontWeight: 900}}>Total</td>
                    <td id={'Total' + 1} width="20%" style={{textAlign: "right", fontSize: '.75rem', fontWeight: 900}}>{NumberFormatNoCurrency(Math.round(total.income)/1_00_000) + 'L'}</td>
                    <td id={'Total' + 2} width="15%" style={{textAlign: "right", fontSize: '.75rem', fontWeight: 900}}>{NumberFormatNoCurrency(Math.round(total.expenseAmount)/1_00_000) + 'L'}</td>
                    <td id={'Total' + 3} width="20%" style={{textAlign: "right", fontSize: '.75rem', fontWeight: 900}}>{NumberFormatNoCurrency(Math.round(total.transferAmount)/1_00_000) + 'L'}</td>
                    <td id={'Total' + 4} width="15%" style={{textAlign: "right", fontSize: '.75rem', fontWeight: 900}}>{NumberFormatNoCurrency(Math.round(total.investmentAmount)/1_00_000)+ 'L'}</td>
                    <td id={'Total' + 5} width="15%" style={{textAlign: "right", fontSize: '.75rem', fontWeight: 900}}>{NumberFormatNoCurrency(Math.round(total.savings)/1_00_000) + 'L'}</td>
                </tr>)

      return (
          <div>
              <div id="cards" align="center" >
              <Row>
                <Col l={4} m={4} s={4} >
                  <TileCard title="Expense"
                    x={{"value":NumberFormatNoCurrency(totalMonthExpense), "text":getCurrentMonthFull()}}
                    a={{"value":NumberFormatNoCurrency(totalLastMonthExpense), "text":getPreviousMonthFull()}}
                    b={{"value":NumberFormatNoCurrency(totalYearExpense), "text":getCurrentYear()}}
                    c={{"value":NumberFormatNoCurrency(totalLastYearExpense), "text":getPreviousYear()}}
                  />
                </Col>
                <Col l={4} m={4} s={4} >
                  <TileCard title="Investment"
                    x={{"value":NumberFormatNoCurrency(investmentTotalValue), "text":"Market Value"}}
                    a={{"value":NumberFormatNoCurrency(investmentLastMonthReturn), "text":getPreviousMonthFull() + ' Return'}}
                    b={{"value":NumberFormatNoCurrency(investmentThisYearReturn), "text":getCurrentYear() + ' Return'}}
                    c={{"value":NumberFormatNoCurrency(investmentCumulativeReturn), "text":"Total Return"}}
                  />
                </Col>
                <Col l={4} m={4} s={4} >
                  <TileCard title="Estate"
                    x={{"value":NumberFormatNoCurrency(estateInvestmentAmount), "text":"Invested"}}
                    a={{"value":NumberFormatNoCurrency(estateAdarshInvestment), "text":"Adarsh"}}
                    b={{"value":NumberFormatNoCurrency(estateOdionInvestment), "text":"Odion"}}
                    c={{"value":NumberFormatNoCurrency(estateJGETInvestment), "text":"JGTE"}}
                  />
                </Col>
                <Col l={4} m={4} s={4} >
                  <TileCard title="Loan"
                    x={{"value":NumberFormatNoCurrency(loanAmount), "text":"Dept"}}
                    a={{"value":NumberFormatNoDecimal(loanInterestLastMonth), "text":getPreviousMonthFull() + ' Interest'}}
                    b={{"value":NumberFormatNoDecimal(loanInterestThisYear), "text":getCurrentYear() + ' Interest'}}
                    c={{"value":NumberFormatNoDecimal(loanInterestLastYear), "text":getPreviousYear() + ' Interest'}}
                  />
                </Col>
              </Row>
              <Row>
                <Col m={2} s={2} l={2}>
                    <Card className="card-panel teal lighten-4" textClassName="black-text" >
                        <div>
                             <ExpenseMonthBarChart data={monthExpensesByDay} />
                        </div>
                    </Card>
                </Col>
                <Col m={2} s={2} l={2}>
                    <Card className="card-panel teal lighten-4" textClassName="black-text" >
                        <div>
                             <ExpenseMonthByCategoryPiChart data={monthExpensesByCategory} categories={expCategories} />
                        </div>
                    </Card>
                </Col>
                <Col m={2} s={2} l={2}>
                    <Card className="card-panel teal lighten-4" textClassName="black-text" >
                        <div>
                             <ExpenseVsIncomeLineChart data={monthlySummary} />
                        </div>
                    </Card>
                </Col>
              </Row>
              <Row >
                <Col m={4} s={4} l={3}>
                    <Card className="card-panel teal lighten-4" closeIcon={<Icon>close</Icon>} revealIcon={<Icon>more_vert</Icon>} textClassName="black-text" title="Expenses by Category" >
                       <Table striped bordered hover size="sm">
                            <thead>
                              <tr>
                                <th width="25%" style={{textAlign: "center"}}>Month</th>
                                <th width="50%" style={{textAlign: "center"}}>Category</th>
                                <th width="25%" style={{textAlign: "right"}}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                            {expensesByCategoryList}
                            </tbody>
                        </Table>
                        <Modal isOpen={expenseCatModalShow} onClose={this.closeCategoryExpenseModal} contentLabel="Expenses" modalClassName="custom-modal-style">
                          <ModalHeader toggle={this.closeCategoryExpenseModal}>Category Transactions</ModalHeader>
                           <Table striped bordered hover>
                               <thead >
                                 <tr>
                                   <th>Date</th>
                                   <th>Head</th>
                                   <th>Comment</th>
                                   <th>Amount</th>
                                 </tr>
                               </thead>
                               <tbody>
                                 {catExpensesRows}
                               </tbody>
                             </Table>
                          </Modal>
                    </Card>
                </Col>
                <Col m={2} s={2} l={2}>
                    <Card className="card-panel teal lighten-4" textClassName="black-text" title="Expenses by Day" >
                       <Table striped bordered hover scrollable size="sm">
                            <thead>
                              <tr>
                                <th width="25%" style={{textAlign: "center"}}>Date</th>
                                <th width="25%" style={{textAlign: "right"}}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {monthExpensesByDayList}
                            </tbody>
                        </Table>
                        <Modal isOpen={expenseModalShow} onClose={this.closeExpenseModal} contentLabel="Expenses" modalClassName="custom-modal-style">
                          <ModalHeader toggle={this.closeExpenseModal}>Day Transactions</ModalHeader>
                            <Table striped bordered hover>
                              <thead >
                                <tr>
                                  <th>Date</th>
                                  <th>Head</th>
                                  <th>Comment</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                               {dayExpensesRows}
                              </tbody>
                            </Table>
                        </Modal>
                    </Card>
                </Col>
                <Col m={4} s={4} l={3}>
                    <Card className="card-panel teal lighten-4" closeIcon={<Icon>close</Icon>} revealIcon={<Icon>more_vert</Icon>} textClassName="black-text" title="Monthly Money Flow" >
                        <Table striped bordered hover size="sm">
                              <thead>
                                <tr>
                                  <th width="15%" style={{textAlign: "center"}}>Month</th>
                                  <th width="20%" style={{textAlign: "center"}}>Inc</th>
                                  <th width="15%" style={{textAlign: "center"}}>Exp</th>
                                  <th width="20%" style={{textAlign: "center"}}>Tra</th>
                                  <th width="15%" style={{textAlign: "center"}}>Inv</th>
                                  <th width="15%" style={{textAlign: "center"}}>Svg</th>
                                </tr>
                              </thead>
                              <tbody>
                              {monthlySummaryList}
                              </tbody>
                          </Table>
                          <div align="left" style={{fontSize: '.6rem'}}>
                          Notes: <br/>
                          1. Inc = Income, which includes salray credited in bank + investment by company - tax<br/>
                          2. Exp = Expense <br/>
                          3. Tra = Transfer, transferred to family and friend <br/>
                          4. Inv = Investment, investment by company and own<br/>
                          5. Svg = Savings, 1-2-3-4<br/>
                          </div>
                    </Card>
                </Col>
                <Col m={4} s={4} l={3}>
                    <Card className="card-panel teal lighten-4" closeIcon={<Icon>close</Icon>} revealIcon={<Icon>more_vert</Icon>} textClassName="black-text" title="Yearly Money Flow" >
                        <Table striped bordered hover size="sm">
                              <thead>
                                <tr>
                                  <th width="15%" style={{textAlign: "center"}}>Year</th>
                                  <th width="20%" style={{textAlign: "center"}}>Inc</th>
                                  <th width="15%" style={{textAlign: "center"}}>Exp</th>
                                  <th width="20%" style={{textAlign: "center"}}>Tra</th>
                                  <th width="15%" style={{textAlign: "center"}}>Inv</th>
                                  <th width="15%" style={{textAlign: "center"}}>Svg</th>
                                </tr>
                              </thead>
                              <tbody>
                              {yearlySummaryList}
                              </tbody>
                          </Table>
                          <Modal isOpen={isYearSummaryModalOpen} onClose={this.closeYearSummaryModal} contentLabel="YearSummary" modalClassName="custom-modal-style">
                            <ModalHeader toggle={this.closeYearSummaryModal}>Year Summary</ModalHeader>
                              <Table striped bordered hover>
                                <thead >
                                  <tr>
                                    <th>Year</th>
                                    <th>Head</th>
                                    <th>Sub Head</th>
                                    <th>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                 {yearSummaryModalRows}
                                </tbody>
                              </Table>
                          </Modal>
                          <div align="left" style={{fontSize: '.6rem'}}>
                          Notes: <br/>
                          1. Inc = Income, which includes salray credited in bank + investment by company - tax<br/>
                          2. Exp = Expense <br/>
                          3. Tra = Transfer, transferred to family and friend <br/>
                          4. Inv = Investment, investment by company and own<br/>
                          5. Svg = Savings, 1-2-3-4<br/>
                          </div>
                    </Card>
                </Col>
              </Row>
              </div>
          </div>
      );
  }
}

export default HomeCards;