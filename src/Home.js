import React from 'react';
import './css/App.css';
import 'materialize-css/dist/css/materialize.min.css'
import 'semantic-ui-css/semantic.min.css'
import AppNavbar from './AppNavbar';
import MenuBarWithContent from './MenuBarWithContent';

function Home(clientId, logOut) {

  console.log("Loading Home ");

    return (
        <div className="teal lighten-5">
            <AppNavbar clientId={clientId} logOut={logOut}/>
            <MenuBarWithContent/>
        </div>

    );
}

export default Home;