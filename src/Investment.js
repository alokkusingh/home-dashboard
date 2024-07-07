import React, { Component } from 'react'
import { Table, Row, Col, Modal, ModalHeader } from 'reactstrap';
import { Card} from 'react-materialize';
import { NumberFormatNoDecimal } from "./utils/NumberFormatNoDecimal";
import { NumberFormatNoCurrency } from "./utils/NumberFormatNoCurrency";
import { NumberFormatNoCurrencyFraction2 } from "./utils/NumberFormatNoCurrencyFraction2";
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
      mfMonthlyInvestment: [],
      investmentReturnList: [],
      investmentSummaryRecords: [],
      investmentHeadRecordsRows: []
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

     const investmentSummaryRecords = [];
     for (var head in bodyInvestments.investmentsByType) {
      investmentSummaryRecords.push(
        {
            "head": head,
            "investmentAmount": bodyInvestments.investmentsByType[head],
            "investmentValue": bodyInvestments.investmentsValueByType[head]
        }
      );
     }
     investmentSummaryRecords.push(
       {
           "head": 'Total',
           "investmentAmount": bodyInvestments.investmentAmount,
           "investmentValue": bodyInvestments.asOnValue
       }
     );

     const totalMonthlyInvestment = [];
     const pfMonthlyInvestment = [];
     const licMonthlyInvestment = [];
     const npsMonthlyInvestment = [];
     const shareMonthlyInvestment = [];
     const mfMonthlyInvestment = [];

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

        if (investment.head === 'MF') {
          mfMonthlyInvestment.push({
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
         shareMonthlyInvestment: shareMonthlyInvestment,
         mfMonthlyInvestment: mfMonthlyInvestment,
         investmentSummaryRecords: investmentSummaryRecords
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

  showInvestmentheadRecordsModal = (event) => {
    console.log(event);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };

    fetch("/home/api/investment/head/" + event.target.getAttribute("id"), requestOptions)
        .then(response => response.json())
        .then(recordsJson => {
            const investmentHeadRecordsRows = recordsJson.map( record => {
                return <tr>
                    <td style={{whiteSpace: 'wrap', textAlign: "center" , fontSize: '.8rem'}}>{record.head}</td>
                    <td style={{whiteSpace: 'wrap', textAlign: "center" , fontSize: '.8rem'}}>{record.yearx}</td>
                    <td style={{whiteSpace: 'wrap', textAlign: "center" , fontSize: '.8rem'}}>{Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(1, record.monthx - 1, record.yearx).setMonth(record.monthx - 1))}</td>
                    <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(record.contribution)}</td>
                    <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(record.contributionAsOnMonth)}</td>
                    <td style={{whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem'}}>{NumberFormatNoDecimal(record.valueAsOnMonth)}</td>
                 </tr>
            });
            this.setState({ investmentHeadRecordsRows: investmentHeadRecordsRows });
            this.setState({ monthDetailsModalShow: !this.state.monthDetailsModalShow });
        }
    );
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
         return <tr key={investment.head} onClick={this.showInvestmentheadRecordsModal}>
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
          return <tr key={investment.metric} >
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.metric}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.pf === null? 0:investment.pf.beg}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.pf === null? 0:investment.pf.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.pf === null? 0:investment.pf.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.pf === null? 0:NumberFormatNoCurrencyFraction2(investment.pf.ror)}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps === null? 0:investment.nps.beg}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps === null? 0:investment.nps.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps === null? 0:investment.nps.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps === null? 0:NumberFormatNoCurrencyFraction2(investment.nps.ror)}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.lic === null? 0:investment.lic.beg}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.lic === null? 0:investment.lic.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.lic === null? 0:investment.lic.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.lic === null? 0:NumberFormatNoCurrencyFraction2(investment.lic.ror)}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share === null? 0:investment.share.beg}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share === null? 0:investment.share.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share === null? 0:investment.share.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share === null? 0:NumberFormatNoCurrencyFraction2(investment.share.ror)}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.mf === null? 0:investment.mf.beg}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.mf === null? 0:investment.mf.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.mf === null? 0:investment.mf.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.mf === null? 0:NumberFormatNoCurrencyFraction2(investment.mf.ror)}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.total === null? 0:investment.total.beg}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.total === null? 0:investment.total.end}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.total === null? 0:investment.total.inv}</td>
              <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.total === null? 0:NumberFormatNoCurrencyFraction2(investment.total.ror)}</td>
          </tr>
      }
    );

//console.log("returnOnInvestmentRows: " + returnOnInvestmentRows);

    return (
         <div id="cards" align="center" >
            <Row>
              <Col m={6} s={6} l={6}>
                <Card className="teal lighten-4" textClassName="black-text" title="Investment Summary">
                   <div>
                   <Table className="mt-4" hover bordered>
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
                   <Modal isOpen={monthDetailsModalShow} onClose={this.hideInvestmentheadRecordsModal} contentLabel="HeadRecords">
                     <ModalHeader toggle={this.hideInvestmentheadRecordsModal}/>
                     <Table striped bordered hover>
                        <thead >
                          <tr>
                            <th style={{textAlign: "center"}}>Head</th>
                            <th style={{textAlign: "center"}}>Year</th>
                            <th style={{textAlign: "center"}}>Month</th>
                            <th style={{textAlign: "center"}}>Contribution</th>
                            <th style={{textAlign: "center"}}>Sub Total</th>
                            <th style={{textAlign: "center"}}>Current Value</th>
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
                   <Table className="mt-4" hover bordered>
                       <thead>
                         <tr>
                           <th rowspan="2" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Head</th>
                           <th colspan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>PF</th>
                           <th colspan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>NPS</th>
                           <th colspan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>LIC</th>
                           <th colspan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Share</th>
                           <th colspan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>MF</th>
                           <th colspan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Total</th>
                         </tr>
                        <tr>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Beg</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>End</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Beg</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>End</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Beg</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>End</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Beg</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>End</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Ret (%)</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Beg</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>End</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Inv</th>
                          <th width="6%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Ret (%)</th>
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
                                <DrawLineChartShare data={totalMonthlyInvestment} domain={[1000000, 6500000]} divContainer="total-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year PF Investment">
                            <div>
                                <DrawLineChartShare data={pfMonthlyInvestment} domain={[700000, 4000000]} divContainer="PF-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year NPS Investment">
                            <div>
                                <DrawLineChartShare data={npsMonthlyInvestment} domain={[50000, 1400000]} divContainer="NPS-investment-line-container" />
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
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year Share Investment">
                            <div>
                                <DrawLineChartShare data={shareMonthlyInvestment} domain={[0, 100000]} divContainer="Share-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col m={12} s={12} l={12}>
                        <Card className="card-panel teal lighten-4" textClassName="black-text" title="Last 5 Year Mutual Fund Investment">
                            <div>
                                <DrawLineChartShare data={mfMonthlyInvestment} domain={[0, 500000]} divContainer="MF-investment-line-container" />
                            </div>
                        </Card>
                    </Col>
                </Row>
         </div>
    );
  }
}
export default Investment;
