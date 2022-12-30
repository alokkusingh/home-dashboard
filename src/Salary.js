import React, { Component } from 'react'
import { Container, Table, Row, Col } from 'reactstrap';
import { parseISO } from 'date-fns';
import { Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { formatYearMonth } from "./utils/FormatYearMonth";
import SalaryByCompanyPiChart from './charts/salaryByCompanyPiChart';
import SalaryByMonthBarChart from './charts/salaryByMonthBarChart';
import TaxByYearBarChart from './charts/taxByYearBarChart';

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
      taxByYear: [],
      monthlySummary: []
    };
  }

  async componentDidMount() {
    const responseSalaryByCompany = await fetch('/home/api/bank/salary/bycompany');
    const bodySalaryByCompany = await responseSalaryByCompany.json();
    this.setState({
        total: bodySalaryByCompany.total
    });

    for (let companyRecord of bodySalaryByCompany.companySalaries) {
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

    const responseTaxByYear = await fetch('/home/api/tax/all');
    const bodyResponseTaxByYear = await responseTaxByYear.json();
    this.setState({
        taxByYear: bodyResponseTaxByYear.taxes
    });

     const responseMonthlySummary = await fetch('/home/api/summary/monthly?sinceMonth=2021-04');
     const bodyMonthlySummary = await responseMonthlySummary.json();
     this.setState({
         monthlySummary: bodyMonthlySummary.records
     });
  }

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
          monthlySummary
    } = this.state;

    function prepareSalaryRow(record) {
        return <tr>
           <td style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.8rem'}}>{formatYearMonth(record.year, record.month)}</td>
           <td style={{textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(record.amount)}</td>
         </tr>
    }

    const title = "Salary";

    // Prepare Monthly Salary Summary
     const monthlySummaryList = monthlySummary.map(record => {
          return <tr key={'' + record.year + record.month} onClick={this.showModal}>
                   <td id={'' + record.year + record.month + 0} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.75rem'}}>{formatYearMonth(record.year, record.month)}</td>
                   <td id={'' + record.year + record.month + 1} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(record.ctc)}</td>
                   <td id={'' + record.year + record.month + 2} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(Math.round(record.incomeAmount))}</td>
                   <td id={'' + record.year + record.month + 2} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(record.ctc - Math.round(record.incomeAmount) - record.taxAmount)}</td>
                   <td id={'' + record.year + record.month + 3} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(record.taxAmount)}</td>
               </tr>
      });

    // Prepare table rows for each company
    const jpmcRows = jpmcByMonth.map(record => prepareSalaryRow(record));
    const boschRows = boschByMonth.map(record => prepareSalaryRow(record));
    const yodleeRows = yodleeByMonth.map(record => prepareSalaryRow(record));
    const wiproRows = wiproByMonth.map(record => prepareSalaryRow(record));
    const evolRows = evolByMonth.map(record => prepareSalaryRow(record));
    const subexRows = subexByMonth.map(record => prepareSalaryRow(record));

    // Prepares Salary by Company
    let companySalaryChartDataText = '[' +
    '{ "company":"Subex" , "amount":' + subexTotal +'},' +
    '{ "company":"Evolving" , "amount":' + evolTotal +'},' +
    '{ "company":"Wipro" , "amount":' + wiproTotal +'},' +
    '{ "company":"Yodlee" , "amount":' + yodleeTotal +'},' +
    '{ "company":"Bosch" , "amount":' + boschTotal +'},' +
    '{ "company":"JPMC" , "amount":' + jpmcTotal +' } ]';
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

    return (
         <div id="cards" align="center" >
                <Row>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text">
                            <div>
                                <SalaryByCompanyPiChart data={companySalaryChartDataObject} total={total} />
                            </div>
                        </Card>
                    </Col>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text">
                            <div>
                                <SalaryByMonthBarChart salaryByYearMap={salaryByYearMap} />
                            </div>
                        </Card>
                    </Col>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text">
                            <div>
                                <TaxByYearBarChart dataArr={taxByYear} />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Salary Summary Since April 2021">
                            <div>
                              <Table striped bordered hover size="sm">
                                  <thead>
                                    <tr>
                                      <th width="20%" style={{textAlign: "center"}}>Month</th>
                                      <th width="20%" style={{textAlign: "center"}}>CTC</th>
                                      <th width="20%" style={{textAlign: "center"}}>In Hand Received</th>
                                      <th width="20%" style={{textAlign: "center"}}>Investment Received</th>
                                      <th width="20%" style={{textAlign: "center"}}>Tax Paid</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {monthlySummaryList}
                                  </tbody>
                              </Table>
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
                        <Card className="card teal lighten-4" textClassName="black-text" title="Robert BOSCH">
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
                        <Card className="card teal lighten-4" textClassName="black-text" title="Envestnet Yodlee">
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
                        <Card className="card teal lighten-4" textClassName="black-text" title="Evolving Systems">
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
