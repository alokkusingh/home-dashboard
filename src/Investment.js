import React, { Component } from 'react'
import { Container, Table, Row, Col } from 'reactstrap';
import { parseISO } from 'date-fns';
import { Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { formatYearMonth } from "./utils/FormatYearMonth";
import InvestmentLineChart from './charts/investmentLineChart';
import InvestmentLineChartPF from './charts/investmentLineChartPF';
import InvestmentLineChartNPS from './charts/investmentLineChartNPS';
import InvestmentLineChartLIC from './charts/investmentLineChartLIC';
import InvestmentLineChartShare from './charts/investmentLineChartShare';

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
     const responseInvestments = await fetch('/home/api/investment/all');
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
                        <Card className="card-panel teal lighten-4" textClassName="black-text">
                            <div>
                                <InvestmentLineChart investmentType="total" data={totalMonthlyInvestment}  />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text">
                            <div>
                                <InvestmentLineChartPF investmentType="PF" data={pfMonthlyInvestment}  />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text">
                            <div>
                                <InvestmentLineChartNPS investmentType="NPS" data={npsMonthlyInvestment}  />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text">
                            <div>
                                <InvestmentLineChartLIC investmentType="LIC" data={licMonthlyInvestment}  />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text">
                            <div>
                                <InvestmentLineChartShare investmentType="Share" data={shareMonthlyInvestment}  />
                            </div>
                        </Card>
                    </Col>
                </Row>
         </div>
    );
  }
}
export default Investment;
