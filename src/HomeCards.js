import React, { Component, useState, useEffect } from 'react';
import './css/App.css';
import { Table, Row, Col, Modal, ModalHeader} from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {Icon, Card} from 'react-materialize';
import { NumberFormat } from "./utils/NumberFormat";
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { formatYearMonth } from "./utils/FormatYearMonth";
import ExpenseMonthBarChart from './charts/expenseMonthBarChart';
import ExpenseMonthByCategoryPiChart from './charts/expenseMonthByCategoryPiChart';
import ExpenseMonthByCategoryBarChart from './charts/expenseMonthByCategoryBarChart';
import ExpenseVsIncomeLineChart from './charts/expenseVsIncomeLineChart';
import { Dimmer, Loader } from 'semantic-ui-react'

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
      count: 0,
      expenseModalShow: false,
      dayExpensesRows: "",
      dimmerActive: {}
    };
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

  async componentDidMount() {
    const response = await fetch('/fin/expense/current_month_by_day');
    const body = await response.json();
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

    const responseSumByCatMonth = await fetch('/fin/expense/sum_by_category_month');
    const bodySumByCat = await responseSumByCatMonth.json();
    this.setState({
        expensesByCategory: bodySumByCat.expenseCategorySums
    });

     const responseMonthlySummary = await fetch('/fin/summary/monthly');
     const bodyMonthlySummary = await responseMonthlySummary.json();
     this.setState({
         monthlySummary: bodyMonthlySummary.records
     });

      const responseCategories = await fetch('/fin/expense/categories/names');
       const categories = await responseCategories.json();
       this.setState({
           expCategories: categories
       });

       this.setState({ dimmerActive: false })
  }

  render() {
      const {
        monthExpenses,
        expensesByCategory,
        expensesByMonth,
        monthExpensesByDay,
        monthExpensesByCategory,
        monthlySummary,
        totalMonthExpense,
        expenseModalShow,
        dayExpensesRows,
        expCategories,
        dimmerActive
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
          return <tr key={expense.category + expense.year + expense.month} onClick={this.showModal}>
                  <td id={expense.category + expense.year + expense.month + 0} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.75rem'}}>{formatYearMonth(expense.year, expense.month)}</td>
                  <td id={expense.category + expense.year + expense.month + 1} style={{textAlign: "center", fontSize: '.75rem'}}>{expense.category}</td>
                  <td id={expense.category + expense.year + expense.month + 2} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormat(expense.sum)}</td>
              </tr>
      });

     const monthlySummaryList = monthlySummary.map(record => {
          return <tr key={'' + record.year + record.month} onClick={this.showModal}>
                   <td id={'' + record.year + record.month + 0} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.75rem'}}>{formatYearMonth(record.year, record.month)}</td>
                   <td id={'' + record.year + record.month + 1} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(Math.round(record.incomeAmount))}</td>
                   <td id={'' + record.year + record.month + 2} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(Math.round(record.expenseAmount))}</td>
                   <td id={'' + record.year + record.month + 3} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(Math.round(record.transferAmount))}</td>
                   <td id={'' + record.year + record.month + 4} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(Math.round(record.investmentAmount))}</td>
                   <td id={'' + record.year + record.month + 5} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(Math.round(record.incomeAmount - record.expenseAmount - record.transferAmount))}</td>
               </tr>
      });

      return (
          <div>
             <Dimmer active={dimmerActive}>
               <Loader size='medium'>Loading</Loader>
             </Dimmer>
              <div id="cards" align="center" >
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
                <Col m={2} s={2} l={2}>
                    <Card className="card-panel teal lighten-4" textClassName="black-text" title="This Month Expenses by Day" >
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
                        <Modal isOpen={expenseModalShow} onClose={this.closeExpenseModal} contentLabel="Expenses">
                        <ModalHeader toggle={this.closeExpenseModal}/>
                         <Table striped bordered hover>
                             <thead >
                               <tr>
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
                    <Card className="card-panel teal lighten-4" closeIcon={<Icon>close</Icon>} revealIcon={<Icon>more_vert</Icon>} textClassName="black-text" title="This Month Expenses by Category" >
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
                    </Card>
                </Col>
                <Col m={4} s={4} l={3}>
                    <Card className="card-panel teal lighten-4" closeIcon={<Icon>close</Icon>} revealIcon={<Icon>more_vert</Icon>} textClassName="black-text" title="Monthly Fund Flow" >
                        <Table striped bordered hover size="sm">
                              <thead>
                                <tr>
                                  <th width="20%" style={{textAlign: "center"}}>Month</th>
                                  <th width="20%" style={{textAlign: "right"}}>Income</th>
                                  <th width="20%" style={{textAlign: "right"}}>Expense</th>
                                  <th width="20%" style={{textAlign: "right"}}>Transfer</th>
                                  <th width="20%" style={{textAlign: "right"}}>Investment</th>
                                  <th width="20%" style={{textAlign: "right"}}>Saving</th>
                                </tr>
                              </thead>
                              <tbody>
                              {monthlySummaryList}
                              </tbody>
                          </Table>
                    </Card>
                </Col>
              </Row>
              </div>
          </div>
      );
  }

}

export default HomeCards;