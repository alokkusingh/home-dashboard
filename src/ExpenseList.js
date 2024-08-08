import React, { Component } from 'react'
import { Table, Row, Col, Modal, ModalHeader} from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { parseISO, format } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { formatYearMonth } from "./utils/FormatYearMonth";
import ExpenseForCategoryBarChart from "./charts/expenseForCategoryBarChart";
import ExpenseForYearCategoryBarChart from "./charts/expenseForYearCategoryBarChart";
import { Dimmer, Loader } from 'semantic-ui-react'
import {fetchExpensesJson, fetchExpenseByCategoryMonthJson, fetchExpenseByCategoryYearJson,
        fetchMonthlyExpensesForCategoryJson, fetchExpenseHeadsJson, fetchExpenseMonthsJson,
        fetchExpensesForYearMonthJson, fetchExpensesForYearMonthAndCategoryJson} from './api/ExpensesAPIManager.js'
import "./css/modal.css"

class ExpenseList extends Component {

  constructor() {
    super();
    this.state = {
      expenses: [],
      expensesForCategory: [],
      expensesForSelectedCategoryForBar: [],
      expensesByCategory: [],
      expensesForSelectedYearCategoryForBar: [],
      expensesByYearCategory: [],
      categories: [],
      months: [],
      count: 0,
      lastTransactionDate: "",
      categoryDropDownValue: 'Grocery',
      categoryDropDownValueForBar: 'ALL',
      categoryDropdownOpen: false,
      categoryDropdownOpenForBar: false,
      monthExpDropDownValue: 'All Months',
      monthExpByCatDropDownValue: 'All Months',
      monthExpDropdownOpen: false,
      expenseCategoryModalShow: false,
      expenseCategoryMonthRows: "",
      dimmerActive: {}
    };
  }

  async componentDidMount() {

    await Promise.all([
          fetchExpensesJson().then(this.handleExpenses),
          fetchExpenseByCategoryMonthJson().then(this.handleExpenseByCategoryMonth),
          fetchExpenseByCategoryYearJson().then(this.handleExpenseByCategoryYear),
          fetchMonthlyExpensesForCategoryJson(this.state.categoryDropDownValue).then(this.handleMonthlyExpensesForCategory),
          fetchExpenseHeadsJson().then(this.handleExpenseHeads),
          fetchExpenseMonthsJson().then(this.handleExpenseMonths)
      ]);
      // All fetch calls are done now
      console.log(this.state);
  }

  handleExpenseHeads = (categories) => {
      this.setState({
          categories: categories
      });
  }

