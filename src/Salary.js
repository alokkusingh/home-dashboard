import React, { Component } from 'react'
import { Table, Row, Col, Modal, ModalHeader } from 'reactstrap';
import { Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { formatYearMonth } from "./utils/FormatYearMonth";
import DrawPiChart from "./charts/drawPiChart";
import DrawBarChart from "./charts/drawBarChart";

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
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));

      var requestOptions = {
        method: 'GET',
        headers: myHeaders
      };

    const responseTaxByYear = await fetch('/home/api/tax/all', requestOptions);
    const bodyResponseTaxByYear = await responseTaxByYear.json();
    const taxByYearMap = new Map();
    bodyResponseTaxByYear.taxes.map(record => {
      taxByYearMap.set(record.financialYear, Math.abs(record.paidAmount));
    });
    this.setState({
        taxByYear: taxByYearMap
    });

    const responseSalaryByCompany = await fetch('/home/api/bank/salary/bycompany', requestOptions);
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

     const responseMonthlySummary = await fetch('/home/api/summary/monthly?sinceMonth=2021-04', requestOptions);
     const bodyMonthlySummary = await responseMonthlySummary.json();
     this.setState({
         monthlySummary: bodyMonthlySummary.records
     });
  }

  showMonthDetailsModal = (event) => {
    console.log("event: ", event.target.getAttribute("id"))

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };

    fetch("/home/api/investment/month/" + event.target.getAttribute("id"), requestOptions)
        .then(response => response.json())
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
     const monthlySummaryList = monthlySummary.map(record => {
          var yearMonth = '' + record.year + '-' + (record.month < 10 ? '0' + record.month : record.month) ;
          return <tr key={yearMonth} onClick={this.showMonthDetailsModal}>
                   <td id={yearMonth} style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.75rem'}}>{formatYearMonth(record.year, record.month)}</td>
                   <td id={yearMonth} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(record.ctc)}</td>
                   <td id={yearMonth} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(Math.round(record.incomeAmount))}</td>
                   <td id={yearMonth} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(record.ctc - Math.round(record.incomeAmount) - record.taxAmount)}</td>
                   <td id={yearMonth} style={{textAlign: "right", fontSize: '.75rem'}}>{NumberFormatNoDecimal(record.taxAmount)}</td>
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

    return (
         <div id="cards" align="center" >
                <Row>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Salary by Company">
                            <div>
                                <DrawPiChart data={companySalaryChartDataObject} total={total} divContainer="salary-by-company-pie-container" heads={['Subex', 'Evolving', 'Wipro', 'Yodlee', 'Bosch', 'JPMC']} />
                            </div>
                        </Card>
                    </Col>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Salary by Year (in bank)">
                            <div>
                                <DrawBarChart dataMap={salaryByYearMap} domain={[0, 3500000]} colorDomain={[500000,2500000]} numberOfYaxisTicks="7" divContainer="salary-by-year-bar-container" />
                            </div>
                        </Card>
                    </Col>
                    <Col m={3} s={3} l={3}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Tax Paid Yearly">
                            <div>
                                <DrawBarChart dataMap={taxByYear} domain={[0, 1400000]} colorDomain={[1000000, 200000]} numberOfYaxisTicks="10" divContainer="tax-by-year-bar-container" />
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
                              <Modal isOpen={monthDetailsModalShow} onClose={this.hideMonthDetailsModal} contentLabel="DailyRecords">
                                <ModalHeader toggle={this.hideMonthDetailsModal}/>
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
