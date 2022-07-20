import React, { Component } from 'react'
import { Container, Table, Row, Col, Modal, ModalHeader} from 'reactstrap';
import { ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { parseISO, format } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormat } from "./utils/NumberFormat";
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { formatYearMonth } from "./utils/FormatYearMonth";

class ExpenseList extends Component {

  constructor() {
    super();
    this.state = {
      expenses: [],
      expensesForCategory: [],
      expensesByCategory: [],
      categories: [],
      months: [],
      count: 0,
      lastTransactionDate: "",
      categoryDropDownValue: 'Grocery',
      categoryDropdownOpen: false,
      monthExpDropDownValue: 'All Months',
      monthExpByCatDropDownValue: 'All Months',
      monthExpDropdownOpen: false,
      expenseCategoryModalShow: false,
      expenseCategoryMonthRows: ""
    };
  }

  async componentDidMount() {

      // Default set Expenses for all months
      const response = await fetch('/fin/expense');
      const body = await response.json();
      this.setState({
          expenses: body.expenses,
          count: body.count,
          lastTransactionDate: body.lastTransactionDate
      });

      const responseSumByCatMonth = await fetch('/fin/expense/sum_by_category_month');
      const bodySumByCat = await responseSumByCatMonth.json();
      this.setState({
          expensesByCategory: bodySumByCat.expenseCategorySums
      });

      // Default set Expense Category - Grocery
      const catExpResponse = await fetch("/fin/expense/monthly/categories/" + this.state.categoryDropDownValue);
      const catExpResponseJson = await catExpResponse.json();
      this.setState(
           { expensesForCategory: catExpResponseJson.expenseCategorySums }
      );

      const responseCategories = await fetch('/fin/expense/categories/names');
      const categories = await responseCategories.json();
      this.setState({
          categories: categories
      });

      const responseMonths = await fetch('/fin/expense/months');
      const months = await responseMonths.json();
      var monthsArr = [];
      months.forEach(
        month => monthsArr.push({
            'year': month.year,
            'month': month.month,
            'monthStr': formatYearMonth(month.year, month.month)
        })
      )
      this.setState({
          months: monthsArr
      });
  }

  toggleCategory = () => {
      this.setState({
          categoryDropdownOpen: !this.state.categoryDropdownOpen
      });
  }

