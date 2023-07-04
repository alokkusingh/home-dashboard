import React, { Component } from 'react'
import { Container, Table, Row, Col } from 'reactstrap';
import { Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { formatYearMonth } from "./utils/FormatYearMonth";
import DrawLineChartShare from './charts/drawLineChart';

class Investment extends Component {

  constructor() {
    super();
    this.state = {
      totalMonthlyInvestment: [],
      pfMonthlyInvestment: [],
      npsMonthlyInvestment: [],
      licMonthlyInvestment: [],
      shareMonthlyInvestment: [],
      investmentReturnList: []
    };
  }

  async componentDidMount() {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };
     const responseInvestments = await fetch('/home/api/investment/all', requestOptions);
     const bodyInvestments = await responseInvestments.json();

     const totalMonthlyInvestment = [];
     const pfMonthlyInvestment = [];
     const licMonthlyInvestment = [];
     const npsMonthlyInvestment = [];
     const shareMonthlyInvestment = [];

    for (let monthInvestment of bodyInvestments.monthInvestments) {
      let yearMonth = monthInvestment.yearMonth;

      totalMonthlyInvestment.push({
          'yearMonth': yearMonth,
          'investmentAmount': monthInvestment.investmentAmount,
          'asOnInvestment': monthInvestment.asOnInvestment,
          'asOnValue': monthInvestment.asOnValue
      });

      for (let investment of monthInvestment.investments) {
        if (investment.head === 'PF') {
          pfMonthlyInvestment.push({
              'yearMonth': yearMonth,
              'investmentAmount': investment.investmentAmount,
              'asOnInvestment': investment.asOnInvestment,
              'asOnValue': investment.asOnValue
          });
        }

        if (investment.head === 'LIC') {
          licMonthlyInvestment.push({
              'yearMonth': yearMonth,
              'investmentAmount': investment.investmentAmount,
              'asOnInvestment': investment.asOnInvestment,
              'asOnValue': investment.asOnValue
          });
        }

        if (investment.head === 'NPS') {
          npsMonthlyInvestment.push({
              'yearMonth': yearMonth,
              'investmentAmount': investment.investmentAmount,
              'asOnInvestment': investment.asOnInvestment,
              'asOnValue': investment.asOnValue
          });
        }

        if (investment.head === 'SHARE') {
          shareMonthlyInvestment.push({
              'yearMonth': yearMonth,
              'investmentAmount': investment.investmentAmount,
              'asOnInvestment': investment.asOnInvestment,
              'asOnValue': investment.asOnValue
          });
        }

      }

      this.setState({
         totalMonthlyInvestment: totalMonthlyInvestment,
         pfMonthlyInvestment: pfMonthlyInvestment,
         licMonthlyInvestment: licMonthlyInvestment,
         npsMonthlyInvestment: npsMonthlyInvestment,
         shareMonthlyInvestment: shareMonthlyInvestment
      });
    }

    const responseInvestmentsReturn = await fetch('/home/api/investment/return', requestOptions);
    const bodyInvestmentsReturn = await responseInvestmentsReturn.json();
    console.log(bodyInvestmentsReturn);
    const investmentReturnList = bodyInvestmentsReturn.investmentsRorMetrics;

    this.setState({
             investmentReturnList: investmentReturnList
          });
  }

  render() {
    const {
      totalMonthlyInvestment,
      pfMonthlyInvestment,
      npsMonthlyInvestment,
      licMonthlyInvestment,
      shareMonthlyInvestment,
      investmentReturnList
    } = this.state;


    const investmentReturnListMock = [
      {
      "metric": "Cumulative Return (%)",
      "pf": {"beg": "2500000", "end": "3500000", "inv": "200000", "ror":"11"},
      "nps": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "lic": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "share": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "total": {"beg": "1", "end": "2", "inv": "3", "ror":"4"}
      },
      {
      "metric": "Average Return (%)",
      "pf": {"beg": "2500000", "end": "3500000", "inv": "200000", "ror":"11"},
      "nps": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "lic": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "share": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "total": {"beg": "1", "end": "2", "inv": "3", "ror":"4"}
      },
      {
      "metric": "RoR - 2023",
      "pf": {"beg": "2500000", "end": "3500000", "inv": "200000", "ror":"11"},
      "nps": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "lic": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "share": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "total": {"beg": "1", "end": "2", "inv": "3", "ror":"4"}
      },
      {
      "metric": "RoR - 2022",
      "pf": {"beg": "2500000", "end": "3500000", "inv": "200000", "ror":"11"},
      "nps": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "lic": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "share": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "total": {"beg": "1", "end": "2", "inv": "3", "ror":"4"}
      },
      {
      "metric": "RoR - 2021",
      "pf": {"beg": "2500000", "end": "3500000", "inv": "200000", "ror":"11"},
      "nps": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "lic": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "share": {"beg": "1", "end": "2", "inv": "3", "ror":"4"},
      "total": {"beg": "1", "end": "2", "inv": "3", "ror":"4"}
      }
    ]
    const returnOnInvestmentRows = investmentReturnList.map(
      investment => {
          return <tr key={investment.metric} >
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.metric}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.pf === null? 0:investment.pf.beg}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.pf === null? 0:investment.pf.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.pf === null? 0:investment.pf.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.pf === null? 0:investment.pf.ror}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps === null? 0:investment.nps.beg}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps === null? 0:investment.nps.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps === null? 0:investment.nps.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps === null? 0:investment.nps.ror}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.lic === null? 0:investment.lic.beg}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.lic === null? 0:investment.lic.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.lic === null? 0:investment.lic.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.lic === null? 0:investment.lic.ror}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share === null? 0:investment.share.beg}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share === null? 0:investment.share.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share === null? 0:investment.share.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share === null? 0:investment.share.ror}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.total === null? 0:investment.total.beg}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.total === null? 0:investment.total.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.total === null? 0:investment.total.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.total === null? 0:investment.total.ror}</td>
          </tr>
      }
    );

