import React, { Component, useState, useEffect } from 'react';
import './App.css';
import { Table, Row, Col, Modal, ModalHeader} from 'reactstrap';
import { format, parseISO } from 'date-fns';
import {Icon, Card} from 'react-materialize';
import { NumberFormat } from "./NumberFormat";
import { NumberFormatNoDecimal } from "./NumberFormatNoDecimal";
import ExpenseMonthBarChart from './expenseMonthBarChart';
import ExpenseMonthByCategoryPiChart from './expenseMonthByCategoryPiChart';
import ExpenseMonthByCategoryPiChart2 from './expenseMonthByCategoryPiChart2';
import ExpenseMonthByCategoryBarChart from './expenseMonthByCategoryBarChart'
import ExpenseVsIncomeLineChart from './expenseVsIncomeLineChart'
import ExpenseVsIncomeLineChartAll from './expenseVsIncomeLineChartAll'

class HomeCards extends Component {

  constructor() {
    super();
    this.state = {
      monthExpenses: [],
      expensesByCategory: [],
      expensesByMonth: [],
      monthExpensesByDay: [],
      monthExpensesByCategory: [],
      monthlySummary: [],
      totalMonthExpense: 0,
      count: 0,
      expenseModalShow: false,
      dayExpensesRows: ""
    };
  }

