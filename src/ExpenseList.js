import React, { Component } from 'react'
import { Table, Row, Col, Modal, ModalHeader, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { parseISO, format } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { formatYearMonth } from "./utils/FormatYearMonth";
import { getPreviousMonthYearMonth, getPreviousMonthDisplay, getCurrentYear } from "./utils/dateUtils";
import ExpenseForCategoryBarChart from "./charts/expenseForCategoryBarChart";
import ExpenseForYearCategoryBarChart from "./charts/expenseForYearCategoryBarChart";
import { Dimmer, Loader } from 'semantic-ui-react'
import {fetchExpensesJson, fetchExpenseByCategoryMonthJson, fetchExpenseByCategoryYearJson,
        fetchMonthlyExpensesForCategoryJson, fetchExpenseHeadsJson, fetchExpenseMonthsJson,
        fetchExpensesForYearMonthJson, fetchExpensesForYearMonthAndCategoryJson,
        fetchExpensesForYearAndCategoryJson} from './api/ExpensesAPIManager.js'
import "./css/modal.css"

class ExpenseList extends Component {

  constructor() {
    super();
    const previousMonthYearMonth = getPreviousMonthYearMonth();
    const previousMonthDisplay = getPreviousMonthDisplay();
    const currentYear = getCurrentYear();
    
    this.state = {
      expenses: [],
      expensesForCategory: [],
      expensesForSelectedCategoryForBar: [],
      expensesByCategory: [],
      filteredExpensesByCategory: [],
      expensesForSelectedYearCategoryForBar: [],
      expensesByYearCategory: [],
      categories: [],
      months: [],
      count: 0,
      lastTransactionDate: "",
      categoryDropDownValue: 'Grocery',
      categoryDropDownValueForBar: 'ALL',
      yearlyDropDownValueForBar: 'Total',
      categoryDropdownOpen: false,
      categoryDropdownOpenForBar: false,
      yearlyDropdownOpenForBar: false,
      monthExpDropDownValue: previousMonthDisplay,
      monthExpByCatDropDownValue: previousMonthDisplay,
      previousMonthYearMonth: previousMonthYearMonth,
      monthExpDropdownOpen: false,
      monthExpByCatDropdownOpen: false,
      yearExpByCatDropDownValue: String(currentYear),
      currentYear: currentYear,
      yearExpByCatDropdownOpen: false,
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
          fetchExpenseMonthsJson().then(this.handleExpenseMonths),
          fetchExpenseByCategoryMonthJson(this.state.previousMonthYearMonth).then(expensesJson => {
              this.setState({ filteredExpensesByCategory: expensesJson.expenseCategorySums || [] });
          }),
          fetchExpenseByCategoryYearJson(this.state.currentYear).then(expensesJson => {
              this.setState({ expensesByYearCategory: expensesJson.expenseCategorySums || [] });
          }),
          fetchExpensesForYearMonthJson(this.state.previousMonthYearMonth).then(expensesJson => {
              this.setState({ expenses: expensesJson.expenses || [] });
          })
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
          filteredExpensesByCategory: body.expenseCategorySums,
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
  toggleYearlyForBar = () => {
      this.setState({
          yearlyDropdownOpenForBar: !this.state.yearlyDropdownOpenForBar
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
      this.setState({yearlyDropDownValueForBar: selectedOption});

      let expensesForSelectedCategory = [];
      if (selectedOption === "Total") {
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

  toggleExpMonthByCategory = () => {
      this.setState({
          monthExpByCatDropdownOpen: !this.state.monthExpByCatDropdownOpen
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

  changeExpMonthByCategoryValue = (e) => {
      const yearMonth = e.currentTarget.getAttribute("id");
      const selectedMonth = e.currentTarget.textContent;
      this.setState({
          monthExpByCatDropDownValue: selectedMonth,
          monthExpByCatDropdownOpen: false
      });

      fetchExpenseByCategoryMonthJson(yearMonth || undefined)
          .then(expensesJson => {
              this.setState({ filteredExpensesByCategory: expensesJson.expenseCategorySums || [] });
          });
  }

  toggleYearlyExpByCategory = () => {
      this.setState({
          yearExpByCatDropdownOpen: !this.state.yearExpByCatDropdownOpen
      });
  }

  changeYearlyExpByCategoryValue = (e) => {
      const year = e.currentTarget.getAttribute("id");
      const selectedYear = e.currentTarget.textContent;
      this.setState({
          yearExpByCatDropDownValue: selectedYear,
          yearExpByCatDropdownOpen: false
      });

      fetchExpenseByCategoryYearJson(year || undefined)
          .then(expensesJson => {
              this.setState({ expensesByYearCategory: expensesJson.expenseCategorySums || [] });
          });
  }

  showExpenseCategoryModal = (event) => {
      const yearMonth = event.currentTarget.getAttribute("tranId");
      const category = event.currentTarget.getAttribute("category");
      if (!yearMonth || !category || yearMonth === 'null' || category === 'null') {
          return;
      }

      console.log("event: ", { yearMonth, category })

      fetchExpensesForYearMonthAndCategoryJson(yearMonth, category)
          .then(expensesJson => {
              const expenseCategoryMonthRows = expensesJson.expenses.map((expense, index) => {
                  return <tr key={expense.id || (yearMonth + '-' + category + '-' + index)}>
                      <td style={{whiteSpace: 'nowrap', textAlign: "Left", fontSize: '.8rem'}}>{format(parseISO(expense.date), 'dd MMM yyyy')}</td>
                      <td style={{whiteSpace: 'wrap', textAlign: "Left" , fontSize: '.8rem'}}>{expense.head}</td>
                      <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{expense.amount}</td>
                      <td style={{whiteSpace: 'wrap', textAlign: "left", fontWeight: '200', fontSize: '.8rem'}}>{expense.comment}</td>
                   </tr>
              });
              this.setState({ expenseCategoryMonthRows: expenseCategoryMonthRows, expenseCategoryModalShow: true });
          }
      );
  }

  showYearlyExpenseCategoryModal = (event) => {
      const year = event.currentTarget.getAttribute("year");
      const category = event.currentTarget.getAttribute("category");
      if (!year || !category || year === 'null' || category === 'null') {
          return;
      }

      fetchExpensesForYearAndCategoryJson(year, category)
          .then(expensesJson => {
              const expenseCategoryMonthRows = expensesJson.expenses.map((expense, index) => {
                  return <tr key={expense.id || (year + '-' + category + '-' + index)}>
                      <td style={{whiteSpace: 'nowrap', textAlign: "Left", fontSize: '.8rem'}}>{format(parseISO(expense.date), 'dd MMM yyyy')}</td>
                      <td style={{whiteSpace: 'wrap', textAlign: "Left" , fontSize: '.8rem'}}>{expense.head}</td>
                      <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{expense.amount}</td>
                      <td style={{whiteSpace: 'wrap', textAlign: "left", fontWeight: '200', fontSize: '.8rem'}}>{expense.comment}</td>
                   </tr>
              });
              this.setState({ expenseCategoryMonthRows: expenseCategoryMonthRows, expenseCategoryModalShow: true });
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
      yearlyDropDownValueForBar,
      yearlyCategoryDropDownValueForBar,
      categoryDropdownOpen,
      categoryDropdownOpenForBar,
      yearlyDropdownOpenForBar,
      expensesForCategory,
      expensesByCategory,
      filteredExpensesByCategory,
      expensesForSelectedCategoryForBar,
      expensesForSelectedYearCategoryForBar,
      expensesByYearCategory,
      monthExpDropdownOpen,
      monthExpDropDownValue,
      monthExpByCatDropDownValue,
      monthExpByCatDropdownOpen,
      yearExpByCatDropDownValue,
      yearExpByCatDropdownOpen,
      expenseCategoryModalShow,
      expenseCategoryMonthRows,
      dimmerActive
    } = this.state;

    const title = "Expenses";
    const years = Array.from(new Set(months.map(month => month.year))).sort((a, b) => b - a);

    const expenseForCategoriesRows = expensesForCategory.map(record => {
       return <tr key={record.year +'-'+ record.month} tranId={record.year +'-'+ record.month} category={categoryDropDownValue} onClick={this.showExpenseCategoryModal}>
               <td style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>{formatYearMonth(record.year, record.month)}</td>
               <td style={{textAlign: "right", fontSize: '.9rem'}}>{NumberFormatNoDecimal(record.sum)}</td>
             </tr>
    });

    const expenseByCategoryListRows = filteredExpensesByCategory.map(expense => {
        return <tr key={expense.id} tranId={expense.year +'-'+ expense.month} category={expense.category} onClick={this.showExpenseCategoryModal}>
               <td style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>{formatYearMonth(expense.year, expense.month)}</td>
               <td style={{textAlign: "center", fontSize: '.9rem'}}>{expense.category}</td>
               <td style={{textAlign: "right", fontSize: '.9rem'}}>{NumberFormatNoDecimal(expense.sum)}</td>
            </tr>
    });

    const yearlyExpenseByCategoryListRows = expensesByYearCategory.map(expense => {
        return <tr key={expense.id || (expense.year + '-' + expense.category)} year={expense.year} category={expense.category} onClick={this.showYearlyExpenseCategoryModal}>
               <td style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>{expense.year}</td>
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
                  <div align="left" >
                  <ButtonDropdown direction="right" isOpen={yearlyDropdownOpenForBar} toggle={this.toggleYearlyForBar}>
                      <DropdownToggle caret size="sm">
                          {yearlyDropDownValueForBar}
                      </DropdownToggle>
                      <DropdownMenu>
                          {categories.map(e => {
                              return <DropdownItem id={e} key={e} onClick={this.changeYearCategoryValueForBar}>{e}</DropdownItem>
                          })}
                      </DropdownMenu>
                  </ButtonDropdown>
                  </div>
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
                        <ButtonDropdown direction="right" isOpen={monthExpByCatDropdownOpen} toggle={this.toggleExpMonthByCategory}>
                            <DropdownToggle caret size="sm">
                                {monthExpByCatDropDownValue}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem id="" key="all-months" onClick={this.changeExpMonthByCategoryValue}>All Months</DropdownItem>
                                {months.map(e => {
                                    return <DropdownItem id={e.year + '-' + e.month} key={e.monthStr} onClick={this.changeExpMonthByCategoryValue}>{e.monthStr}</DropdownItem>
                                })}
                            </DropdownMenu>
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
                <ButtonDropdown direction="right" isOpen={yearExpByCatDropdownOpen} toggle={this.toggleYearlyExpByCategory}>
                    <DropdownToggle caret size="sm">
                        {yearExpByCatDropDownValue}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem id="" key="all-years" onClick={this.changeYearlyExpByCategoryValue}>All Years</DropdownItem>
                        {years.map(year => {
                            return <DropdownItem id={year} key={year} onClick={this.changeYearlyExpByCategoryValue}>{year}</DropdownItem>
                        })}
                    </DropdownMenu>
                </ButtonDropdown>
                </div>
                <Card className="teal lighten-4" textClassName="black-text" title="Yearly Expenses by Category" >
                <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th width="10%" style={{textAlign: "center"}}>Year</th>
                        <th width="10%" style={{textAlign: "center"}}>Category</th>
                        <th width="10%" style={{textAlign: "right"}}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyExpenseByCategoryListRows}
                    </tbody>
                </Table>
                </Card>
              </Col>
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
