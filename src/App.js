import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TransactionList from './TransactionList';
import ExpenseList from './ExpenseList';
import UploadStatement from './UploadStatement'
import UploadExpense from './UploadExpense'

class App extends Component {
  render() {
    return (
        <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/transactions' exact={true} component={TransactionList}/>
            <Route path='/expenses' exact={true} component={ExpenseList}/>
            <Route path='/uploadStatement' exact={true} component={UploadStatement}/>
            <Route path='/uploadExpense' exact={true} component={UploadExpense}/>
          </Switch>
        </Router>
    )
  }
}

export default App;