console.log("returnOnInvestmentRows: " + returnOnInvestmentRows);

    return (
         <div id="cards" align="center" >
             <Row>
              <Col m={6} s={6} l={6}>
               <Card className="teal lighten-4" textClassName="black-text" title="Investment Returns">
                   <div>
                   <Table className="mt-4" hover bordered>
                       <thead>
                         <tr>
                           <th rowspan="2" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Head</th>
                           <th colspan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>PF</th>
                           <th colspan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>NPS</th>
                           <th colspan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>LIC</th>
                           <th colspan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Share</th>
                           <th colspan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Total</th>
                         </tr>
                        <tr>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Beg</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>End</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Beg</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>End</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Beg</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>End</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Beg</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>End</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Beg</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>End</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Ret (%)</th>
                        </tr>
                       </thead>
                       <tbody>
                       {returnOnInvestmentRows}
                       </tbody>
                   </Table>
                   </div>
                   </Card>
                  </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Years Investment">
                            <div>
                                <DrawLineChartShare data={totalMonthlyInvestment} domain={[800000, 4000000]} divContainer="total-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year PF Investment">
                            <div>
                                <DrawLineChartShare data={pfMonthlyInvestment} domain={[500000, 2800000]} divContainer="PF-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year NPS Investment">
                            <div>
                                <DrawLineChartShare data={npsMonthlyInvestment} domain={[1000, 900000]} divContainer="NPS-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year LIC Investment">
                            <div>
                                <DrawLineChartShare data={licMonthlyInvestment} domain={[200000, 700000]} divContainer="LIC-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year Share Investment">
                            <div>
                                <DrawLineChartShare data={shareMonthlyInvestment} domain={[0, 5000]} divContainer="Share-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
         </div>
    );
  }
}
export default Investment;
