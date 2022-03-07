import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Container} from 'reactstrap';
import HomeCards from './HomeCards';
import {Button, Icon} from 'react-materialize';
import 'materialize-css/dist/css/materialize.min.css'

class Home extends Component {

    render() {
        return (
            <div className="teal lighten-5">
                <AppNavbar/>
                <Container fluid>
                    <a class="waves-effect waves-light btn-small"><Link class="white-text" to="/transactions">Transactions</Link></a>
                    <a class="waves-effect waves-light btn-small"><Link class="white-text" to="/expenses">Expenses</Link></a>
                    <a class="waves-effect waves-light btn-small"><Link class="white-text" to="uploadStatement">Upload Statement</Link></a>
                    <a class="waves-effect waves-light btn-small"><Link class="white-text" to="/uploadExpense">Upload Expenses</Link></a>
                </Container>
                <HomeCards/>
            </div>
        );
    }
}

export default Home;