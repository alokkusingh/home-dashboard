import React, { Component } from 'react'
import { Table, Row, Col, Modal, ModalHeader } from 'reactstrap';
import { Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { NumberFormatNoCurrency } from "./utils/NumberFormatNoCurrency";
import { NumberFormatNoCurrencyFraction2 } from "./utils/NumberFormatNoCurrencyFraction2";
import DrawLineChartShare from './charts/drawLineChart';
import {fetchInvestmentReturnsProto, fetchInvestmentSummaryProto, fetchInvestmentsForHeadProto} from './api/InvestmentAPIManager.js'
import "./css/modal.css"

class Investment extends Component {

  constructor() {
    super();
    this.state = {
      today: new Date(),
      totalMonthlyInvestment: [],
      pfMonthlyInvestment: [],
      npsMonthlyInvestment: [],
      licMonthlyInvestment: [],
      shareMonthlyInvestment: [],
      mfMonthlyInvestment: [],
      investmentReturnList: [],
      investmentSummaryRecords: [],
      investmentHeadRecordsRows: []
    };
  }

  async componentDidMount() {

    await Promise.all([
      fetchInvestmentSummaryProto().then(this.handleInvestmentsSummary),
      fetchInvestmentReturnsProto().then(this.handleInvestmentReturns),
    ]);
    // All fetch calls are done now
    console.log(this.state);
 }

  handleInvestmentsSummary = (investments) => {
      const investmentSummaryRecords = [];
       for (var head in investments.investmentsByType) {
          investmentSummaryRecords.push({
              "head": head,
              "investmentAmount": investments.investmentsByType[head],
              "investmentValue": investments.investmentsValueByType[head]
          }
        );
       }
       investmentSummaryRecords.push(
         {
             "head": 'Total',
             "investmentAmount": investments.investmentAmount,
             "investmentValue": investments.asOnValue
         }
       );

       const totalMonthlyInvestment = [];
       const pfMonthlyInvestment = [];
       const licMonthlyInvestment = [];
       const npsMonthlyInvestment = [];
       const shareMonthlyInvestment = [];
       const mfMonthlyInvestment = [];

       for (let monthInvestment of investments.monthInvestments) {
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

          if (investment.head === 'MF') {
            mfMonthlyInvestment.push({
                'yearMonth': yearMonth,
                'investmentAmount': investment.investmentAmount,
                'asOnInvestment': investment.asOnInvestment,
                'asOnValue': investment.asOnValue
            });
          }
        }
      }

      this.setState({
         totalMonthlyInvestment: totalMonthlyInvestment,
         pfMonthlyInvestment: pfMonthlyInvestment,
         licMonthlyInvestment: licMonthlyInvestment,
         npsMonthlyInvestment: npsMonthlyInvestment,
         shareMonthlyInvestment: shareMonthlyInvestment,
         mfMonthlyInvestment: mfMonthlyInvestment,
         investmentSummaryRecords: investmentSummaryRecords
      });
  };

  handleInvestmentReturns = (investmentReturnList) => {
    this.setState({
       investmentReturnList: investmentReturnList
    });
  };

  notFutureMonth = (year, month) => {
    const {today} = this.state;
    if (year > today.getFullYear()) {
      return false;
    }

    if (year == today.getFullYear() && month > today.getMonth() + 1) {
      return false;
    }
    return true;
  };

  showInvestmentHeadRecordsModal = (event) => {
    console.log(event);

    fetchInvestmentsForHeadProto(event.target.getAttribute("id"))
      .then(investments => {
          var prevMonthClosing = 0;
          const investmentHeadRecordsRows = investments.reverse().map( record => {
            if (this.notFutureMonth(record.yearx, record.monthx)) {
               var monthReturn = (record.valueAsOnMonth - (prevMonthClosing + record.contribution));
               var returnPercentage = monthReturn * 100 / (prevMonthClosing + record.contribution);
               var row =  <tr>
                   <td style={{whiteSpace: 'wrap', textAlign: "center" , fontSize: '.8rem'}}>{record.head}</td>
                   <td style={{whiteSpace: 'wrap', textAlign: "center" , fontSize: '.8rem'}}>{record.yearx}</td>
                   <td style={{whiteSpace: 'wrap', textAlign: "center" , fontSize: '.8rem'}}>{Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(1, record.monthx - 1, record.yearx).setMonth(record.monthx - 1))}</td>
                   <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoCurrency(record.contribution)}</td>
                   <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoCurrency(record.contributionAsOnMonth)}</td>
                   <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoCurrency(record.valueAsOnMonth)}</td>
                   <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoCurrency(monthReturn)}</td>
                   <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoCurrencyFraction2(returnPercentage)}</td>
                </tr>;

              prevMonthClosing = record.valueAsOnMonth;
              return row;
            }
          });

          this.setState({ investmentHeadRecordsRows: investmentHeadRecordsRows.reverse() });
          this.setState({ monthDetailsModalShow: !this.state.monthDetailsModalShow });
      });
  };

  hideInvestmentheadRecordsModal = () => {
    this.setState({ monthDetailsModalShow: !this.state.monthDetailsModalShow});
  };

  render() {
    const {
      totalMonthlyInvestment,
      pfMonthlyInvestment,
      npsMonthlyInvestment,
      licMonthlyInvestment,
      shareMonthlyInvestment,
      mfMonthlyInvestment,
      investmentReturnList,
      investmentSummaryRecords,
      investmentHeadRecordsRows,
      monthDetailsModalShow
    } = this.state;

    const investmentSummaryRecordRows = investmentSummaryRecords.map(
      investment => {
         return <tr key={investment.head} onClick={this.showInvestmentHeadRecordsModal}>
                 <td id={investment.head} style={{textAlign: "center", fontSize: '.8rem'}}>{investment.head}</td>
                 <td id={investment.head} style={{textAlign: "right", fontSize: '.8rem', backgroundColor: "lightblue"}}>{NumberFormatNoCurrency(investment.investmentAmount)}</td>
                 <td id={investment.head} style={{textAlign: "right", fontSize: '.8rem', backgroundColor: "lightblue"}}>{NumberFormatNoCurrency(investment.investmentValue)}</td>
                 <td id={investment.head} style={{textAlign: "right", fontSize: '.8rem', backgroundColor: "lightblue"}}>{NumberFormatNoCurrency(investment.investmentValue - investment.investmentAmount)}</td>
                 <td id={investment.head} style={{textAlign: "right", fontSize: '.8rem', backgroundColor: "lightblue"}}>{NumberFormatNoCurrencyFraction2((investment.investmentValue - investment.investmentAmount) * 100 / investment.investmentAmount)}</td>
                </tr>
      }
    );

    const returnOnInvestmentRows = investmentReturnList.map(
      investment => {
          if (investment.metric != "Cumulative Return (%)" && investment.metric != "Average Return (%)") {
          return <tr key={investment.metric} >
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.metric}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps === null || investment.nps === undefined? 0:investment.nps.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps === null || investment.nps === undefined? 0:investment.nps.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps === null || investment.nps === undefined? 0:NumberFormatNoCurrencyFraction2(investment.nps.ror)}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.mf === null || investment.mf === undefined? 0:investment.mf.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.mf === null || investment.mf === undefined? 0:investment.mf.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.mf === null || investment.mf === undefined? 0:NumberFormatNoCurrencyFraction2(investment.mf.ror)}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share === null || investment.share === undefined? 0:investment.share.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share === null || investment.share === undefined? 0:investment.share.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share === null || investment.share === undefined? 0:NumberFormatNoCurrencyFraction2(investment.share.ror)}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.pf === null || investment.pf === undefined? 0:investment.pf.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.pf === null || investment.pf === undefined? 0:investment.pf.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.pf === null || investment.pf === undefined? 0:NumberFormatNoCurrencyFraction2(investment.pf.ror)}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.lic === null || investment.lic === undefined? 0:investment.lic.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.lic === null || investment.lic === undefined? 0:investment.lic.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.lic === null || investment.lic === undefined? 0:NumberFormatNoCurrencyFraction2(investment.lic.ror)}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.total === null || investment.total === undefined? 0:investment.total.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.total === null || investment.total === undefined? 0:investment.total.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.total === null || investment.total === undefined? 0: investment.total.end - investment.total.beg - investment.total.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.total === null || investment.total === undefined? 0:NumberFormatNoCurrencyFraction2(investment.total.ror)}</td>
          </tr>
         }
      }
    );

    return (
         <div id="cards" align="center" >
            <Row>
              <Col m={6} s={6} l={6}>
                <Card className="teal lighten-4" textClassName="black-text" title="Investment Summary">
                   <div>
                   <Table striped bordered hover size="sm">
                       <thead>
                        <tr>
                           <th width="10%" style={{textAlign: "center"}}>Head</th>
                           <th width="20%" style={{textAlign: "center"}}>Amount</th>
                           <th width="20%" style={{textAlign: "center"}}>Value</th>
                           <th width="20%" style={{textAlign: "center"}}>Return</th>
                           <th width="10%" style={{textAlign: "center"}}>Ret (%)</th>
                        </tr>
                       </thead>
                       <tbody>
                          {investmentSummaryRecordRows}
                       </tbody>
                   </Table>
                   <Modal isOpen={monthDetailsModalShow} onClose={this.hideInvestmentheadRecordsModal} modalClassName="custom-modal-style">
                     <ModalHeader toggle={this.hideInvestmentheadRecordsModal}>Monthly Investment Transaction Records</ModalHeader>
                     <Table striped bordered hover>
                        <thead >
                          <tr>
                            <th style={{textAlign: "center"}}>Head</th>
                            <th style={{textAlign: "center"}}>YYYY</th>
                            <th style={{textAlign: "center"}}>MON</th>
                            <th style={{textAlign: "center"}}>Invested</th>
                            <th style={{textAlign: "center"}}>Sub Total</th>
                            <th style={{textAlign: "center"}}>Current Value</th>
                            <th style={{textAlign: "center"}}>Month Return</th>
                            <th style={{textAlign: "center"}}>Ret %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {investmentHeadRecordsRows}
                        </tbody>
                      </Table>
                   </Modal>
                   </div>
                 </Card>
               </Col>
            </Row>
            <Row>
              <Col m={6} s={6} l={6}>
               <Card className="teal lighten-4" textClassName="black-text" title="Investment Returns">
                   <div>
                   <Table striped bordered hover size="sm">
                       <thead>
                         <tr>
                           <th rowspan="2" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Head</th>
                           <th colspan="3" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>NPS</th>
                           <th colspan="3" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>MF</th>
                           <th colspan="3" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Share</th>
                           <th colspan="3" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>PF</th>
                           <th colspan="3" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>LIC</th>
                           <th colspan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Total</th>
                         </tr>
                        <tr>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Value</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Value</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Value</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Value</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Value</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Value</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Return</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Ret (%)</th>
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
                                <DrawLineChartShare data={totalMonthlyInvestment} domain={[1000000, 8500000]} divContainer="total-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year PF Investment">
                            <div>
                                <DrawLineChartShare data={pfMonthlyInvestment} domain={[0, 5000000]} divContainer="PF-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year NPS Investment">
                            <div>
                                <DrawLineChartShare data={npsMonthlyInvestment} domain={[130000, 1800000]} divContainer="NPS-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year Mutual Fund Investment">
                            <div>
                                <DrawLineChartShare data={mfMonthlyInvestment} domain={[100000, 1100000]} divContainer="MF-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year Share Investment">
                            <div>
                                <DrawLineChartShare data={shareMonthlyInvestment} domain={[1000, 100000]} divContainer="Share-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year LIC Investment">
                            <div>
                                <DrawLineChartShare data={licMonthlyInvestment} domain={[300000, 800000]} divContainer="LIC-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
         </div>
    );
  }
}
export default Investment;
