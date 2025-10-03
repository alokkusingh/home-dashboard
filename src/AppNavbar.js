import React from 'react';
import {Navbar, NavbarBrand, NavbarText} from 'reactstrap';
import { GoogleLogout } from 'react-google-login';
import './css/App.css';
import {logout} from './utils/SessionUtils.js'

function clearOnLogOut() {
  sessionStorage.removeItem("LOGGED_IN");
  logout();
  console.log("clearOnLogOut");
}

function AppNavbar(clientId, logOut) {
    return <Navbar className="card-panel teal lighten-1" expand="md">
        <NavbarBrand href="/">
          <div className="left">
            <img alt="Home Dashboard" src="/logo512.png" style={{ height: 30, width: 30 }} />
            <NavbarText> Home Dashboard</NavbarText>
          </div>
          <GoogleLogout clientId={clientId} buttonText="Log Out" onLogoutSuccess={clearOnLogOut} className="logoutButton"/>
        </NavbarBrand>
    </Navbar>
}

export default AppNavbar;