  showExpenseModal = (event) => {
      console.log("event: ", event.target.getAttribute("tranId"))
      let expenseDayDetails = [];
      this.state.monthExpensesByDay.forEach(
        record => {
            if (record.date == event.target.getAttribute("tranId")) {
                expenseDayDetails = record.expenses;
            }
        }
      );
      console.log(expenseDayDetails);
      const dayExpensesRows = expenseDayDetails.map(expense => {
        return <tr>
                  <td style={{whiteSpace: 'nowrap', textAlign: "Left"}}>{expense.head}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "left"}}>{expense.comment}</td>
                  <td style={{whiteSpace: 'nowrap', textAlign: "right"}}>{expense.amount}</td>
               </tr>
        });

      this.setState({dayExpensesRows: dayExpensesRows});

      this.setState({ expenseModalShow: !this.state.expenseModalShow });
  }

  closeExpenseModal = () => {
      console.log("event: closeExpenseModal");
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
    console.log("monthExpensesByDay: ", body.expenses);

    const responseSumByCatMonth = await fetch('/fin/expense/sum_by_category_month');
    const bodySumByCat = await responseSumByCatMonth.json();
    this.setState({
        expensesByCategory: bodySumByCat.expenseCategorySums
    });
    console.log("expensesByCategory: ", bodySumByCat.expenseCategorySums);

     const responseMonthlySummary = await fetch('/fin/summary/monthly');
     const bodyMonthlySummary = await responseMonthlySummary.json();
     this.setState({
         monthlySummary: bodyMonthlySummary.records
     });
     console.log("monthlySummary: ", bodyMonthlySummary.records);
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
        dayExpensesRows
      } =  this.state;


      const monthExpenseList = monthExpenses.map(expense => {
          return <tr key={expense.id} onClick={this.showModal}>
                  <td tranId={expense.id} style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(expense.date), 'dd MMM yyyy')}</td>
                  <td tranId={expense.id} style={{textAlign: "center"}}>{expense.head}</td>
                  <td tranId={expense.id} style={{textAlign: "right"}}>{NumberFormat(expense.amount)}</td>
              </tr>
      });

      const monthExpensesByDayList = monthExpensesByDay.map(expense => {
                return <tr key={expense.date} onClick={this.showExpenseModal}>
                        <td tranId={expense.date} style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(expense.date), 'dd MMM yyyy')}</td>
                        <td tranId={expense.date} style={{textAlign: "right"}}>{NumberFormat(expense.amount)}</td>
                    </tr>
            });

     const expensesByCategoryList = expensesByCategory.map(expense => {
        if(expense.month < 10)
          return <tr key={expense.category + expense.year + expense.month} onClick={this.showModal}>
                  <td tranId={expense.category + expense.year + expense.month + 0} style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(expense.year + "0" + expense.month), 'MMM yyyy')}</td>
                  <td tranId={expense.category + expense.year + expense.month + 1} style={{textAlign: "center"}}>{expense.category}</td>
                  <td tranId={expense.category + expense.year + expense.month + 2} style={{textAlign: "right"}}>{NumberFormat(expense.sum)}</td>
              </tr>
          return <tr key={expense.category + expense.year + expense.month} onClick={this.showModal}>
                  <td tranId={expense.category + expense.year + expense.month + 0} style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(expense.year + "" + expense.month), 'MMM yyyy')}</td>
                  <td tranId={expense.category + expense.year + expense.month + 1} style={{textAlign: "center"}}>{expense.category}</td>
                  <td tranId={expense.category + expense.year + expense.month + 2} style={{textAlign: "right"}}>{NumberFormat(expense.sum)}</td>
              </tr>
      });

     const monthlySummaryList = monthlySummary.map(record => {
        if(record.month < 10)
          return <tr key={'' + record.year + record.month} onClick={this.showModal}>
                   <td tranId={'' + record.year + record.month + 0} style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(record.year + "0" + record.month), 'MMM yyyy')}</td>
                   <td tranId={'' + record.year + record.month + 1} style={{textAlign: "right"}}>{NumberFormatNoDecimal(Math.round(record.incomeAmount))}</td>
                   <td tranId={'' + record.year + record.month + 2} style={{textAlign: "right"}}>{NumberFormatNoDecimal(Math.round(record.expenseAmount))}</td>
                   <td tranId={'' + record.year + record.month + 3} style={{textAlign: "right"}}>{NumberFormatNoDecimal(Math.round(record.transferAmount))}</td>
                   <td tranId={'' + record.year + record.month + 4} style={{textAlign: "right"}}>{NumberFormatNoDecimal(Math.round(record.incomeAmount - record.expenseAmount - record.transferAmount))}</td>
               </tr>
          return <tr key={'' + record.year + record.month} onClick={this.showModal}>
                   <td tranId={'' + record.year + record.month + 0} style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(record.year + "" + record.month), 'MMM yyyy')}</td>
                   <td tranId={'' + record.year + record.month + 1} style={{textAlign: "right"}}>{NumberFormatNoDecimal(Math.round(record.incomeAmount))}</td>
                   <td tranId={'' + record.year + record.month + 2} style={{textAlign: "right"}}>{NumberFormatNoDecimal(Math.round(record.expenseAmount))}</td>
                   <td tranId={'' + record.year + record.month + 3} style={{textAlign: "right"}}>{NumberFormatNoDecimal(Math.round(record.transferAmount))}</td>
                   <td tranId={'' + record.year + record.month + 4} style={{textAlign: "right"}}>{NumberFormatNoDecimal(Math.round(record.incomeAmount - record.expenseAmount - record.transferAmount))}</td>
              </tr>
      });

      return (
          <div>
              <div id="cards" align="center" >
              <Row>
                <Col m={2} s={2} l={2}>
                    <Card
                          className="card-panel teal lighten-4"
                          textClassName="black-text"
                        >
                        <div>
                             <ExpenseMonthBarChart data={monthExpensesByDay} />
                        </div>
                    </Card>
                </Col>
                <Col m={2} s={2} l={2}>
                    <Card
                          className="card-panel teal lighten-4"
                          textClassName="black-text"
                        >
                        <div>
                             <ExpenseMonthByCategoryPiChart data={monthExpensesByCategory} />
                        </div>
                    </Card>
                </Col>
                <Col m={2} s={2} l={2}>
                    <Card
                          className="card-panel teal lighten-4"
                          textClassName="black-text"
                        >
                        <div>
                             <ExpenseVsIncomeLineChart data={monthlySummary} />
                        </div>
                    </Card>
                </Col>
              </Row>
              <Row >
                <Col m={2} s={2} l={2}>
                    <Card
                          className="card-panel teal lighten-4"
                          textClassName="black-text"
                          title="This Month Expenses by Day"
                        >
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
                    <Card
                          className="card-panel teal lighten-4"
                          closeIcon={<Icon>close</Icon>}
                          revealIcon={<Icon>more_vert</Icon>}
                          textClassName="black-text"
                          title="This Month Expenses by Category"
                        >
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
                    <Card
                          className="card-panel teal lighten-4"
                          closeIcon={<Icon>close</Icon>}
                          revealIcon={<Icon>more_vert</Icon>}
                          textClassName="black-text"
                          title="Monthly Income vs Expense vs Transfer vs Investment vs Saving"
                        >
                        <Table striped bordered hover size="sm">
                              <thead>
                                <tr>
                                  <th width="20%" style={{textAlign: "center"}}>Month</th>
                                  <th width="20%" style={{textAlign: "right"}}>Income</th>
                                  <th width="20%" style={{textAlign: "right"}}>Expense</th>
                                  <th width="20%" style={{textAlign: "right"}}>Transfer</th>
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