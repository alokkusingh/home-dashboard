import React, { Component, useState, useEffect } from 'react';
import { Table, Row, Col, Modal, ModalHeader} from 'reactstrap';
import { Button } from 'semantic-ui-react'

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
          <div style={{float: 'right'}}>
              <Row>
                <Col align="middle">
                  <Button.Group basic size='small'>
                    <Button icon='refresh' id='expense' onClick={this.refreshSheet}></Button>
                  </Button.Group>
                  <br/>
                  Expense
                  </Col>
                  <Col align="middle">
                    <Button.Group basic size='small'>
                      <Button icon='refresh' id='investment' onClick={this.refreshSheet}></Button>
                    </Button.Group>
                    <br/>
                    Investment
                  </Col>
                  <Col align="middle">
                    <Button.Group basic size='small'>
                      <Button icon='refresh' id='tax' onClick={this.refreshSheet}></Button>
                    </Button.Group>
                    <br/>
                    Tax
                  </Col>
              </Row>
          </div>
      );
  }

}

export default RefreshGoogleSheets;