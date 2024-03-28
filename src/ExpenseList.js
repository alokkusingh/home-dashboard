import React, { Component } from 'react'
import { Container, Table, Row, Col, Modal, ModalHeader} from 'reactstrap';
import { ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { parseISO, format } from 'date-fns';
import {Card} from 'react-materialize';
import { NumberFormat } from "./utils/NumberFormat";
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { formatYearMonth } from "./utils/FormatYearMonth";
import ExpenseForCategoryBarChart from "./charts/expenseForCategoryBarChart";
import ExpenseForYearCategoryBarChart from "./charts/expenseForYearCategoryBarChart";
import { Dimmer, Loader } from 'semantic-ui-react'

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
      yearCategoryDropDownValueForBar: 'ALL',
      categoryDropdownOpen: false,
      categoryDropdownOpenForBar: false,
      yearCategoryDropdownOpenForBar: false,
      monthExpDropDownValue: 'All Months',
      monthExpByCatDropDownValue: 'All Months',
      monthExpDropdownOpen: false,
      expenseCategoryModalShow: false,
      expenseCategoryMonthRows: "",
      dimmerActive: {}
    };
  }

  async componentDidMount() {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };
      // Default set Expenses for all months
      const response = await fetch('/home/api/expense', requestOptions);
      const body = await response.json();
      this.setState({
          expenses: body.expenses,
          count: body.count,
          lastTransactionDate: body.lastTransactionDate
      });

      const responseSumByCatMonth = await fetch('/home/api/expense/sum_by_category_month', requestOptions);
      const bodySumByCat = await responseSumByCatMonth.json();
      this.setState({
          expensesByCategory: bodySumByCat.expenseCategorySums
      });

      var expensesForSelectedCategory = this.state.expensesByCategory.reduce((expensesForSelectedCategory, expense) => {
        var ym = expense.year + '-' + expense.month;
        expensesForSelectedCategory[ym] = (expensesForSelectedCategory[ym] || 0) + expense.sum;
        return expensesForSelectedCategory;
      }, {});
      this.setState(
          { expensesForSelectedCategoryForBar: expensesForSelectedCategory }
      );

      const responseSumByCatYear = await fetch('/home/api/expense/sum_by_category_year', requestOptions);
      const bodySumByYearCat = await responseSumByCatYear.json();
      this.setState({
          expensesByYearCategory: bodySumByYearCat.expenseCategorySums
      });

      var expensesForSelectedYearCategory = this.state.expensesByYearCategory.reduce((expensesForSelectedCategory, expense) => {
        expensesForSelectedCategory[expense.year] = (expensesForSelectedCategory[expense.year] || 0) + expense.sum;
        return expensesForSelectedCategory;
      }, {});
      this.setState(
          { expensesForSelectedYearCategoryForBar: expensesForSelectedYearCategory }
      )

      this.setState({ dimmerActive: false })

      // Default set Expense Category - Grocery
      const catExpResponse = await fetch("/home/api/expense/monthly/categories/" + this.state.categoryDropDownValue, requestOptions);
      const catExpResponseJson = await catExpResponse.json();
      this.setState(
           { expensesForCategory: catExpResponseJson.expenseCategorySums }
      );

      const responseCategories = await fetch('/home/api/expense/categories/names', requestOptions);
      const categories = await responseCategories.json();
      this.setState({
          categories: categories
      });
      categories.push('ALL')

      const responseMonths = await fetch('/home/api/expense/months', requestOptions);
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
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));

      var requestOptions = {
        method: 'GET',
        headers: myHeaders
      };

      fetch("/home/api/expense/monthly/categories/" + e.currentTarget.getAttribute("id"), requestOptions)
          .then(response => response.json())
          .then(expensesJson => {
              console.table(expensesJson.expenses);
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

  toggleYearCategoryForBar = () => {
      this.setState({
          yearCategoryDropdownOpenForBar: !this.state.yearCategoryDropdownOpenForBar
      });
  }

  changeCategoryValueForBar = (e) => {
      const selectedOption = e.currentTarget.textContent;
      this.setState({categoryDropDownValueForBar: selectedOption});

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
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));

      var requestOptions = {
        method: 'GET',
        headers: myHeaders
      };

      fetch("/home/api/expense?yearMonth=" + yearMonth, requestOptions)
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
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));

      var requestOptions = {
        method: 'GET',
        headers: myHeaders
      };

      fetch("/home/api/expense?yearMonth=" + event.target.getAttribute("tranId") + "&category=" + this.state.categoryDropDownValue, requestOptions)
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
      categoryDropDownValueForBar,
      yearCategoryDropDownValueForBar,
      categoryDropdownOpen,
      categoryDropdownOpenForBar,
      yearCategoryDropdownOpenForBar,
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
              <Col m={6} s={6} l={6}>
                  <div align="left" >
                  <ButtonDropdown direction="right" isOpen={yearCategoryDropdownOpenForBar} toggle={this.toggleYearCategoryForBar}>
                      <DropdownToggle caret size="sm">
                          {yearCategoryDropDownValueForBar}
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
