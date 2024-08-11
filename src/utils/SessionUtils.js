import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

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