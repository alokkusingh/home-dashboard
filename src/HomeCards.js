import React, { Component } from 'react';
import './App.css';
import { Button, Table, Row, Col, CardTitle, CardText} from 'reactstrap';
import styles from './cardStyles.css';
import { format, parseISO } from 'date-fns';
import {CardPanel, Icon, Card} from 'react-materialize';
import { NumberFormat } from "./NumberFormat";



class HomeCards extends Component {

  constructor() {
    super();
    this.state = {
      monthExpenses: [],
      expensesByCategory: [],
      expensesByMonth: [],
      count: 0
    };
  }

  async componentDidMount() {
    const response = await fetch('/fin/expense/current_month');
    const body = await response.json();
    this.setState({
        monthExpenses: body.expenses
    });
    console.log("monthExpenses: ", body.expenses);


    const responseSumByCatMonth = await fetch('/fin/expense/sum_by_category_month');
    const bodySumByCat = await responseSumByCatMonth.json();
    this.setState({
        expensesByCategory: bodySumByCat.expenseCategorySums
    });
    console.log("expensesByCategory: ", bodySumByCat.expenseCategorySums);

     const responseSumByMonth = await fetch('/fin/expense/sum_by_month');
     const bodySumByMonth = await responseSumByMonth.json();
     this.setState({
         expensesByMonth: bodySumByMonth.expenseCategorySums
     });
     console.log("expensesByMonth: ", bodySumByMonth.expenseCategorySums);
  }


  render() {

      const {monthExpenses} = this.state;
      const {expensesByCategory} = this.state;
      const {expensesByMonth} = this.state;

      const monthExpenseList = monthExpenses.map(expense => {
          return <tr key={expense.id} onClick={this.showModal}>
                  <td tranId={expense.id} style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(expense.date), 'dd MMM yyyy')}</td>
                  <td tranId={expense.id} style={{textAlign: "center"}}>{expense.head}</td>
                  <td tranId={expense.id} style={{textAlign: "right"}}>{NumberFormat(expense.amount)}</td>
              </tr>
      });

     const expensesByCategoryList = expensesByCategory.map(expense => {
        if(expense.month < 10)
          return <tr key={expense.month} onClick={this.showModal}>
                  <td tranId={expense.month} style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(expense.year + "0" + expense.month), 'MMM yyyy')}</td>
                  <td tranId={expense.month} style={{textAlign: "center"}}>{expense.category}</td>
                  <td tranId={expense.month} style={{textAlign: "right"}}>{NumberFormat(expense.sum)}</td>
              </tr>
          return <tr key={expense.month} onClick={this.showModal}>
                  <td tranId={expense.month} style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(expense.year + "" + expense.month), 'MMM yyyy')}</td>
                  <td tranId={expense.month} style={{textAlign: "center"}}>{expense.category}</td>
                  <td tranId={expense.month} style={{textAlign: "right"}}>{NumberFormat(expense.sum)}</td>
              </tr>
      });

     const expensesByMonthList = expensesByMonth.map(expense => {
        if(expense.month < 10)
          return <tr key={expense.month} onClick={this.showModal}>
                   <td tranId={expense.month} style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(expense.year + "0" + expense.month), 'MMM yyyy')}</td>
                   <td tranId={expense.month} style={{textAlign: "right"}}>{NumberFormat(expense.sum)}</td>
               </tr>
          return <tr key={expense.month} onClick={this.showModal}>
                  <td tranId={expense.month} style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(expense.year + "" + expense.month), 'MMM yyyy')}</td>
                  <td tranId={expense.month} style={{textAlign: "right"}}>{NumberFormat(expense.sum)}</td>
              </tr>
      });

      return (
          <div>
              <div id="cards" align="center" >
              <Row >
                <Col m={4} s={4} l={3}>
                    <Card
                          className="card-panel teal lighten-4"
                          textClassName="black-text"
                          title="This Month Expenses"
                        >
                       <Table striped bordered hover scrollable size="sm">
                            <thead>
                              <tr>
                                <th width="25%" style={{textAlign: "center"}}>Date</th>
                                <th width="50%" style={{textAlign: "center"}}>Head</th>
                                <th width="25%" style={{textAlign: "right"}}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                            {monthExpenseList}
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
                          title="Expense vs Income vs Investment"
                        >
                        <Table striped bordered hover size="sm">
                              <thead>
                                <tr>
                                  <th width="25%" style={{textAlign: "center"}}>Month</th>
                                  <th width="25%" style={{textAlign: "right"}}>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                              {expensesByMonthList}
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