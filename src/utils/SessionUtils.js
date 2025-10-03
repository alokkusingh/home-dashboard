import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import {getHeadersRefreshJson} from '../api/APIUtils'

export function redirectToLogin() {
    console.log("redirectToLogin");
    sessionStorage.removeItem("ID_TOKEN");
    return ReactDOM.render(
            <React.StrictMode>
              <App />
            </React.StrictMode>,
            document.getElementById('root')
          );
}

export function refreshToken() {
    console.log("refreshToken");
    var requestOptions = {
      method: 'POST',
      headers: getHeadersRefreshJson()
    };

     fetch("/home/auth/home/token/refresh", requestOptions)
        .then(response => {
           if (response.status === 401) {
             console.error('Authentication required: 401 Unauthorized');
             redirectToLogin();
           } else if (!response.ok) {
             // Handle other non-successful HTTP status codes (e.g., 404, 500)
             console.error(`HTTP error! Status: ${response.status}`);
             throw new Error(`HTTP error! Status: ${response.status}`);
           }
           // Process the successful response (e.g., parse JSON)
           return response.json();
         })
         .then(token => {
           // Handle the successful data
           console.log('Token received:', token);
         })
         .catch(error => {
           // Handle network errors or errors thrown in the .then() block
           console.error('Fetch error:', error);
         });
 }