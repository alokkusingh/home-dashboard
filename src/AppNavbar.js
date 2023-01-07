import React from 'react';
import {Navbar, NavbarBrand, NavbarText} from 'reactstrap';
import { GoogleLogout } from 'react-google-login';
import './css/App.css';

function AppNavbar(clientId, logOut) {

        return <Navbar className="card-panel teal lighten-1" expand="md">
            <NavbarBrand href="/">
              <img alt="logo" src="/logo512.png" style={{ height: 40, width: 40 }} />
              <div style={{float: 'right'}}>
                <GoogleLogout clientId={clientId} buttonText="Log out" onLogoutSuccess={logOut} className="rightButton"/>
              </div>
            </NavbarBrand>
            <NavbarText>Home Dashboard</NavbarText>
        </Navbar>
}

export default AppNavbar;