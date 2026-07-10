import React from 'react';
import {Navbar, NavbarBrand, NavbarText} from 'reactstrap';
import { GoogleLogout } from 'react-google-login';
import './css/App.css';
import {logout} from './utils/SessionUtils.js'

function clearOnLogOut() {
  logout();
  localStorage.removeItem("profile");
  console.log("clearOnLogOut");
}

function AppNavbar(clientId, logOut) {
    var logoutString = "Logout";
    return (
      <Navbar className="card-panel teal lighten-1" expand="md">
        <NavbarBrand href="/">
          <div className="left">
            <img alt="Home Dashboard" src="/logo512.png" style={{ height: 30, width: 30 }} />
            <NavbarText> Home Dashboard</NavbarText>
          </div>
          <div className="right">
            <GoogleLogout clientId={clientId} buttonText="Logout" onLogoutSuccess={clearOnLogOut} className="logoutButton"/>
          </div>
        </NavbarBrand>
      </Navbar>
   )
}

export default AppNavbar;