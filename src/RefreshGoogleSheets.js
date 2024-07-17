import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import './css/App.css';
import {refreshSheet} from './api/GSheetAPIManager.js'

class RefreshGoogleSheets extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  async componentDidMount() {
  }

  refreshGSheet = (e) => {
    refreshSheet(e.currentTarget.getAttribute("id"));
  }

  render() {
      const {
      } =  this.state;

      return (
          <div className="center">
            <Button.Group basic size='small'>
                <Button id='expense' onClick={this.refreshGSheet}>
                  <Icon name='refresh'/>
                  Expense
                </Button>
                <Button id='investment' onClick={this.refreshGSheet}>
                  <Icon name='refresh'/>
                  Investment
                </Button>
                <Button id='tax' onClick={this.refreshGSheet}>
                  <Icon name='refresh'/>
                  Tax
                </Button>
                <Button id='odion/transactions' onClick={this.refreshGSheet}>
                  <Icon name='refresh'/>
                  Odion Transaction
                </Button>
            </Button.Group>
          </div>
      );
  }

}

export default RefreshGoogleSheets;