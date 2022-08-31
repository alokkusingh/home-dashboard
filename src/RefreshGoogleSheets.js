import React, { Component, useState, useEffect } from 'react';
import { Table, Row, Col, Modal, ModalHeader} from 'reactstrap';
import { Button, Icon } from 'semantic-ui-react';

class RefreshGoogleSheets extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  async componentDidMount() {
  }

  refreshSheet = (e) => {
    console.log(e);
    console.log(e.currentTarget.getAttribute("id"));
    fetch("/fin/gsheet/refresh/" + e.currentTarget.getAttribute("id"))
        .then(response => {
            console.log(response);
        }
    );

  }

  render() {
      const {
      } =  this.state;

      return (
          <div style={{float: 'middle'}}>
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