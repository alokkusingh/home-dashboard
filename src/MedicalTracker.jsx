import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { format, parseISO } from 'date-fns';
import { Card } from 'react-materialize';
import { Button, Label, Divider } from 'semantic-ui-react';
import { fetchMedicalTimelineJson } from './api/MedicalAPIManager.js';

class MedicalTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medicalTimelineData: [],
            activeTab: 'alok', // Default active member view profile
            activeEntityId: 1,  // Entity ID 1 matching Alok in DB seed parameters
            isSyncing: false
        };
    }

    componentDidMount() {
        this.loadMedicalData(this.state.activeEntityId);
    }

    // Handles safe state re-routing when switching between family profiles
    handleTabChange = (tabName, entityId) => {
        this.setState({activeTab: tabName, activeEntityId: entityId, medicalTimelineData: []}, () => {
            this.loadMedicalData(entityId);
        });
    };

    loadMedicalData = async (entityId) => {
        try {
            const data = await fetchMedicalTimelineJson(entityId);
            this.setState({medicalTimelineData: Array.isArray(data) ? data : []});
        } catch (err) {
            console.error("Failed to read medical data matrix layout blocks:", err);
        }
    };

    // Pivots data out of the relational collection to build a horizontal spreadsheet table matrix view
    extractMatrixFromTimeline(timelineData) {

        if (!timelineData || timelineData.length === 0) return {uniqueDates: [], rowMetricsMap: []};

        // 1. Sort lab records chronologically (Newest first)
        const sortedLabs = [...timelineData].sort((a, b) => parseISO(b.testDate) - parseISO(a.testDate));
        const uniqueDates = sortedLabs.map(lab => lab.testDate);

        // 2. Transpose metric rows to map their values horizontally across the extracted calendar dates
        const rowMetricsMap = {};

        sortedLabs.forEach((lab, dateIndex) => {
            if (lab.results && Array.isArray(lab.results)) {
                lab.results.forEach(res => {
                    const metricName = res.metricName;

                    if (!rowMetricsMap[metricName]) {
                        rowMetricsMap[metricName] = {
                            metricName: metricName,
                            unit: res.unit ? res.unit : '',
                            minNormal: res.minNormal,
                            maxNormal: res.maxNormal,
                            valuesArray: new Array(sortedLabs.length).fill(null)
                        };
                    }

                    // Assign specific data properties to the matching date column index placement
                    rowMetricsMap[metricName].valuesArray[dateIndex] = {
                        value: res.value,
                        isOutOfRange: res.isOutOfRange
                    };
                });
            }
        });

        return {uniqueDates, rowMetricsMap: Object.values(rowMetricsMap)};
    }

    render() {
        const {medicalTimelineData, activeTab, isSyncing} = this.state;
        const {uniqueDates, rowMetricsMap} = this.extractMatrixFromTimeline(medicalTimelineData);

        return (
            <div id="medical-cards" align="center">
                <Card className="grey lighten-5" textClassName="black-text">

                    {/* Header Controls Layout Block */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        width: '96%'
                    }}>
                        {/* Tab Selectors matching your dashboard styles */}
                        <div style={{display: 'flex', gap: '8px'}}>
                            <Button
                                type='button'
                                color={activeTab === 'alok' ? 'blue' : null}
                                onClick={() => this.handleTabChange('alok', 1)}
                            >
                                👨 Alok
                            </Button>
                            <Button
                                type='button'
                                color={activeTab === 'rachna' ? 'pink' : null}
                                onClick={() => this.handleTabChange('rachna', 2)}
                            >
                                👩‍🦰 Rachna
                            </Button>
                            <Button
                                type='button'
                                color={activeTab === 'saanvi' ? 'purple' : null}
                                onClick={() => this.handleTabChange('saanvi', 3)}
                            >
                                👧 Saanvi
                            </Button>
                        </div>
                    </div>

                    <Divider/>

                    {/* Horizontal Spreadsheet Style Grid Matrix Container */}
                    <div style={{overflowX: 'auto', width: '98%', padding: '10px'}}>
                        <Table celled structured hover striped style={{backgroundColor: '#ffffff', minWidth: '800px'}}>
                            <thead>
                            <tr style={{backgroundColor: '#f1f3f4', textAlign: 'center'}}>
                                <th style={{minWidth: '180px', textAlign: 'left'}}>Test Parameter</th>
                                <th style={{backgroundColor: '#fff9c4', minWidth: '60px'}}>Min</th>
                                <th style={{backgroundColor: '#fff9c4', minWidth: '60px'}}>Max</th>

                                {/* Generate horizontal date headers dynamically */}
                                {uniqueDates.map(dateStr => (
                                    <th key={dateStr} style={{
                                        backgroundColor: '#e8f0fe',
                                        minWidth: '95px',
                                        textAlign: 'center',
                                        fontSize: '0.85rem'
                                    }}>
                                        {format(parseISO(dateStr), 'dd MMM yy')}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {rowMetricsMap.length === 0 ? (
                                <tr>
                                    <td colSpan={uniqueDates.length + 3}
                                        style={{textAlign: 'center', padding: '30px', color: '#888'}}>
                                        No tracking records extracted for this family profile.
                                    </td>
                                </tr>
                            ) : (
                                rowMetricsMap.map(row => (
                                    <tr key={row.metricName} style={{fontSize: '0.9rem'}}>
                                        {/* Name Column */}
                                        <td style={{textAlign: 'left', fontWeight: '500', padding: '8px'}}>
                                            {row.metricName}
                                        </td>

                                        {/* Reference boundaries highlighted using yellow visual accents */}
                                        <td style={{
                                            backgroundColor: '#fffde7',
                                            textAlign: 'center',
                                            color: '#555',
                                            fontSize: '0.8rem'
                                        }}>
                                            {row.minNormal !== null ? row.minNormal : '—'}
                                        </td>
                                        <td style={{
                                            backgroundColor: '#fffde7',
                                            textAlign: 'center',
                                            color: '#555',
                                            fontSize: '0.8rem'
                                        }}>
                                            {row.maxNormal !== null ? row.maxNormal : '—'}
                                        </td>

                                        {/* Loop through historical values for the row */}
                                        {row.valuesArray.map((cell, idx) => {
                                            const hasValue = cell !== null;
                                            const isRed = hasValue && cell.isOutOfRange;

                                            return (
                                                <td
                                                    key={idx}
                                                    style={{
                                                        textAlign: 'center',
                                                        fontWeight: isRed ? 'bold' : 'normal',
                                                        backgroundColor: isRed ? '#ffebee' : 'transparent',
                                                        color: isRed ? '#c62828' : '#212121',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                >
                                                    {hasValue ? (
                                                        isRed ? (
                                                            <Label basic color='red' size='small'
                                                                   style={{border: 'none', padding: '2px 6px'}}>
                                                                {cell.value}
                                                            </Label>
                                                        ) : cell.value
                                                    ) : '—'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </div>
        );
    }
}

export default MedicalTracker;