import React, { useState, useEffect } from 'react';
import './css/App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';

function App() {

  const [ profile, setProfile ] = useState([]);
  console.log("Loading App");

  const clientId = '391658724084-tkoc08taco4bbt5dpru2cdc0b97aa07p.apps.googleusercontent.com';
  useEffect(() => {
      const initClient = () => {
          gapi.client.init({
              clientId: clientId,
              scope: 'openid'
          });
      };
      gapi.load('client:auth2', initClient);
  }, []);

   const onSuccess = (res) => {
      console.log('success', res);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + res.tokenObj.id_token);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch("/home/auth/google/validate/id-token", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            console.log("Data: " );
            console.log(data);
            if (data.id !== undefined) {
              setProfile(res.profileObj);
              sessionStorage.setItem("ID_TOKEN", res.tokenObj.id_token);
            } else {
              alert(res.profileObj.name + " you are not authorize to access this page please contact Alok!");
              logOut();
            }
          })
          .catch(error => {
            console.log('error', error);
            logOut();
            alert("There was some error please try after sometime!");
          });
   };

    const onFailure = (err) => {
        alert("Logged in Failed!");
        console.log('failed', err);
    };

    const logOut = () => {
        setProfile(null);
        sessionStorage.setItem("ID_TOKEN", "");
        try {
          gapi.auth2.getAuthInstance().disconnect();
        } catch(err) {
           console.log("Log Out Error");
         }
    };

    try {
    if(profile === undefined || profile.length === 0) {
      return <div className="center">
          <img alt="Home Dashboard" src="/logo512.png" style={{ height: 100, width: 100 }} />
          <br />
          <br />
          <GoogleLogin
              clientId={clientId}
              buttonText="Sign in with Google"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}
              //isSignedIn={true}
          />
      </div>
    } else {
      console.log("Already Logged In");
    }
    } catch(error) {
      return <div className="center">
          <img alt="Home Dashboard" src="/logo512.png" style={{ height: 100, width: 100 }} />
          <br />
          <br />
          <GoogleLogin
              clientId={clientId}
              buttonText="Sign in with Google"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}
              //isSignedIn={true}
          />
      </div>
    }

    return (
        <Router>
          <Switch>
            <Route path='/' exact={true} render={(props) => <Home {...props} clientId={clientId} logOut={logOut} />} />
          </Switch>
        </Router>
    )
}

export default App;