  changeCategoryValue = (e) => {
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

  toggleExpMonth = () => {
      this.setState({
          monthExpDropdownOpen: !this.state.monthExpDropdownOpen
      });
  }

  changeExpMonthValue = (e) => {
      const yearMonth = e.currentTarget.getAttribute("id");
      this.setState({monthExpDropDownValue: e.currentTarget.textContent});

      fetch("/fin/expense?yearMonth=" + yearMonth)
          .then(response => response.json())
          .then(expensesJson => {
              console.table(expensesJson.expenses);
              this.setState(
                  { expenses: expensesJson.expenses }
              );
          }
      );
  }

  showExpenseCategoryModal = (event) => {
      console.log("event: ", event.target.getAttribute("tranId"))
      fetch("/fin/expense?yearMonth=" + event.target.getAttribute("tranId") + "&category=" + this.state.categoryDropDownValue)
          .then(response => response.json())
          .then(expensesJson => {
              const expenseCategoryMonthRows = expensesJson.expenses.map( expense => {
                  return <tr>
                      <td style={{whiteSpace: 'nowrap', textAlign: "Left", fontSize: '.8rem'}}>{format(parseISO(expense.date), 'dd MMM yyyy')}</td>
                      <td style={{whiteSpace: 'wrap', textAlign: "Left" , fontSize: '.8rem'}}>{expense.head}</td>
                      <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{expense.amount}</td>
                      <td style={{whiteSpace: 'wrap', textAlign: "left", fontWeight: '200', fontSize: '.8rem'}}>{expense.comment}</td>
                   </tr>
              });
              this.setState({ expenseCategoryMonthRows: expenseCategoryMonthRows });
              this.setState({ expenseCategoryModalShow: !this.state.expenseCategoryModalShow });
          }
      );
  }

  closeExpenseCategoryModal = () => {
      this.setState({ expenseCategoryModalShow: !this.state.expenseCategoryModalShow });
  };

  render() {
    const {
      expenses,
      count,
      lastTransactionDate,
      categories,
      months,
      categoryDropDownValue,
      categoryDropdownOpen,
      expensesForCategory,
      expensesByCategory,
      monthExpDropdownOpen,
      monthExpDropDownValue,
      monthExpByCatDropDownValue,
      expenseCategoryModalShow,
      expenseCategoryMonthRows
    } = this.state;
    const title = "Expenses";

    const expenseForCategoriesRows = expensesForCategory.map(record => {
       return <tr key={record.year +'-'+ record.month} onClick={this.showExpenseCategoryModal}>
               <td tranId={record.year +'-'+ record.month} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>{formatYearMonth(record.year, record.month)}</td>
               <td tranId={record.year +'-'+ record.month} style={{textAlign: "right", fontSize: '.9rem'}}>{NumberFormatNoDecimal(record.sum)}</td>
             </tr>
    });

    const expenseByCategoryListRows = expensesByCategory.map(expense => {
        return <tr key={expense.id} >
                <td style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>{formatYearMonth(expense.year, expense.month)}</td>
                <td style={{textAlign: "center", fontSize: '.9rem'}}>{expense.category}</td>
                <td style={{textAlign: "right", fontSize: '.9rem'}}>{NumberFormatNoDecimal(expense.sum)}</td>
            </tr>
    });

    const expenseList = expenses.map(expense => {
        return <tr key={expense.id} >
                <td style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>{format(parseISO(expense.date), 'dd MMM yyyy')}</td>
                <td style={{textAlign: "center", fontSize: '.9rem'}}>{expense.head}</td>
                <td style={{textAlign: "right", fontSize: '.9rem'}}>{NumberFormatNoDecimal(expense.amount)}</td>
                <td style={{textAlign: "center", fontSize: '.9rem'}}>{expense.category}</td>
                <td style={{textAlign: "center", fontSize: '.9rem'}}>{expense.comment}</td>
            </tr>
    });

    return (
         <div className="teal lighten-5">
             <AppNavbar title="Expense"/>
                <Container fluid>
                  <Row>
                    <Col m={6} s={6} l={6}>
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
                      <ButtonDropdown direction="right" isOpen={categoryDropdownOpen} toggle={this.toggleCategory}>
                          <DropdownToggle caret size="sm">
                              {categoryDropDownValue}
                          </DropdownToggle>
                          <DropdownMenu>
                              {categories.map(e => {
                                  return <DropdownItem id={e} key={e} onClick={this.changeCategoryValue}>{e}</DropdownItem>
                              })}
                          </DropdownMenu>
                      </ButtonDropdown>
                      <Card className="teal lighten-4" textClassName="black-text" title="Monthly Expense for Category" >
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
                          <Modal isOpen={expenseCategoryModalShow} onClose={this.closeExpenseCategoryModal} contentLabel="ExpenseCategory">
                            <ModalHeader toggle={this.closeExpenseCategoryModal}/>
                            <Table striped bordered hover>
                               <thead >
                                 <tr>
                                   <th>Date</th>
                                   <th>Head</th>
                                   <th>Amount</th>
                                   <th>Comment</th>
                                 </tr>
                               </thead>
                               <tbody>
                                 {expenseCategoryMonthRows}
                               </tbody>
                             </Table>
                          </Modal>
                      </Card>
                    </Col>
                    <Col m={2} s={2} l={2}>
                      <ButtonDropdown direction="right" >
                          <DropdownToggle caret size="sm">
                              {monthExpByCatDropDownValue}
                          </DropdownToggle>
                      </ButtonDropdown>
                      <Card className="teal lighten-4" textClassName="black-text" title="Monthly Expenses by Category" >
                      <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th width="10%" style={{textAlign: "center"}}>Month</th>
                              <th width="10%" style={{textAlign: "center"}}>Category</th>
                              <th width="10%" style={{textAlign: "right"}}>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expenseByCategoryListRows}
                          </tbody>
                      </Table>
                      </Card>
                    </Col>
                    <Col m={2} s={2} l={2}>
                        <ButtonDropdown direction="right" isOpen={monthExpDropdownOpen} toggle={this.toggleExpMonth}>
                            <DropdownToggle caret size="sm">
                                {monthExpDropDownValue}
                            </DropdownToggle>
                            <DropdownMenu>
                                {months.map(e => {
                                    return <DropdownItem id={e.year + '-' + e.month} key={e.monthStr} onClick={this.changeExpMonthValue}>{e.monthStr}</DropdownItem>
                                })}
                            </DropdownMenu>
                        </ButtonDropdown>
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
