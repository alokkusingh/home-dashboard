import React, { Component } from 'react';
import { Grid, Menu, Segment, Icon, Divider } from 'semantic-ui-react';
import { Table, Card, Row, Col } from 'reactstrap';
import HomeCard from './HomeCards'
import TransactionList from './TransactionList';
import ExpenseList from './ExpenseList';
import Salary from './Salary';
import UploadFile from './UploadFile';
import RefreshGoogleSheets from './RefreshGoogleSheets';
import OdionTransactionList from './OdionTransactionList';

export default class MenuBarWithContent extends Component {
  state = { activeItem: 'Summary' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    function LoadPage(props) {
      const page = props.page;

      if (page === 'Summary') {
        return <HomeCard />;
      }
      if (page === 'Transaction') {
        return <TransactionList />;
      }
      if (page === 'Expense') {
        return <ExpenseList />;
      }
      if (page === 'Salary') {
        return <Salary />;
      }
      if (page === 'UploadFile') {
        return <UploadFile />;
      }
      if (page === 'Refresh') {
        return <RefreshGoogleSheets />;
      }
      if (page === 'o-Trans') {
        return <OdionTransactionList />;
      }

      return <TbdPage />;
    }

    function TbdPage() {
      return <div id="tbd" align="center" >
      <Row>
          <Col >
              <Card className="card-panel teal lighten-4" textClassName="black-text" >
                  <div>
                       Coming Soon...
                  </div>
              </Card>
          </Col>
          </Row>
      </div>
    }

    return (
    <div>
      <Grid>
        <Grid.Column width={2}>
          <Menu fluid vertical tabular>
            <Menu.Header>
              <Icon name='rupee sign'/>
              Finance
            </Menu.Header>
            <Menu.Menu>
              <Menu.Item name='Summary' active={activeItem === 'Summary'} onClick={this.handleItemClick} >
                <Icon name='newspaper outline'/>
                Summary
              </Menu.Item>
              <Menu.Item name='Expense' active={activeItem === 'Expense'} onClick={this.handleItemClick} >
                <Icon name='credit card outline'/>
                Expense
              </Menu.Item>
              <Menu.Item name='Salary' active={activeItem === 'Salary'} onClick={this.handleItemClick} >
                <Icon name='money bill alternate outline'/>
                Salary
              </Menu.Item>
              <Menu.Item name='Transaction' active={activeItem === 'Transaction'} onClick={this.handleItemClick} >
                <Icon name='list ol'/>
                Transaction
              </Menu.Item>
              <Menu.Item name='UploadFile' active={activeItem === 'UploadFile'} onClick={this.handleItemClick} >
                <Icon name='upload'/>
                Upload File
              </Menu.Item>
              <Menu.Item name='Refresh' active={activeItem === 'Refresh'} onClick={this.handleItemClick} >
                <Icon name='refresh'/>
                Refresh
              </Menu.Item>
              </Menu.Menu>

              <Divider horizontal/>

              <Menu.Header>
                <Icon name='heartbeat'/>
                Health
              </Menu.Header>
              <Menu.Menu>
                <Menu.Item name='h-Alok' active={activeItem === 'h-Alok'} onClick={this.handleItemClick} >
                  <Icon name='male'/>
                  Alok
                </Menu.Item>
                <Menu.Item name='h-Rachna' active={activeItem === 'h-Rachna'} onClick={this.handleItemClick} >
                  <Icon name='female'/>
                  Rachna
                </Menu.Item>
                <Menu.Item name='h-Saanvi' active={activeItem === 'h-Saanvi'} onClick={this.handleItemClick} >
                  <Icon name='child'/>
                  Saanvi
                </Menu.Item>
            </Menu.Menu>

            <Divider horizontal/>

            <Menu.Header>
              <Icon name='database'/>
              Data
            </Menu.Header>
            <Menu.Menu>
              <Menu.Item name='timeline' active={activeItem === 'timeline'} onClick={this.handleItemClick} >
                <Icon name='calendar alternate outline'/>
                Timeline
              </Menu.Item>
              <Menu.Item name='document' active={activeItem === 'document'} onClick={this.handleItemClick} >
                <Icon name='file alternate outline'/>
                Document
              </Menu.Item>
            </Menu.Menu>

            <Divider horizontal/>

            <Menu.Header>
              <Icon name='building outline'/>
              Odion
            </Menu.Header>
            <Menu.Menu>
              <Menu.Item name='o-Summary' active={activeItem === 'o-Summary'} onClick={this.handleItemClick} >
                <Icon name='newspaper outline'/>
                Summary
              </Menu.Item>
              <Menu.Item name='o-Land' active={activeItem === 'o-Land'} onClick={this.handleItemClick} >
                <Icon name='map marker alternate'/>
                Land
              </Menu.Item>
              <Menu.Item name='o-Construction' active={activeItem === 'o-Construction'} onClick={this.handleItemClick} >
                <Icon name='question circle outline'/>
                Construction
              </Menu.Item>
              <Menu.Item name='o-Loan' active={activeItem === 'o-Loan'} onClick={this.handleItemClick} >
                <Icon name='question circle outline'/>
                Loan
              </Menu.Item>
              <Menu.Item name='o-Trans' active={activeItem === 'o-Trans'} onClick={this.handleItemClick} >
                <Icon name='list ol'/>
                Transactions
              </Menu.Item>
            </Menu.Menu>

          </Menu>
        </Grid.Column>

        <Grid.Column stretched width={14}>
          <Segment>
            <LoadPage page={activeItem} />
          </Segment>
        </Grid.Column>
      </Grid>
      </div>
    )
  }
}