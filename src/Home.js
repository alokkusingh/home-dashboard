import React, { Component, useState, useEffect } from 'react';
import './css/App.css';
import 'materialize-css/dist/css/materialize.min.css'
import 'semantic-ui-css/semantic.min.css'
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import HomeCards from './HomeCards';
import RefreshGoogleSheets from './RefreshGoogleSheets';
import MenuBarWithContent from './MenuBarWithContent';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';

function Home() {

  console.log("Loading Home ");
  const [ profile, setProfile, alertEnabled ] = useState([]);



  const clientId = '391658724084-tkoc08taco4bbt5dpru2cdc0b97aa07p.apps.googleusercontent.com';

      useEffect(() => {
          const initClient = () => {
              gapi.client.init({
                  clientId: clientId,
                  scope: 'openid'
              });
          };
          gapi.load('client:auth2', initClient);
      });

      window.addEventListener("beforeunload", (event) => {
              logOut();
              console.log("API call before page reload");
          });

       window.addEventListener("unload", (event) => {
               logOut();
               console.log("API call after page reload");
           });

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
              alert("Welcome " + res.profileObj.name + "!");
              setProfile(res.profileObj);
            } else {
              logOut();
              alert(res.profileObj.name + " you are not authorize to access this page please contact Alok!");
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
          gapi.auth2.getAuthInstance().disconnect();
      };



    return (
    <div>
    {
      profile ? (
                <div className="teal lighten-5">
                    <AppNavbar/>
                    <div style={{float: 'right'}}>
                      <GoogleLogout clientId={clientId} buttonText="Log out" onLogoutSuccess={logOut} />
                    </div>
                    <MenuBarWithContent/>
                </div>
        ) : (
         <div className="center">
        <GoogleLogin
            clientId={clientId}
            buttonText="Sign in with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            //isSignedIn={true}
        />
        </div>

       )
      }
      </div>
    );
}

export default Home;