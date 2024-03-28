import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import './css/App.css';

class RefreshGoogleSheets extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  async componentDidMount() {
  }

  refreshSheet = (e) => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("ID_TOKEN"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };
    console.log(e);
    console.log(e.currentTarget.getAttribute("id"));
    fetch("/home/etl/gsheet/refresh/" + e.currentTarget.getAttribute("id"), requestOptions)
        .then(response => {
            console.log(response);
        }
    );

  }

  render() {
      const {
      } =  this.state;

      return (
          <div className="center">
            <Button.Group basic size='small'>
                <Button id='expense' onClick={this.refreshSheet}>
                  <Icon name='refresh'/>
                  Expense
                </Button>
                <Button id='investment' onClick={this.refreshSheet}>
                  <Icon name='refresh'/>
                  Investment
                </Button>
                <Button id='tax' onClick={this.refreshSheet}>
                  <Icon name='refresh'/>
                  Tax
                </Button>
                <Button id='odion/transactions' onClick={this.refreshSheet}>
                  <Icon name='refresh'/>
                  Odion Transaction
                </Button>
            </Button.Group>
          </div>
      );
  }

}

export default RefreshGoogleSheets;