import React, { Component } from 'react';
import './css/App.css';
import 'materialize-css/dist/css/materialize.min.css'
import 'semantic-ui-css/semantic.min.css'
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import HomeCards from './HomeCards';
import RefreshGoogleSheets from './RefreshGoogleSheets';

class Home extends Component {

    render() {
        return (
            <div className="teal lighten-5">
                <AppNavbar/>
                <Container fluid>
                    <a class="waves-effect waves-light btn-small"><Link class="white-text" to="/transactions">Transactions</Link></a>
                    <a class="waves-effect waves-light btn-small"><Link class="white-text" to="/expenses">Expenses</Link></a>
                    <a class="waves-effect waves-light btn-small"><Link class="white-text" to="/salary">Salary</Link></a>
                    <a class="waves-effect waves-light btn-small"><Link class="white-text" to="/uploadFile">Upload File</Link></a>
                    <RefreshGoogleSheets />
                </Container>
                <HomeCards/>
            </div>
        );
    }
}

export default Home;