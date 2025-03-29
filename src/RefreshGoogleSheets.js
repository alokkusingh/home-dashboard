import React, { Component } from 'react';
//import { Button, Icon } from 'semantic-ui-react';
import './css/App.css';
import {refreshSheet} from './api/GSheetAPIManager.js'
import {
  FormInput,
  FormGroup,
  FormCheckbox,
  Button,
  ButtonGroup,
  ButtonContent,
  Form,
  Segment,
  Message,
  Divider,
  Label,
  Container,
  Header,
  Icon,
  Dimmer,
  Loader
} from 'semantic-ui-react'
import {postHeadersJson, fetch_retry_async_json} from './api/APIUtils'
import {subscribeForEventJson} from './api/EventAPIManager.js'


class RefreshGoogleSheets extends Component {

  state = {
    expenseRefreshInProgress: false,
    taxRefreshInProgress: false,
    investmentRefreshInProgress: false,
    estateRefreshInProgress: false,
  }


  // Function to process each chunk of data
  eventCallback = async(data) => {
  };

  refreshExpenseGSheet = async(e) => {
    this.setState({expenseRefreshInProgress: true});
    try {
      await refreshSheet('expense');
    } catch(err) {
      alert("Expense Refresh failed, error: " + err);
    }
    this.setState({expenseRefreshInProgress: false});
  }
  refreshTaxGSheet = async(e) => {
    this.setState({taxRefreshInProgress: true});
    subscribeForEventJson("abc");
    try {
      await refreshSheet('tax');
    } catch(err) {
      alert("Tax Refresh failed, error: " + err);
    }
    this.setState({taxRefreshInProgress: false});
  }
  refreshInvestmentGSheet = async(e) => {
    this.setState({investmentRefreshInProgress: true});
    try {
      await refreshSheet('investment');
    } catch(err) {
      alert("Investment Refresh failed, error: " + err);
    }
    this.setState({investmentRefreshInProgress: false});
  }
  refreshEstateGSheet = async(e) => {
    this.setState({estateRefreshInProgress: true});
    try {
      await refreshSheet('odion/transactions');
    } catch(err) {
      alert("Estate Refresh failed, error: " + err);
    }
    this.setState({estateRefreshInProgress: false});
  }

  render() {
      const { expenseRefreshInProgress, taxRefreshInProgress, investmentRefreshInProgress, estateRefreshInProgress} = this.state

      return (
          <Segment raised color="grey">
            <Label ribbon size="huge">Refresh Sheet</Label>
            <Divider />
            <Segment inverted color="grey">
              <ButtonGroup>
                  <Button animated="vertical" loading={expenseRefreshInProgress} onClick={this.refreshExpenseGSheet} color='blue' size='large' >
                   <ButtonContent visible>Expense</ButtonContent>
                   <ButtonContent hidden>
                     <Icon name='refresh' />
                   </ButtonContent>
                  </Button>
                  <Button animated="vertical" loading={investmentRefreshInProgress} onClick={this.refreshInvestmentGSheet} color='green' size='small' >
                   <ButtonContent visible>Investment</ButtonContent>
                   <ButtonContent hidden>
                     <Icon name='refresh' />
                   </ButtonContent>
                  </Button>
                  <Button animated="vertical" loading={estateRefreshInProgress} onClick={this.refreshEstateGSheet} color='brown' size='small' >
                   <ButtonContent visible>Estate</ButtonContent>
                   <ButtonContent hidden>
                     <Icon name='refresh' />
                   </ButtonContent>
                  </Button>
                  <Button animated="vertical" loading={taxRefreshInProgress} onClick={this.refreshTaxGSheet} color='orange' size='small' >
                   <ButtonContent visible>Tax</ButtonContent>
                   <ButtonContent hidden>
                     <Icon name='refresh' />
                   </ButtonContent>
                  </Button>
              </ButtonGroup>
            </Segment>
          </Segment>
      );
  }

}

export default RefreshGoogleSheets;