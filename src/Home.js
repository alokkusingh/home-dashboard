import React, { Component } from 'react';
import './css/App.css';
import 'materialize-css/dist/css/materialize.min.css'
import 'semantic-ui-css/semantic.min.css'
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import HomeCards from './HomeCards';
import RefreshGoogleSheets from './RefreshGoogleSheets';
import MenuBarWithContent from './MenuBarWithContent';

class Home extends Component {

    render() {
        return (
            <div className="teal lighten-5">
                <AppNavbar/>
                <MenuBarWithContent/>
            </div>
        );
    }
}

export default Home;