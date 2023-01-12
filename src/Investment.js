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
      shareMonthlyInvestment: []
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
  }

  render() {
    const {
      totalMonthlyInvestment,
      pfMonthlyInvestment,
      npsMonthlyInvestment,
      licMonthlyInvestment,
      shareMonthlyInvestment
    } = this.state;

    console.table(pfMonthlyInvestment)

    return (
         <div id="cards" align="center" >
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
                                <DrawLineChartShare data={npsMonthlyInvestment} domain={[1000, 700000]} divContainer="NPS-investment-line-container" />
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
