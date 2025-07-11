import React, { Component } from 'react'
import { Table, Row, Col, Modal, ModalHeader } from 'reactstrap';
import { Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { formatYearMonth } from "./utils/FormatYearMonth";
import DrawPiChart from "./charts/drawPiChart";
import DrawBarChart from "./charts/drawBarChart";
import DrawSalaryBarChart from "./charts/drawSalaryBarChart";
import {fetchYearlyTaxPaidJson} from './api/SalaryAPIManager.js'
import {fetchSalaryByCompanyJson} from './api/BankAPIManager.js'
import {fetchMonthlyIncomeExpenseSummaryJson} from './api/SummaryAPIManager.js'
import {fetchInvestmentsForMonthProto} from './api/InvestmentAPIManager.js'
import "./css/modal.css"

class Salary extends Component {

  constructor() {
    super();
    this.state = {
      total: 0,
      subexTotal: 0,
      subexByMonth: [],
      evolTotal: 0,
      evolByMonth: [],
      wiproTotal: 0,
      wiproByMonth: [],
      yodleeTotal: 0,
      yodleeByMonth: [],
      boschTotal: 0,
      boschByMonth: [],
      jpmcTotal: 0,
      jpmcByMonth: [],
      taxByYear: "",
      monthlySummary: [],
      monthDetailsModalShow: false,
      monthDetailsRows: []
    };
  }

  async componentDidMount() {
    await Promise.all([
      fetchYearlyTaxPaidJson().then(this.handleYearlyTaxPaid),
      fetchSalaryByCompanyJson().then(this.handleSalaryByCompany),
      fetchMonthlyIncomeExpenseSummaryJson().then(this.handleMonthlyIncomeExpenseSummary),
    ]);
    // All fetch calls are done now
    console.log(this.state);
  }

  handleYearlyTaxPaid = (body) => {
    if (body == undefined || body.taxes == undefined) {
      return;
    }
    const taxByYearMap = new Map();
    body.taxes.map(record => {
      taxByYearMap.set(record.financialYear, Math.abs(record.paidAmount));
    });
    this.setState({
        taxByYear: taxByYearMap
    });
  }

  handleSalaryByCompany = (body) => {
    if (body === undefined || body.total === undefined) {
    }
    this.setState({
        total: body.total
    });

    for (let companyRecord of body.companySalaries) {
      let name = companyRecord.company;
      let companyTotal = companyRecord.total;
      let companySalaryByMonth = companyRecord.monthSalaries

      if (name === 'SUBEX') {
        this.setState({
           subexTotal: companyTotal,
           subexByMonth: companySalaryByMonth
        });
      }
      if (name === 'EVOLVING') {
        this.setState({
           evolTotal: companyTotal,
           evolByMonth: companySalaryByMonth
        });
      }
      if (name === 'WIPRO') {
        this.setState({
           wiproTotal: companyTotal,
           wiproByMonth: companySalaryByMonth
        });
      }
      if (name === 'YODLEE') {
        this.setState({
           yodleeTotal: companyTotal,
           yodleeByMonth: companySalaryByMonth
        });
      }
      if (name === 'ROBERT_BOSCH') {
        this.setState({
           boschTotal: companyTotal,
           boschByMonth: companySalaryByMonth
        });
      }
      if (name === 'JPMC') {
        this.setState({
          jpmcTotal: companyTotal,
          jpmcByMonth: companySalaryByMonth
        });
      }
    }
  }

  handleMonthlyIncomeExpenseSummary = (body) => {
     if (body == undefined || body.records == undefined) {
      return;
     }
     this.setState({
         monthlySummary: body.records
     });
  }

  showMonthDetailsModal = (event) => {
    fetchInvestmentsForMonthProto(event.target.getAttribute("id"))
        .then(recordsJson => {
            const monthDetailsRows = recordsJson.map( record => {
                return <tr>
                    <td style={{whiteSpace: 'wrap', textAlign: "Left" , fontSize: '.8rem'}}>{record.head}</td>
                    <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(record.contribution)}</td>
                    <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(record.valueAsOnMonth)}</td>
                 </tr>
            });
            this.setState({ monthDetailsRows: monthDetailsRows });
            this.setState({ monthDetailsModalShow: !this.state.monthDetailsModalShow });
        }
    );
  };

  hideMonthDetailsModal = () => {
    this.setState({ monthDetailsModalShow: !this.state.monthDetailsModalShow});
  };

  render() {
    const {
          total,
          subexTotal,
          subexByMonth,
          evolTotal,
          evolByMonth,
          wiproTotal,
          wiproByMonth,
          yodleeTotal,
          yodleeByMonth,
          boschTotal,
          boschByMonth,
          jpmcTotal,
          jpmcByMonth,
          taxByYear,
          monthlySummary,
          monthDetailsModalShow,
          monthDetailsRows
    } = this.state;

    function prepareSalaryRow(record) {
        return <tr>
           <td style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.8rem'}}>{formatYearMonth(record.year, record.month)}</td>
           <td style={{textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(record.amount)}</td>
         </tr>
    }

     // Prepare Monthly Salary Summary
     const yearlySummary = new Map();
     const monthlySummaryList = monthlySummary.map(record => {
          if (!yearlySummary.has(record.year)) {
              yearlySummary.set(record.year, {ctc: 0, incomeAmount: 0, investmentAmount: 0, investmentByCompany: 0, taxAmount: 0});
          }
          let yearRecord = yearlySummary.get(record.year);
          yearRecord.ctc = yearRecord.ctc + record.ctc;
          yearRecord.incomeAmount = yearRecord.incomeAmount + record.incomeAmount;
          yearRecord.investmentAmount = yearRecord.investmentAmount + record.investmentAmount;
          yearRecord.investmentByCompany = yearRecord.investmentByCompany + record.investmentByCompany;
          yearRecord.taxAmount = yearRecord.taxAmount + record.taxAmount;
          yearlySummary.set(record.year, yearRecord);

          var yearMonth = '' + record.year + '-' + (record.month < 10 ? '0' + record.month : record.month) ;
          return <tr key={yearMonth} onClick={this.showMonthDetailsModal}>
                   <td id={yearMonth} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.75rem'}}>{formatYearMonth(record.year, record.month)}</td>
                   <td id={yearMonth} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(record.ctc)}</td>
                   <td id={yearMonth} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(Math.round(record.incomeAmount))}</td>
                   <td id={yearMonth} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(record.investmentByCompany)}</td>
                   <td id={yearMonth} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(record.taxAmount)}</td>
               </tr>
      });

      const yearlySummaryList = [];
      yearlySummary.forEach((record, year) => {
        yearlySummaryList.push(<tr key={year} >
                    <td id={year} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.75rem'}}>{year}</td>
                    <td id={year} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(record.ctc)}</td>
                    <td id={year} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(Math.round(record.incomeAmount))}</td>
                    <td id={year} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(record.investmentByCompany)}</td>
                    <td id={year} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(record.taxAmount)}</td>
                </tr>)
      })

    // Prepare table rows for each company
    const jpmcRows = jpmcByMonth.map(record => prepareSalaryRow(record));
    const boschRows = boschByMonth.map(record => prepareSalaryRow(record));
    const yodleeRows = yodleeByMonth.map(record => prepareSalaryRow(record));
    const wiproRows = wiproByMonth.map(record => prepareSalaryRow(record));
    const evolRows = evolByMonth.map(record => prepareSalaryRow(record));
    const subexRows = subexByMonth.map(record => prepareSalaryRow(record));

    // Prepares Salary by Company
    let companySalaryChartDataText = '[' +
    '{ "head":"Subex" , "amount":' + subexTotal +'},' +
    '{ "head":"Evolving" , "amount":' + evolTotal +'},' +
    '{ "head":"Wipro" , "amount":' + wiproTotal +'},' +
    '{ "head":"Yodlee" , "amount":' + yodleeTotal +'},' +
    '{ "head":"Bosch" , "amount":' + boschTotal +'},' +
    '{ "head":"JPMC" , "amount":' + jpmcTotal +' } ]';
    const companySalaryChartDataObject = JSON.parse(companySalaryChartDataText);

    // Prepare Salary by Year
    function aggregateSalaryByMonth(companyMonthRecord, salaryByYearMap) {
      for (let monthRecord of companyMonthRecord) {
          let yearTotal = salaryByYearMap.get(monthRecord.year);
          if (yearTotal === undefined) {
             yearTotal = 0;
          }
          yearTotal = yearTotal + monthRecord.amount;
          salaryByYearMap.set(monthRecord.year, yearTotal)
      }
    }
    const salaryByYearMap = new Map();
    aggregateSalaryByMonth(subexByMonth, salaryByYearMap);
    aggregateSalaryByMonth(evolByMonth, salaryByYearMap);
    aggregateSalaryByMonth(wiproByMonth, salaryByYearMap);
    aggregateSalaryByMonth(yodleeByMonth, salaryByYearMap);
    aggregateSalaryByMonth(boschByMonth, salaryByYearMap);
    aggregateSalaryByMonth(jpmcByMonth, salaryByYearMap);

    function aggregateSalaryComponentsByYear(monthlySummary, ctcByYearMap, taxByYearMap, invByYearMap, invByCompanyYearMap) {
       for (let monthRecord of monthlySummary) {
          let yearTotal = ctcByYearMap.get(monthRecord.year);
          let taxYearTotal = taxByYearMap.get(monthRecord.year);
          let invYearTotal = invByYearMap.get(monthRecord.year);
          let invByCompanyYearTotal = invByCompanyYearMap.get(monthRecord.year);
          if (yearTotal === undefined) {
             yearTotal = 0;
          }
          if (taxYearTotal === undefined) {
             taxYearTotal = 0;
          }
          if (invYearTotal === undefined) {
             invYearTotal = 0;
          }
          if (invByCompanyYearTotal === undefined) {
             invByCompanyYearTotal = 0;
          }
          yearTotal = yearTotal + monthRecord.ctc;
          taxYearTotal = taxYearTotal + monthRecord.taxAmount;
          invYearTotal = invYearTotal + monthRecord.investmentAmount;
          invByCompanyYearTotal = invByCompanyYearTotal + monthRecord.investmentByCompany;
          ctcByYearMap.set(monthRecord.year, yearTotal);
          taxByYearMap.set(monthRecord.year, taxYearTotal);
          invByYearMap.set(monthRecord.year, invYearTotal);
          invByCompanyYearMap.set(monthRecord.year, invByCompanyYearTotal);
       }
    }
    const ctcByYearMap = new Map();
    const taxByYearMap = new Map();
    const invByYearMap = new Map();
    const invByCompanyYearMap = new Map();
    aggregateSalaryComponentsByYear(monthlySummary, ctcByYearMap, taxByYearMap, invByYearMap, invByCompanyYearMap);

    return (
         <div id="cards" align="center" >
                <Row>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Salary by Company">
                            <div>
                                <DrawPiChart data={companySalaryChartDataObject} total={total} divContainer="salary-by-company-pie-container" heads={['Subex', 'Evolving', 'Wipro', 'Yodlee', 'Bosch', 'JPMC']} />
                            </div>
                            <div align="left" style={{fontSize: '.6rem'}}>
                            <br/>
                            Notes: <br/>
                            1. Salary credited in bank, doesnt include tax and investment by company<br/>
                            </div>
                        </Card>
                    </Col>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Salary by Year">
                            <div>
                                <DrawSalaryBarChart
                                  inHandMap={salaryByYearMap}
                                  ctcMap={ctcByYearMap}
                                  taxMap={taxByYearMap}
                                  invMap={invByCompanyYearMap}
                                  domain={[0, 6500000]} c
                                  colorDomain={[500000,2500000]}
                                  numberOfYaxisTicks="13"
                                  divContainer="salary-by-year-bar-container"
                                />
                            </div>
                        </Card>
                    </Col>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Tax Paid Yearly">
                            <div>
                                <DrawBarChart dataMap={taxByYear} domain={[0, 1800000]} colorDomain={[1000000, 200000]} numberOfYaxisTicks="9" divContainer="tax-by-year-bar-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Monthly Salary Summary">
                            <div>
                              <Table striped bordered hover size="sm">
                                  <thead>
                                    <tr>
                                      <th width="20%" style={{textAlign: "center"}}>Month</th>
                                      <th width="20%" style={{textAlign: "center"}}>CTC</th>
                                      <th width="20%" style={{textAlign: "center"}}>Salary Credited</th>
                                      <th width="20%" style={{textAlign: "center"}}>Investment Received</th>
                                      <th width="20%" style={{textAlign: "center"}}>Tax Deposited</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {monthlySummaryList}
                                  </tbody>
                              </Table>
                              <Modal isOpen={monthDetailsModalShow} onClose={this.hideMonthDetailsModal} contentLabel="DailyRecords" modalClassName="custom-modal-style">
                                <ModalHeader toggle={this.hideMonthDetailsModal}>Salary Investment Contribution</ModalHeader>
                                <Table striped bordered hover>
                                   <thead >
                                     <tr>
                                       <th>Head</th>
                                       <th>Contribution</th>
                                       <th>Value As On Month</th>
                                     </tr>
                                   </thead>
                                   <tbody>
                                     {monthDetailsRows}
                                   </tbody>
                                 </Table>
                              </Modal>
                            </div>
                        <div align="left" style={{fontSize: '.6rem'}}>
                        Notes: <br/>
                        1. CTC = Cost To Company, calculation: salary credited + investment by company + tax deposited by company, doesnt include insurance and gratuity<br/>
                        2. Salary Credited = Salary received in bank <br/>
                        3. Investment Received = Investment deposited by company<br/>
                        4. Tax Deposited = Tax deposited by company<br/>
                        </div>
                        </Card>
                    </Col>
                    <Col m={3} s={3} l={3}>
                      <Card className="card-panel teal lighten-4" textClassName="black-text" title="Yearly Salary Summary">
                        <div>
                          <Table striped bordered hover size="sm">
                              <thead>
                                <tr>
                                  <th width="20%" style={{textAlign: "center"}}>Year</th>
                                  <th width="20%" style={{textAlign: "center"}}>CTC</th>
                                  <th width="20%" style={{textAlign: "center"}}>Salary credited</th>
                                  <th width="20%" style={{textAlign: "center"}}>Investment Received</th>
                                  <th width="20%" style={{textAlign: "center"}}>Tax Deposited</th>
                                </tr>
                              </thead>
                              <tbody>
                              {yearlySummaryList}
                              </tbody>
                          </Table>
                        </div>
                        <div align="left" style={{fontSize: '.6rem'}}>
                        Notes: <br/>
                        1. CTC = Cost To Company, calculation: salary credited + investment by company + tax deposited by company, doesnt include insurance and gratuity<br/>
                        2. Salary Credited = Salary received in bank <br/>
                        3. Investment Received = Investment deposited by company<br/>
                        4. Tax Deposited = Tax deposited by company<br/>
                        </div>
                      </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={2} s={2} l={2}>
                        <Card className="card teal lighten-4" textClassName="black-text" title="JP Morgan">
                           <Table striped bordered hover size="sm">
                                <thead>
                                  <tr>
                                    <th width="40%" style={{textAlign: "center"}}>Month</th>
                                    <th width="40%" style={{textAlign: "right"}}>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {jpmcRows}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                    <Col m={2} s={2} l={2}>
                        <Card className="card teal lighten-4" textClassName="black-text" title="BOSCH">
                           <Table striped bordered hover size="sm">
                                <thead>
                                  <tr>
                                    <th width="40%" style={{textAlign: "center"}}>Month</th>
                                    <th width="40%" style={{textAlign: "right"}}>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {boschRows}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                    <Col m={2} s={2} l={2}>
                        <Card className="card teal lighten-4" textClassName="black-text" title="Yodlee">
                           <Table striped bordered hover size="sm">
                                <thead>
                                  <tr>
                                    <th width="40%" style={{textAlign: "center"}}>Month</th>
                                    <th width="40%" style={{textAlign: "right"}}>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {yodleeRows}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                    <Col m={2} s={2} l={2}>
                        <Card className="card teal lighten-4" textClassName="black-text" title="Wipro">
                           <Table striped bordered hover size="sm">
                                <thead>
                                  <tr>
                                    <th width="40%" style={{textAlign: "center"}}>Month</th>
                                    <th width="40%" style={{textAlign: "right"}}>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {wiproRows}
                                </tbody>
                            </Table>
                        </Card>

                    </Col>
                    <Col m={2} s={2} l={2}>
                        <Card className="card teal lighten-4" textClassName="black-text" title="Evolving">
                           <Table striped bordered hover size="sm">
                                <thead>
                                  <tr>
                                    <th width="40%" style={{textAlign: "center"}}>Month</th>
                                    <th width="40%" style={{textAlign: "right"}}>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {evolRows}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                    <Col m={2} s={2} l={2}>
                        <Card className="card teal lighten-4" textClassName="black-text" title="Subex">
                           <Table striped bordered hover size="sm">
                                <thead>
                                  <tr>
                                    <th width="40%" style={{textAlign: "center"}}>Month</th>
                                    <th width="40%" style={{textAlign: "right"}}>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {subexRows}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
         </div>
    );
  }
}
export default Salary;
