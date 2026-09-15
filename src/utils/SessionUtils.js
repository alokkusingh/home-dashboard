import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

export function redirectToLogin() {
    console.log("redirectToLogin");
    sessionStorage.removeItem("LOGGED_IN");
    return ReactDOM.render(
            <React.StrictMode>
              <App />
            </React.StrictMode>,
            document.getElementById('root')
          );
}

export function aValidateSession() {
  console.log("validateSession");

  const request = new XMLHttpRequest();
  request.open("GET", "/home/auth/home/token/validate", false); // `false` makes the request synchronous
  request.send(null);

  if (request.status === 200) {
    console.log(request.responseText);
    return true;
  }
  return false;
}

export function refreshToken() {
      console.log("refreshToken");

      const request = new XMLHttpRequest();
      request.open("POST", "/home/auth/home/token/refresh", false); // `false` makes the request synchronous
      request.setRequestHeader("Accept", "application/json");
      request.setRequestHeader("grant-type", "refresh_token");

      request.send(null);

      if (request.status === 200) {
        console.log(request.responseText);
        return true;
      } else if (request.status === 401) {
        console.error('Authentication required: 401 Unauthorized');
        redirectToLogin();
      } else {
        console.error(`HTTP error! Status: ${request.status}`);
        throw new Error(`HTTP error! Status: ${request.status}`);
      }
      return false;
 }

 export function logout() {
     console.log("logout");

     const request = new XMLHttpRequest();
     request.open("POST", "/home/auth/home/token/logout", false); // `false` makes the request synchronous
     request.send(null);

     if (request.status === 200) {
       console.log(request.responseText);
       return true;
     }
     return false;
  }