  handleExpenseMonths = (months) => {
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

  handleExpenses = (body) => {
     this.setState({
         expenses: body.expenses,
         count: body.count,
         lastTransactionDate: body.lastTransactionDate
     });
  }

  handleExpenseByCategoryMonth = (body) => {
      var expensesForSelectedCategory = body.expenseCategorySums.reduce((expensesForSelectedCategory, expense) => {
        var ym = expense.year + '-' + expense.month;
        expensesForSelectedCategory[ym] = (expensesForSelectedCategory[ym] || 0) + expense.sum;
        return expensesForSelectedCategory;
      }, {});

      this.setState({
          expensesForSelectedCategoryForBar: expensesForSelectedCategory,
          expensesByCategory: body.expenseCategorySums,
          dimmerActive: false
        }
      );
  }

  handleExpenseByCategoryYear = (body) => {
      var expensesForSelectedCategory = body.expenseCategorySums.reduce((expensesForSelectedCategory, expense) => {
        expensesForSelectedCategory[expense.year] = (expensesForSelectedCategory[expense.year] || 0) + expense.sum;
        return expensesForSelectedCategory;
      }, {});

      this.setState({
          expensesForSelectedYearCategoryForBar: expensesForSelectedCategory,
          expensesByYearCategory: body.expenseCategorySums
        }
      );
  }

  handleMonthlyExpensesForCategory = (body) => {
    this.setState(
            { expensesForCategory: body.expenseCategorySums }
       );
  }



  toggleCategory = () => {
      this.setState({
          categoryDropdownOpen: !this.state.categoryDropdownOpen
      });
  }

  changeCategoryValue = (e) => {
      this.setState({categoryDropDownValue: e.currentTarget.textContent});
      fetchMonthlyExpensesForCategoryJson(e.currentTarget.getAttribute("id"))
          .then(expensesJson => {
              this.setState(
                  { expensesForCategory: expensesJson.expenseCategorySums }
              );
          }
      );
  }

  toggleCategoryForBar = () => {
      this.setState({
          categoryDropdownOpenForBar: !this.state.categoryDropdownOpenForBar
      });
  }

  changeCategoryValueForBar = (e) => {
      const selectedOption = e.currentTarget.textContent;
      this.setState({categoryDropDownValueForBar: selectedOption});

      {
        let expensesForSelectedCategory = [];
        if (selectedOption === "ALL") {
            expensesForSelectedCategory = this.state.expensesByCategory.reduce((expensesForSelectedCategory, expense) => {
            var ym = expense.year + '-' + expense.month;
            expensesForSelectedCategory[ym] = (expensesForSelectedCategory[ym] || 0) + expense.sum;
            return expensesForSelectedCategory;
          }, {});
        } else {
            expensesForSelectedCategory = this.state.expensesByCategory.reduce((expensesForSelectedCategory, expense) => {
            var ym = expense.year + '-' + expense.month;
            if (selectedOption === expense.category) {
                expensesForSelectedCategory[ym] = (expensesForSelectedCategory[ym] || 0) + expense.sum;
            }
            return expensesForSelectedCategory;
          }, {});
        }

        this.setState(
            { expensesForSelectedCategoryForBar: expensesForSelectedCategory }
        );
      }

      {
        let expensesForSelectedCategory = [];
        if (selectedOption === "ALL") {
            expensesForSelectedCategory = this.state.expensesByYearCategory.reduce((expensesForSelectedCategory, expense) => {
            expensesForSelectedCategory[expense.year] = (expensesForSelectedCategory[expense.year] || 0) + expense.sum;
            return expensesForSelectedCategory;
          }, {});
        } else {
            expensesForSelectedCategory = this.state.expensesByYearCategory.reduce((expensesForSelectedCategory, expense) => {
            if (selectedOption === expense.category) {
                expensesForSelectedCategory[expense.year] = (expensesForSelectedCategory[expense.year] || 0) + expense.sum;
            }
            return expensesForSelectedCategory;
          }, {});
        }

        this.setState(
            { expensesForSelectedYearCategoryForBar: expensesForSelectedCategory }
        );
      }
  }

  changeYearCategoryValueForBar = (e) => {
      const selectedOption = e.currentTarget.textContent;
      this.setState({yearCategoryDropDownValueForBar: selectedOption});

      let expensesForSelectedCategory = [];
      if (selectedOption === "ALL") {
          expensesForSelectedCategory = this.state.expensesByYearCategory.reduce((expensesForSelectedCategory, expense) => {
          expensesForSelectedCategory[expense.year] = (expensesForSelectedCategory[expense.year] || 0) + expense.sum;
          return expensesForSelectedCategory;
        }, {});
      } else {
          expensesForSelectedCategory = this.state.expensesByYearCategory.reduce((expensesForSelectedCategory, expense) => {
          if (selectedOption === expense.category) {
              expensesForSelectedCategory[expense.year] = (expensesForSelectedCategory[expense.year] || 0) + expense.sum;
          }
          return expensesForSelectedCategory;
        }, {});
      }

      this.setState(
          { expensesForSelectedYearCategoryForBar: expensesForSelectedCategory }
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

      fetchExpensesForYearMonthJson(yearMonth)
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

      fetchExpensesForYearMonthAndCategoryJson(event.target.getAttribute("tranId"), this.state.categoryDropDownValue)
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
      categoryDropDownValueForBar,
      yearCategoryDropDownValueForBar,
      categoryDropdownOpen,
      categoryDropdownOpenForBar,
      expensesForCategory,
      expensesByCategory,
      expensesForSelectedCategoryForBar,
      expensesForSelectedYearCategoryForBar,
      monthExpDropdownOpen,
      monthExpDropDownValue,
      monthExpByCatDropDownValue,
      expenseCategoryModalShow,
      expenseCategoryMonthRows,
      dimmerActive
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
         <div id="cards" align="center" >
               <Dimmer active={dimmerActive}>
                 <Loader size='medium'>Loading</Loader>
               </Dimmer>
            <Row>
              <Col m={6} s={6} l={6}>
                  <div align="left" >
                  <ButtonDropdown direction="right" isOpen={categoryDropdownOpenForBar} toggle={this.toggleCategoryForBar}>
                      <DropdownToggle caret size="sm">
                          {categoryDropDownValueForBar}
                      </DropdownToggle>
                      <DropdownMenu>
                          {categories.map(e => {
                              return <DropdownItem id={e} key={e} onClick={this.changeCategoryValueForBar}>{e}</DropdownItem>
                          })}
                      </DropdownMenu>
                  </ButtonDropdown>
                  </div>
                  <Card className="card-panel teal lighten-4" textClassName="black-text">
                      <div>
                        <ExpenseForCategoryBarChart data={expensesForSelectedCategoryForBar} />
                      </div>
                  </Card>
              </Col>
              <Col m={3} s={3} l={6}>
                  <Card className="card-panel teal lighten-4" textClassName="black-text">
                      <div>
                        <ExpenseForYearCategoryBarChart data={expensesForSelectedYearCategoryForBar} />
                      </div>
                  </Card>
              </Col>
            </Row>
            <Row>
              <Col m={2} s={2} l={2}>
                <div align="left" >
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
                </div>
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
                    <Modal isOpen={expenseCategoryModalShow} onClose={this.closeExpenseCategoryModal} modalClassName="custom-modal-style">
                      <ModalHeader toggle={this.closeExpenseCategoryModal}>Expense Entries</ModalHeader>
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
                <div align="left" >
                <ButtonDropdown direction="right" >
                    <DropdownToggle caret size="sm">
                        {monthExpByCatDropDownValue}
                    </DropdownToggle>
                </ButtonDropdown>
                </div>
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
                <div align="left" >
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
                  </div>
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
         </div>
    );
  }
}
export default ExpenseList;
