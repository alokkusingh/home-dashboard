import React, { Component } from 'react'
import { Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { parseISO, format } from 'date-fns';
import {CardPanel, Icon, Card} from 'react-materialize';
import { NumberFormat } from "./NumberFormat";
import Modal from './Modal.js';

class ExpenseList extends Component {

  constructor() {
    super();
    this.state = {
      expenses: [],
      count: 0,
      lastTransactionDate: ""
    };
  }

  async componentDidMount() {
    const response = await fetch('/fin/expense/all');
    const body = await response.json();
    this.setState({
        expenses: body.expenses,
        count: body.count,
        lastTransactionDate: body.lastTransactionDate
    });
  }

  render() {
    const {expenses} = this.state;
    const {count} = this.state;
    const {lastTransactionDate} = this.state;
    const title = "Expenses (" + count + ")";

    const expenseList = expenses.map(expense => {
        return <tr key={expense.id} >
                <td style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(expense.date), 'dd MMM yyyy')}</td>
                <td style={{textAlign: "center"}}>{expense.head}</td>
                <td style={{textAlign: "right"}}>{NumberFormat(expense.amount)}</td>
                <td style={{textAlign: "center"}}>{expense.category}</td>
                <td style={{textAlign: "center"}}>{expense.comment}</td>
            </tr>
    });

    return (
         <div className="teal lighten-5">
             <AppNavbar/>
                <Container fluid>
                <Card
                      className="teal lighten-4"
                      textClassName="black-text"
                      title={title}
                    >
                    <div style={{float: 'right'}}>
                      <p class="grey-text text-lighten-0 right">Last Transaction Date {lastTransactionDate}</p>
                    </div>
                    <Table className="mt-4" hover="true">
                        <thead>
                          <tr>
                            <th width="10%" style={{textAlign: "center"}}>Date</th>
                            <th width="10%" style={{textAlign: "center"}}>Head</th>
                            <th width="10%" style={{textAlign: "right"}}>Amount</th>
                            <th width="10%" style={{textAlign: "center"}}>Category</th>
                            <th width="20%" style={{textAlign: "center"}}>Comment</th>
                          </tr>
                        </thead>
                        <tbody>
                        {expenseList}
                        </tbody>
                    </Table>
                    </Card>
                </Container>
         </div>
    );
  }
}
export default ExpenseList;
