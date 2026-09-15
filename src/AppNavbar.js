import React from 'react';
import { Navbar, NavbarBrand, NavbarText } from 'reactstrap';
import { GoogleLogout } from 'react-google-login';
import './css/App.css';
import { logout } from './utils/SessionUtils.js';

// 1. Properly destructure the props using curly braces { }
function AppNavbar({ clientId, logOut }) {

    // 2. Clear application data and alert the parent state to reset
    const handleLogOutSuccess = () => {
        logout();
        localStorage.removeItem("profile");
        console.log("Local session cleared");

        // Trigger the parent logOut function passed down from App.js
        if (typeof logOut === 'function') {
            logOut();
        }
    };

    return (
        <Navbar className="card-panel teal lighten-1" expand="md">
            <NavbarBrand href="/">
                <div className="left">
                    <img alt="Home Dashboard" src="/logo512.png" style={{ height: 30, width: 30 }} />
                    <NavbarText> Home Dashboard</NavbarText>
                </div>
                <div className="right">
                    {/* 3. Corrected props implementation */}
                    <GoogleLogout
                        clientId={clientId}
                        buttonText="Logout"
                        onLogoutSuccess={handleLogOutSuccess}
                        className="logoutButton"
                    />
                </div>
            </NavbarBrand>
        </Navbar>
    );
}

export default AppNavbar;