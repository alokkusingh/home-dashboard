import React, { Component } from 'react'
import { Container, Table, Row, Col } from 'reactstrap';
import { ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { parseISO, format } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormat } from "./NumberFormat";
import { NumberFormatNoDecimal } from "./NumberFormatNoDecimal";

class ExpenseList extends Component {

  constructor() {
    super();
    this.state = {
      expenses: [],
      expensesForCategory: [],
      categories: [],
      count: 0,
      lastTransactionDate: "",
      categoryDropDownValue: 'Select a category',
      categoryDropdownOpen: false
    };
  }

  toggleCategory = () => {
      this.setState({
          categoryDropdownOpen: !this.state.categoryDropdownOpen
      });
  }

  changeCategoryValue = (e) => {
      console.log(e)
      this.setState({categoryDropDownValue: e.currentTarget.textContent});

      fetch("/fin/expense/monthly/categories/" + e.currentTarget.getAttribute("id"))
          .then(response => response.json())
          .then(expensesJson => {
              console.table(expensesJson.expenses);
              this.setState(
                  { expensesForCategory: expensesJson.expenseCategorySums }
              );
          }
      );
  }

  async componentDidMount() {
    const response = await fetch('/fin/expense/all');
    const body = await response.json();
    this.setState({
        expenses: body.expenses,
        count: body.count,
        lastTransactionDate: body.lastTransactionDate
    });

    const responseCategories = await fetch('/fin/expense/categories/names');
    const categories = await responseCategories.json();
    this.setState({
        categories: categories
    });
  }

  render() {
    const {
      expenses,
      count,
      lastTransactionDate,
      categories,
      categoryDropDownValue,
      categoryDropdownOpen,
      expensesForCategory
    } = this.state;
    const title = "Expenses";

    const expenseList = expenses.map(expense => {
        return <tr key={expense.id} >
                <td style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(expense.date), 'dd MMM yyyy')}</td>
                <td style={{textAlign: "center"}}>{expense.head}</td>
                <td style={{textAlign: "right"}}>{NumberFormat(expense.amount)}</td>
                <td style={{textAlign: "center"}}>{expense.category}</td>
                <td style={{textAlign: "center"}}>{expense.comment}</td>
            </tr>
    });

    const expenseForCategoriesRows = expensesForCategory.map(record => {
        if(record.month < 10)
            return <tr>
               <td style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(record.year + "0" + record.month), 'MMM yyyy')}</td>
               <td style={{textAlign: "right"}}>{NumberFormatNoDecimal(record.sum)}</td>
             </tr>
            return <tr>
               <td style={{whiteSpace: 'nowrap', textAlign: "center"}}>{format(parseISO(record.year + "" + record.month), 'MMM yyyy')}</td>
               <td style={{textAlign: "right"}}>{NumberFormatNoDecimal(record.sum)}</td>
             </tr>
    });

    return (
         <div className="teal lighten-5">
             <AppNavbar/>
                <Container fluid>
                  <tr>
                    <td><h1>{title}</h1></td>
                  </tr>
                  <Row>
                    <Col m={2} s={2} l={2}>
                    </Col>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text">
                            <div>
                            <h3>Coming soon...</h3>
                            </div>
                        </Card>
                    </Col>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text">
                            <div>
                            <h3>Coming soon...</h3>
                            </div>
                        </Card>
                    </Col>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text">
                            <div>
                            <h3>Coming soon...</h3>
                            </div>
                        </Card>
                    </Col>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text">
                            <div>
                            <h3>Coming soon...</h3>
                            </div>
                        </Card>
                    </Col>
                  </Row>
                  <Row>
                    <Col m={2} s={2} l={2}>
                      <ButtonDropdown isOpen={categoryDropdownOpen} toggle={this.toggleCategory}>
                          <DropdownToggle caret>
                              {categoryDropDownValue}
                          </DropdownToggle>
                          <DropdownMenu>
                              {categories.map(e => {
                                  return <DropdownItem id={e} key={e} onClick={this.changeCategoryValue}>{e}</DropdownItem>
                              })}
                          </DropdownMenu>
                      </ButtonDropdown>
                      <Card className="teal lighten-4" textClassName="black-text" title="Month Expense for Category" >
                          <Table striped bordered hover size="sm">
                              <thead>
                                <tr>
                                  <th width="10%" style={{textAlign: "center"}}>Month</th>
                                  <th width="10%" style={{textAlign: "right"}}>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {expenseForCategoriesRows}
                              </tbody>
                          </Table>
                      </Card>
                    </Col>
                    <Col m={2} s={2} l={2}>
                    <Card className="teal lighten-4" textClassName="black-text" title="Total Expenses" >
                    <Table striped bordered hover size="sm">
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
                    </Col>
                  </Row>
                </Container>
         </div>
    );
  }
}
export default ExpenseList;
