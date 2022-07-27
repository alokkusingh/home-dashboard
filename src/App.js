import React, { Component } from 'react';
import './css/App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TransactionList from './TransactionList';
import ExpenseList from './ExpenseList';
import Salary from './Salary'
import UploadFile from './UploadFile'
import MenuBarWithContent from './MenuBarWithContent'

class App extends Component {
  render() {
    return (
        <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/transactions' exact={true} component={TransactionList}/>
            <Route path='/expenses' exact={true} component={ExpenseList}/>
            <Route path='/salary' exact={true} component={Salary}/>
            <Route path='/uploadFile' exact={true} component={UploadFile}/>
            <Route path='/MenuBarWithContent' exact={true} component={MenuBarWithContent}/>
          </Switch>
        </Router>
    )
  }
}

export default App;