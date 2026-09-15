import React, { useState, useEffect } from 'react';
import './css/App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { aValidateSession, logout } from './utils/SessionUtils.js';

function App() {
    const [profile, setProfile] = useState(() => {
        // Initialize profile from localStorage if it exists
        const savedProfile = localStorage.getItem("profile");
        return savedProfile ? JSON.parse(savedProfile) : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const clientId = '391658724084-tkoc08taco4bbt5dpru2cdc0b97aa07p.apps.googleusercontent.com';

    // 1. Initialize Google API Client & Check initial local session
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: 'openid'
            }).catch(err => console.error("GAPI init error:", err));
        };
        gapi.load('client:auth2', initClient);

        // Safely verify asynchronous session check
        const checkSession = async () => {
            try {
                const isValid = await aValidateSession();
                if (isValid) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Session validation error:", error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, [clientId]);

    const logOut = () => {
        alert("Logging out!");
        setProfile(null);
        setIsAuthenticated(false);
        localStorage.removeItem("profile");
        try {
            logout();
            const authInstance = gapi.auth2.getAuthInstance();
            if (authInstance) {
                authInstance.disconnect();
            }
        } catch (err) {
            console.log("Log Out Error", err);
        }
    };

    const onSuccess = (res) => {
        console.log('Google login success', res);

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + res.tokenObj.id_token);
        myHeaders.append("grant-type", "token_exchange");
        myHeaders.append("token-provider", "GOOGLE");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("/home/auth/home/token/exchange", requestOptions)
            .then((response) => {
                if (!response.ok) throw new Error("Token exchange failed");
                return response.json();
            })
            .then((data) => {
                console.log("Exchange Data: ", data);
                if (data.accessToken !== undefined) {
                    setProfile(res.profileObj);
                    localStorage.setItem("profile", JSON.stringify(res.profileObj));
                    setIsAuthenticated(true);
                } else {
                    alert(`${res.profileObj.name}, you are not authorized to access this page. Please contact Alok!`);
                    logOut();
                }
            })
            .catch(error => {
                console.error('Network/Auth error', error);
                alert("There was an error, please try again later!");
                logOut();
            });
    };

    const onFailure = (err) => {
        alert("Login Failed!");
        console.log('Failed details:', err);
    };

    // 2. Render Loading state while verifying token on mount
    if (loading) {
        return <div className="center"><h5>Loading application...</h5></div>;
    }

    // 3. Render Login Screen if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="center">
                <img alt="Home Dashboard" src="/logo512.png" style={{ height: 100, width: 100 }} />
                <br /><br />
                <GoogleLogin
                    clientId={clientId}
                    buttonText="Sign in with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        );
    }

    // 4. Main App Router for Authenticated Users
    return (
        <Router>
            <Switch>
                <Route path='/' exact={true} render={
                    (props) => <Home {...props} clientId={clientId} logOut={logOut} />}
                />
            </Switch>
        </Router>
    );
}

export default App;