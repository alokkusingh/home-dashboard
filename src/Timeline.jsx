import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { format, parseISO } from 'date-fns';
import { Card } from 'react-materialize';
import { Button, Modal, Header, Divider, Label } from 'semantic-ui-react';
import {
    fetchTimelineFamilyJson,
    fetchTimelineEventByIdJson
} from './api/TimelineAPIManager.js';


class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profiles: [],
            masterTimeline: [],
            eventModalShow: false,
            eventDetails: {},
            activeTab: 'master' // <--- MUST BE INITIALISED HERE
        };
    }

    async componentDidMount() {
        try {
            const data = await fetchTimelineFamilyJson();
            this.handleAllEvents(data);
        } catch (err) {
            console.error("Failed to load timeline records:", err);
        }
    }

    handleAllEvents = (body) => {
        const profiles = Array.isArray(body) ? body : [];
        const eventMap = {};

        // Flatten individual profile arrays into a unified tracking list
        profiles.forEach(profile => {
            if (profile.events && Array.isArray(profile.events)) {
                profile.events.forEach(event => {
                    if (!eventMap[event.id]) {
                        eventMap[event.id] = {
                            ...event,
                            participants: [profile.name]
                        };
                    } else {
                        // Prevent duplication for shared rows (like 'Married' or 'House In JGTE')
                        if (!eventMap[event.id].participants.includes(profile.name)) {
                            eventMap[event.id].participants.push(profile.name);
                        }
                    }
                });
            }
        });

        // Sort global tracking lists chronologically (Newest first)
        const masterTimeline = Object.values(eventMap).sort((a, b) =>
            parseISO(b.eventDate) - parseISO(a.eventDate)
        );

        this.setState({
            profiles: profiles,
            masterTimeline: masterTimeline
        });
    }

    showModal = async (event) => {
        const eventId = event.currentTarget.getAttribute("id");

        try {
            // Calls your dynamic fetchById API module function
            const data = await fetchTimelineEventByIdJson(eventId);

            // Look up who participated from our current global matching graph state map
            const matchedMasterEvent = this.state.masterTimeline.find(e => String(e.id) === String(eventId));
            const participantsList = matchedMasterEvent ? matchedMasterEvent.participants.join(', ') : '—';

            this.setState({
                eventDetails: {
                    id: data.id,
                    eventDate: data.eventDate,
                    eventType: data.eventType,
                    participants: participantsList,
                    eventAge: data.eventAge,
                    duration: data.duration ? data.duration : '—',
                    notes: data.notes ? data.notes : '—'
                },
                eventModalShow: true
            });
        } catch (err) {
            console.error("Error loading specific event attributes payload:", err);
        }
    };

    hideModal = () => {
        this.setState({eventModalShow: false});
    };

    renderTableRows(eventsList, defaultParticipants = null) {
        if (!eventsList || eventsList.length === 0) {
            return (
                <tr>
                    <td colSpan="6" style={{textAlign: 'center', padding: '15px', color: '#666', fontSize: '.8rem'}}>
                        No milestones tracked.
                    </td>
                </tr>
            );
        }

        return eventsList.map(event => {
            const people = event.participants ? event.participants : [defaultParticipants];

            return (
                <tr
                    key={event.id}
                    id={event.id}
                    style={{textAlign: "center", fontSize: '1rem', cursor: 'pointer'}}
                    onClick={this.showModal}
                >
                    <td style={{textAlign: "center", fontSize: '.8rem'}}>
                        {format(parseISO(event.eventDate), 'dd MMM yyyy')}
                    </td>
                    <td style={{textAlign: "center", fontSize: '.8rem', fontWeight: 'bold'}}>
                        {event.eventType}
                    </td>
                    <td style={{textAlign: "center", fontSize: '.8rem'}}>
                        {people.map(name => (
                            <Label
                                key={name}
                                size='mini'
                                color={name === 'Alok' ? 'blue' : name === 'Rachna' ? 'pink' : 'purple'}
                                style={{margin: '2px'}}
                            >
                                {name}
                            </Label>
                        ))}
                    </td>
                    <td style={{textAlign: "center", fontSize: '.8rem', fontFamily: 'monospace'}}>
                        {event.eventAge}
                    </td>
                    <td style={{textAlign: "center", fontSize: '.8rem', fontFamily: 'monospace'}}>
                        {event.duration ? event.duration : '—'}
                    </td>
                    <td style={{
                        textAlign: "left",
                        fontSize: '.8rem',
                        maxWidth: '220px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {event.notes ? event.notes : '—'}
                    </td>
                </tr>
            );
        });
    }

    render() {
        // 1. Destructure all needed properties out of state to fix the 'no-undef' errors
        const { profiles, masterTimeline, eventDetails, eventModalShow, activeTab } = this.state;

        // 2. Direct mapping extraction from your nesting keys
        const alokData = profiles.find(p => p.name === 'Alok');
        const rachnaData = profiles.find(p => p.name === 'Rachna');
        const saanviData = profiles.find(p => p.name === 'Saanvi');

        const tableHeader = (
            <thead>
            <tr>
                <th width="12%" style={{ textAlign: "center", fontSize: '1rem' }}>Date</th>
                <th width="20%" style={{ textAlign: "center", fontSize: '1rem' }}>Event / Milestone</th>
                <th width="15%" style={{ textAlign: "center", fontSize: '1rem' }}>Participants</th>
                <th width="15%" style={{ textAlign: "center", fontSize: '1rem' }}>Elapsed Age</th>
                <th width="13%" style={{ textAlign: "center", fontSize: '1rem' }}>Duration</th>
                <th width="25%" style={{ textAlign: "left", fontSize: '1rem' }}>Tracking Notes</th>
            </tr>
            </thead>
        );

        return (
            <div id="cards" align="center">
                <Card className="teal lighten-4" textClassName="black-text">

                    {/* Tab Selection Headers */}
                    <div style={{marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-start'}}>
                        <Button
                            type='button'
                            color={activeTab === 'master' ? 'teal' : null}
                            onClick={() => this.setState({activeTab: 'master'})}
                        >
                            🗓️ Master Timeline
                        </Button>
                        <Button
                            type='button'
                            color={activeTab === 'alok' ? 'blue' : null}
                            onClick={() => this.setState({activeTab: 'alok'})}
                        >
                            👤 Alok
                        </Button>
                        <Button
                            type='button'
                            color={activeTab === 'rachna' ? 'pink' : null}
                            onClick={() => this.setState({activeTab: 'rachna'})}
                        >
                            👤 Rachna
                        </Button>
                        <Button
                            type='button'
                            color={activeTab === 'saanvi' ? 'purple' : null}
                            onClick={() => this.setState({activeTab: 'saanvi'})}
                        >
                            👧 Saanvi
                        </Button>
                    </div>

                    <div style={{clear: 'both', paddingTop: '10px'}}>

                        {/* TAB 1: MASTER FAMILY TIMELINE */}
                        {activeTab === 'master' && (
                            <div>
                                {/*<Header as='h3' block textAlign='left' color='teal'>*/}
                                {/*    🗓️ Master Family Timeline (Unified Chronological Feed)*/}
                                {/*</Header>*/}
                                <Table hover striped responsive style={{backgroundColor: '#fff'}}>
                                    {tableHeader}
                                    <tbody>
                                    {this.renderTableRows(masterTimeline)}
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        {/* TAB 2: ALOK'S SEPARATED FEED */}
                        {activeTab === 'alok' && (
                            <div>
                                {/*<Header as='h3' block textAlign='left' color='blue'>*/}
                                {/*    /!*👤 Alok's Personal Milestones*!/*/}
                                {/*</Header>*/}
                                <Table hover striped responsive style={{backgroundColor: '#fff'}}>
                                    {tableHeader}
                                    <tbody>
                                    {alokData ? this.renderTableRows(alokData.events, 'Alok') : this.renderTableRows([])}
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        {/* TAB 3: RACHNA'S SEPARATED FEED */}
                        {activeTab === 'rachna' && (
                            <div>
                                {/*<Header as='h3' block textAlign='left' color='pink'>*/}
                                {/*    👤 Rachna's Personal Milestones*/}
                                {/*</Header>*/}
                                <Table hover striped responsive style={{backgroundColor: '#fff'}}>
                                    {tableHeader}
                                    <tbody>
                                    {rachnaData ? this.renderTableRows(rachnaData.events, 'Rachna') : this.renderTableRows([])}
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        {/* TAB 4: SAANVI'S SEPARATED FEED */}
                        {activeTab === 'saanvi' && (
                            <div>
                                {/*<Header as='h3' block textAlign='left' color='purple'>*/}
                                {/*    /!*👧 Saanvi's Personal Milestones*!/*/}
                                {/*</Header>*/}
                                <Table hover striped responsive style={{backgroundColor: '#fff'}}>
                                    {tableHeader}
                                    <tbody>
                                    {saanviData ? this.renderTableRows(saanviData.events, 'Saanvi') : this.renderTableRows([])}
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        {/* MODAL WINDOW SHOWING SPECIFIC DYNAMIC RECORD VALUES */}
                        <Modal size='tiny' open={eventModalShow} onClose={this.hideModal}>
                            <Modal.Header>Milestone Data Inspection Viewer</Modal.Header>
                            <Modal.Content>
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th style={{textAlign: "center", fontSize: '1rem'}}>Tracking Attribute</th>
                                        <th style={{textAlign: "center", fontSize: '1rem'}}>Database Value</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td style={{textAlign: "center", fontSize: '1rem'}}>System Event Id</td>
                                        <td style={{textAlign: "left", fontSize: '.8rem'}}>{eventDetails.id}</td>
                                    </tr>
                                    <tr>
                                        <td style={{textAlign: "center", fontSize: '1rem'}}>Event Date</td>
                                        <td style={{textAlign: "left", fontSize: '.8rem'}}>
                                            {eventDetails.eventDate ? format(parseISO(eventDetails.eventDate), 'dd MMM yyyy') : '—'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{textAlign: "center", fontSize: '1rem'}}>Milestone Action</td>
                                        <td style={{
                                            textAlign: "left",
                                            fontSize: '.8rem',
                                            fontWeight: 'bold'
                                        }}>{eventDetails.eventType}</td>
                                    </tr>
                                    <tr>
                                        <td style={{textAlign: "center", fontSize: '1rem'}}>Participants Linked</td>
                                        <td style={{
                                            textAlign: "left",
                                            fontSize: '.8rem'
                                        }}>{eventDetails.participants}</td>
                                    </tr>
                                    <tr>
                                        <td style={{textAlign: "center", fontSize: '1rem'}}>Elapsed Tracking Age</td>
                                        <td style={{textAlign: "left", fontSize: '.8rem'}}>{eventDetails.eventAge}</td>
                                    </tr>
                                    <tr>
                                        <td style={{textAlign: "center", fontSize: '1rem'}}>Duration Met</td>
                                        <td style={{textAlign: "left", fontSize: '.8rem'}}>{eventDetails.duration}</td>
                                    </tr>
                                    <tr>
                                        <td style={{textAlign: "center", fontSize: '1rem'}}>Notes Context</td>
                                        <td style={{
                                            textAlign: "left",
                                            fontSize: '.8rem',
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word'
                                        }}>{eventDetails.notes}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Modal.Content>
                        </Modal>
                    </div>
                </Card>
            </div>
        );
    }
}

export default Timeline;