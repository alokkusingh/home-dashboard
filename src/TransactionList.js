import React, {Component} from 'react';
import {Table} from 'reactstrap';
import {format, parseISO} from 'date-fns';
import {Button, Input, Modal} from 'semantic-ui-react';
import {Card} from 'react-materialize';
import {fetchAllTransactionsJson, fetchTransactionByIdJson} from './api/BankAPIManager.js';
import {searchTransactionsJson} from './api/SearchAPIManager.js';

class TransactionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            count: 0,
            lastTransactionDate: "",
            transactionModalShow: false,
            tranDetails: []
        };
    }

    async componentDidMount() {
        await Promise.all([
            fetchAllTransactionsJson().then(this.handleAllTransactions),
        ]);
    }

    handleAllTransactions = (body) => {
        if (body) {
            this.setState({
                transactions: body.transactions || [],
                count: body.count || 0,
                lastTransactionDate: body.lastTransactionDate || ""
            });
        }
    }

    searchTransactionByDescription = async (event) => {
        var description = document.getElementById("search-input").value;
        try {
            searchTransactionsJson(description).then(this.handleAllTransactions);
        } catch (err) {
            alert("Expense Refresh failed, error: " + err);
        }
    }

    searchClear = async (event) => {
        const searchInput = document.getElementById("search-input");
        if (searchInput) searchInput.value = "";
        try {
            fetchAllTransactionsJson().then(this.handleAllTransactions);
        } catch (err) {
            alert("Expense Refresh failed, error: " + err);
        }
    }

    // Updated to accept the transaction ID directly instead of reading a DOM attribute
    showModal = (id) => {
        if (!id) return;

        let tranDetails = [];
        fetchTransactionByIdJson(id)
            .then(data => {
                tranDetails[1] = data.id;
                tranDetails[2] = data.date;
                tranDetails[3] = data.debit;
                tranDetails[4] = data.credit;
                tranDetails[5] = data.head;
                tranDetails[6] = data.description;

                this.setState({
                    tranDetails: tranDetails,
                    transactionModalShow: true
                });
            });
    };

    hideModal = () => {
        this.setState({
            transactionModalShow: false
        });
    };

    render() {
        const {transactions, count, lastTransactionDate, transactionModalShow, tranDetails} = this.state;

        // FIXED: Correctly targeting transactions[0] to inspect individual item properties
        const columns = transactions.length > 0
            ? Object.keys(transactions[0]).filter(key => {
                const lowerKey = key.toLowerCase();
                return lowerKey !== 'id' && lowerKey !== 'description';
            })
            : [];

        return (
            <div id="cards" align="center">
                <Card
                    className="teal lighten-4"
                    textClassName="black-text"
                >
                <h2>Transaction List ({count} items)</h2>
                {/*{lastTransactionDate && <p>Last Transaction: {lastTransactionDate}</p>}*/}

                <div style={{marginBottom: '20px', display: 'flex', gap: '10px'}}>
                    <Input id="search-input" placeholder="Search by description..."/>
                    <Button primary onClick={this.searchTransactionByDescription}>Search</Button>
                    <Button secondary onClick={this.searchClear}>Clear</Button>
                </div>

                <Table striped responsive hover>
                    <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col} style={{textTransform: 'capitalize'}}>
                                {col}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((transaction, index) => (
                        <tr
                            key={transaction.id || index}
                            onClick={() => this.showModal(transaction.id)}
                            style={{cursor: 'pointer'}}
                        >
                            {columns.map((col) => {
                                const value = transaction[col];

                                if (col.toLowerCase() === 'date' && value) {
                                    try {
                                        return <td key={col}>{format(parseISO(value), 'yyyy-MM-dd')}</td>;
                                    } catch {
                                        return <td key={col}>{value.toString()}</td>;
                                    }
                                }

                                return (
                                    <td key={col}>
                                        {value !== null && value !== undefined ? value.toString() : ''}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    {transactions.length === 0 && (
                        <tr>
                            <td colSpan="100%" style={{textAlign: 'center'}}>
                                No transactions found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>

                <Modal open={transactionModalShow} onClose={this.hideModal} size="tiny">
                    <Modal.Header>Transaction Details</Modal.Header>
                    <Modal.Content>
                        <p><strong>ID:</strong> {tranDetails[1]}</p>
                        <p><strong>Date:</strong> {tranDetails[2]}</p>
                        <p><strong>Debit:</strong> {tranDetails[3]}</p>
                        <p><strong>Credit:</strong> {tranDetails[4]}</p>
                        <p><strong>Head:</strong> {tranDetails[5]}</p>
                        <p><strong>Description:</strong> {tranDetails[6]}</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.hideModal}>Close</Button>
                    </Modal.Actions>
                </Modal>
                </Card>
            </div>
        );
    }
}

export default TransactionList;