import React, { Component } from 'react'
import { Table, Row, Col, Modal, ModalHeader } from 'reactstrap';
import { Card } from 'react-materialize';
import { NumberFormatNoCurrency } from "./utils/NumberFormatUtil";
import { NumberFormatNoCurrencyFraction2 } from "./utils/NumberFormatUtil";
import DrawLineChartShare from './charts/drawLineChart';
import {
    fetchInvestmentReturnsProto,
    fetchInvestmentSummaryProto,
    fetchInvestmentsForHeadProto,
    fetchInvestmentsForHeadJson
} from './api/InvestmentAPIManager.js'
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
            investmentHeadRecordsRows: [],
            monthDetailsModalShow: false // Explicitly initialized to prevent structural component warnings
        };
    }

    async componentDidMount() {
        try {
            await Promise.all([
                fetchInvestmentSummaryProto().then(this.handleInvestmentsSummary),
                fetchInvestmentReturnsProto().then(this.handleInvestmentReturns),
            ]);
            console.log("Dashboard State Initialized Successfully:", this.state);
        } catch (error) {
            console.error("Failed to load operational state metrics:", error);
        }
    }

    handleInvestmentsSummary = (investments) => {
        if (!investments) return;

        const investmentSummaryRecords = [];
        for (var head in investments.investmentsByType) {
            investmentSummaryRecords.push({
                "head": head,
                "investmentAmount": investments.investmentsByType[head],
                "investmentValue": investments.investmentsValueByType[head]
            });
        }

        investmentSummaryRecords.push({
            "head": 'Total',
            "investmentAmount": investments.investmentAmount,
            "investmentValue": investments.asOnValue
        });

        const totalMonthlyInvestment = [];
        const pfMonthlyInvestment = [];
        const licMonthlyInvestment = [];
        const npsMonthlyInvestment = [];
        const shareMonthlyInvestment = [];
        const mfMonthlyInvestment = [];

        if (investments.monthInvestments) {
            for (let monthInvestment of investments.monthInvestments) {
                let yearMonth = monthInvestment.yearMonth;
                let baseRecord = {
                    'yearMonth': yearMonth,
                    'investmentAmount': monthInvestment.investmentAmount,
                    'asOnInvestment': monthInvestment.asOnInvestment,
                    'asOnValue': monthInvestment.asOnValue
                };

                totalMonthlyInvestment.push(baseRecord);

                if (monthInvestment.investments) {
                    for (let investment of monthInvestment.investments) {
                        let mappedRecord = {
                            'yearMonth': yearMonth,
                            'investmentAmount': investment.investmentAmount,
                            'asOnInvestment': investment.asOnInvestment,
                            'asOnValue': investment.asOnValue
                        };

                        if (investment.head === 'PF') pfMonthlyInvestment.push(mappedRecord);
                        if (investment.head === 'LIC') licMonthlyInvestment.push(mappedRecord);
                        if (investment.head === 'NPS') npsMonthlyInvestment.push(mappedRecord);
                        if (investment.head === 'SHARE') shareMonthlyInvestment.push(mappedRecord);
                        if (investment.head === 'MF') mfMonthlyInvestment.push(mappedRecord);
                    }
                }
            }
        }

        this.setState({
            totalMonthlyInvestment,
            pfMonthlyInvestment,
            licMonthlyInvestment,
            npsMonthlyInvestment,
            shareMonthlyInvestment,
            mfMonthlyInvestment,
            investmentSummaryRecords
        });
    };

    handleInvestmentReturns = (investmentReturnList) => {
        this.setState({ investmentReturnList });
    };

    notFutureMonth = (year, month) => {
        const { today } = this.state;
        if (year > today.getFullYear()) return false;
        if (year === today.getFullYear() && month > today.getMonth() + 1) return false;
        return true;
    };

    showInvestmentHeadRecordsModal = (event) => {
        // CurrentTarget guarantees resolving the parent row/cell binding id even if clicking inner text nodes
        const headId = event.currentTarget.getAttribute("data-id");
        if (!headId) return;

        fetchInvestmentsForHeadJson(headId)
            .then(investments => {
                if (!investments) return;

                // 1. Defensively clone and sort chronologically (oldest to newest) for cumulative calculation accuracy
                const sortedInvestments = [...investments].sort((a, b) => {
                    if (a.yearx !== b.yearx) return a.yearx - b.yearx;
                    return a.monthx - b.monthx;
                });

                var prevMonthClosing = 0;
                const mappedRows = [];

                // 2. Loop chronologically
                sortedInvestments.forEach((record, index) => {
                    if (this.notFutureMonth(record.yearx, record.monthx)) {
                        var totalCostBasis = prevMonthClosing + record.contribution;
                        var monthReturn = record.valueAsOnMonth - totalCostBasis;
                        var returnPercentage = totalCostBasis > 0 ? (monthReturn * 100) / totalCostBasis : 0;

                        // Optional enhancement: add text color formatting variables here based on net yield
                        var returnStyleColor = monthReturn >= 0 ? "#16a34a" : "#e53e3e";

                        var monthName = Intl.DateTimeFormat('en', { month: 'short' }).format(
                            new Date(record.yearx, record.monthx - 1, 1)
                        );

                        mappedRows.push(
                            <tr key={`${record.head}-${record.yearx}-${record.monthx}`}>
                                <td style={{ whiteSpace: 'wrap', textAlign: "center", fontSize: '.8rem' }}>{record.head}</td>
                                <td style={{ whiteSpace: 'wrap', textAlign: "center", fontSize: '.8rem' }}>{record.yearx}</td>
                                <td style={{ whiteSpace: 'wrap', textAlign: "center", fontSize: '.8rem' }}>{monthName}</td>
                                <td style={{ whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem' }}>{NumberFormatNoCurrency(record.contribution)}</td>
                                <td style={{ whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem' }}>{NumberFormatNoCurrency(record.contributionAsOnMonth)}</td>
                                <td style={{ whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem' }}>{NumberFormatNoCurrency(record.valueAsOnMonth)}</td>
                                <td style={{ whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem', color: returnStyleColor, fontWeight: '500' }}>
                                    {NumberFormatNoCurrency(monthReturn)}
                                </td>
                                <td style={{ whiteSpace: 'nowrap', textAlign: "right", fontSize: '.8rem', color: returnStyleColor, fontWeight: '500' }}>
                                    {NumberFormatNoCurrencyFraction2(returnPercentage)}
                                </td>
                            </tr>
                        );

                        // Correctly advance running cursor pointer
                        prevMonthClosing = record.valueAsOnMonth;
                    }
                });

                // 3. Reverse rows here so that the UI correctly populates the newest data rows first
                this.setState({
                    investmentHeadRecordsRows: mappedRows.reverse(),
                    monthDetailsModalShow: true
                });
            })
            .catch(err => console.error("Error executing dynamic asset drilldown processing:", err));
    };

    hideInvestmentheadRecordsModal = () => {
        this.setState({ monthDetailsModalShow: false });
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

// 1. Map Investment Summary Record Rows with Visual Context Alerts
        const investmentSummaryRecordRows = investmentSummaryRecords.map(
            investment => {
                const netReturn = investment.investmentValue - investment.investmentAmount;
                const returnPercentage = investment.investmentAmount > 0 ? (netReturn * 100) / investment.investmentAmount : 0;
                const returnStyleColor = netReturn >= 0 ? "#16a34a" : "#e53e3e";

                return (
                    /* 1. Moved the event click indicator identity strictly to the <tr> row level using data-id */
                    <tr
                        key={investment.head}
                        data-id={investment.head}
                        onClick={this.showInvestmentHeadRecordsModal}
                        style={{ cursor: investment.head === 'Total' ? 'default' : 'pointer' }}
                    >
                        <td style={{textAlign: "center", fontSize: '.8rem', fontWeight: investment.head === 'Total' ? '700' : 'normal'}}>{investment.head}</td>
                        <td style={{textAlign: "right", fontSize: '.8rem', backgroundColor: "#f8fafc"}}>{NumberFormatNoCurrency(investment.investmentAmount)}</td>
                        <td style={{textAlign: "right", fontSize: '.8rem', backgroundColor: "#f0fdf4"}}>{NumberFormatNoCurrency(investment.investmentValue)}</td>
                        <td style={{textAlign: "right", fontSize: '.8rem', color: returnStyleColor, fontWeight: '600'}}>{NumberFormatNoCurrency(netReturn)}</td>
                        <td style={{textAlign: "right", fontSize: '.8rem', color: returnStyleColor, fontWeight: '600'}}>{NumberFormatNoCurrencyFraction2(returnPercentage)}%</td>
                    </tr>
                );
            }
        );

// 2. Map Clean, Null-Safe Return On Investment Rows
        const returnOnInvestmentRows = investmentReturnList.map(
            investment => {
                if (investment.metric !== "Cumulative Return (%)" && investment.metric !== "Average Return (%)") {
                    const npsNetRor = investment.nps?.ror != null ? NumberFormatNoCurrencyFraction2(investment.nps.ror) : 0;
                    const mfNetRor = investment.mf?.ror != null ? NumberFormatNoCurrencyFraction2(investment.mf.ror) : 0;
                    const shareNetRor = investment.share?.ror != null ? NumberFormatNoCurrencyFraction2(investment.share.ror) : 0;
                    const pfNetRor = investment.pf?.ror != null ? NumberFormatNoCurrencyFraction2(investment.pf.ror) : 0;
                    const licNetRor = investment.lic?.ror != null ? NumberFormatNoCurrencyFraction2(investment.lic.ror) : 0;

                    const totalBeg = investment.total?.beg ?? 0;
                    const totalEnd = investment.total?.end ?? 0;
                    const totalInv = investment.total?.inv ?? 0;
                    const computedNetReturn = totalEnd - totalBeg - totalInv;
                    const totalNetRor = investment.total?.ror != null ? NumberFormatNoCurrencyFraction2(investment.total.ror) : 0;

                    return (
                        <tr key={investment.metric}>
                            <td style={{textAlign: "center", fontSize: '.8rem', fontWeight: '500'}}>{investment.metric}</td>
                            {/* NPS Metrics Column Block */}
                            <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps?.inv ?? 0}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.nps?.end ?? 0}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem', color: (investment.nps?.ror ?? 0) >= 0 ? '#16a34a' : '#e53e3e'}}>{npsNetRor}%</td>
                            {/* MF Metrics Column Block */}
                            <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.mf?.inv ?? 0}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.mf?.end ?? 0}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue", color: (investment.mf?.ror ?? 0) >= 0 ? '#16a34a' : '#e53e3e'}}>{mfNetRor}%</td>
                            {/* Share Metrics Column Block */}
                            <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share?.inv ?? 0}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.share?.end ?? 0}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem', color: (investment.share?.ror ?? 0) >= 0 ? '#16a34a' : '#e53e3e'}}>{shareNetRor}%</td>
                            {/* PF Metrics Column Block */}
                            <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.pf?.inv ?? 0}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{investment.pf?.end ?? 0}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue", color: (investment.pf?.ror ?? 0) >= 0 ? '#16a34a' : '#e53e3e'}}>{pfNetRor}%</td>
                            {/* LIC Metrics Column Block */}
                            <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.lic?.inv ?? 0}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem'}}>{investment.lic?.end ?? 0}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem', color: (investment.lic?.ror ?? 0) >= 0 ? '#16a34a' : '#e53e3e'}}>{licNetRor}%</td>
                            {/* Consolidated Portfolio Totals Block */}
                            <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{totalInv}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue"}}>{totalEnd}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue", color: computedNetReturn >= 0 ? '#16a34a' : '#e53e3e'}}>{NumberFormatNoCurrency(computedNetReturn)}</td>
                            <td style={{textAlign: "center", fontSize: '.8rem', backgroundColor: "lightblue", color: (investment.total?.ror ?? 0) >= 0 ? '#16a34a' : '#e53e3e'}}>{totalNetRor}%</td>
                        </tr>
                    );
                }
                return null;
            }
        );

        return (
            <div id="cards" align="center" >
                <Row>
                    <Col s={12} m={12} l={6}>
                        <Card className="teal lighten-4" textClassName="black-text" title="Investment Summary">
                            <div>
                                <div>
                                    <Table striped bordered hover size="sm">
                                        {/* Table content rows go here */}
                                    <thead>
                                    <tr>
                                        <th width="10%" style={{textAlign: "center"}}>RoR</th>
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
                                </div>

                                {/* Corrected Reactstrap Control Bindings */}
                                <Modal
                                    isOpen={monthDetailsModalShow}
                                    toggle={this.hideInvestmentheadRecordsModal}
                                    size="lg" // Automatically scales up cleanly on wide desktop screens
                                    style={{ maxWidth: '95vw', margin: '10px auto' }} // Protects mobile edges
                                >
                                    <ModalHeader toggle={this.hideInvestmentheadRecordsModal}>Monthly Investment Transaction Records</ModalHeader>
                                    <div style={{ padding: '10px', overflowX: 'auto' }}>
                                        <Table striped bordered hover>
                                        <thead>
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
                                    </div>
                                </Modal>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col s={12} m={12} l={6}>
                        <Card className="teal lighten-4" textClassName="black-text" title="Investment Returns">
                            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                <Table striped bordered hover size="sm" style={{ minWidth: '600px' }}>
                                    <thead>
                                    <tr>
                                        {/* Corrected rowSpan / colSpan to CamelCase */}
                                        <th rowSpan="2" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Head</th>
                                        <th colSpan="3" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>NPS</th>
                                        <th colSpan="3" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>MF</th>
                                        <th colSpan="3" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>Share</th>
                                        <th colSpan="3" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>PF</th>
                                        <th colSpan="3" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem'}}>LIC</th>
                                        <th colSpan="4" width="17%" style={{whiteSpace: 'nowrap', textAlign: "center", fontSize: '.9rem', backgroundColor: "lightblue"}}>Total</th>
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
                {/* 1. Unified row container groups cards tightly together side-by-side */}
                <Row style={{ margin: '0px -5px !important', display: 'flex', flexWrap: 'wrap' }}>

                    {/* Total Investment Card */}
                    <Col s={12} m={12} l={6} style={{ padding: '4px !important' }}>
                        <Card
                            className="card-panel teal lighten-4"
                            textClassName="black-text"
                            title="Last 5 Years Investment"
                            style={{ margin: '0px !important', padding: '10px !important', height: '100%' }}
                        >
                            <div style={{ marginTop: '0px' }}>
                                <DrawLineChartShare data={totalMonthlyInvestment} domain={[1500000, 11000000]} divContainer="total-investment-line-container" />
                            </div>
                        </Card>
                    </Col>

                    {/* PF Investment Card */}
                    <Col s={12} m={12} l={6} style={{ padding: '4px !important' }}>
                        <Card
                            className="card-panel teal lighten-4"
                            textClassName="black-text"
                            title="Last 5 Year PF Investment"
                            style={{ margin: '0px !important', padding: '10px !important', height: '100%' }}
                        >
                            <div style={{ marginTop: '0px' }}>
                                <DrawLineChartShare data={pfMonthlyInvestment} domain={[0, 6000000]} divContainer="PF-investment-line-container" />
                            </div>
                        </Card>
                    </Col>

                    {/* NPS Investment Card */}
                    <Col s={12} m={12} l={6} style={{ padding: '4px !important' }}>
                        <Card
                            className="card-panel teal lighten-4"
                            textClassName="black-text"
                            title="Last 5 Year NPS Investment"
                            style={{ margin: '0px !important', padding: '10px !important', height: '100%' }}
                        >
                            <div style={{ marginTop: '0px' }}>
                                <DrawLineChartShare data={npsMonthlyInvestment} domain={[300000, 2500000]} divContainer="NPS-investment-line-container" />
                            </div>
                        </Card>
                    </Col>

                    {/* Mutual Fund Investment Card */}
                    <Col s={12} m={12} l={6} style={{ padding: '4px !important' }}>
                        <Card
                            className="card-panel teal lighten-4"
                            textClassName="black-text"
                            title="Last 5 Year Mutual Fund Investment"
                            style={{ margin: '0px !important', padding: '10px !important', height: '100%' }}
                        >
                            <div style={{ marginTop: '0px' }}>
                                <DrawLineChartShare data={mfMonthlyInvestment} domain={[100000, 1800000]} divContainer="MF-investment-line-container" />
                            </div>
                        </Card>
                    </Col>

                    {/* Share Investment Card */}
                    <Col s={12} m={12} l={6} style={{ padding: '4px !important' }}>
                        <Card
                            className="card-panel teal lighten-4"
                            textClassName="black-text"
                            title="Last 5 Year Share Investment"
                            style={{ margin: '0px !important', padding: '10px !important', height: '100%' }}
                        >
                            <div style={{ marginTop: '0px' }}>
                                <DrawLineChartShare data={shareMonthlyInvestment} domain={[1000, 100000]} divContainer="Share-investment-line-container" />
                            </div>
                        </Card>
                    </Col>

                    {/* LIC Investment Card */}
                    <Col s={12} m={12} l={6} style={{ padding: '4px !important' }}>
                        <Card
                            className="card-panel teal lighten-4"
                            textClassName="black-text"
                            title="Last 5 Year LIC Investment"
                            style={{ margin: '0px !important', padding: '10px !important', height: '100%' }}
                        >
                            <div style={{ marginTop: '0px' }}>
                                <DrawLineChartShare data={licMonthlyInvestment} domain={[350000, 850000]} divContainer="LIC-investment-line-container" />
                            </div>
                        </Card>
                    </Col>

                </Row>
            </div>
        );
    }
}

export default Investment;