import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Col } from 'reactstrap';
import AppNavbar from './AppNavbar';

class UploadExpense extends Component {
  emptyItem = {
        // Initially, no file is selected
        file: null
  };

  constructor(props) {
      super(props);
      this.state = {
          item: this.emptyItem
      };
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
      event.preventDefault();

      const selectedFile = event.target.input.files[0];
      console.log('Selected File', selectedFile);
      var data = new FormData();
      data.append('file', selectedFile);
      console.log('Form', data);

      await fetch('/fin/expense/upload', {
          method: 'POST',
          headers: {
              'Accept': 'application/json'
          },
          body: data,
      });
      this.props.history.push('/expenses');
  }


   render() {
        const title = <h3>Upload Expense</h3>;

        return <div teal lighten-5>
              <AppNavbar/>
              <Container>
                        {title}
                  <Form onSubmit={this.handleSubmit} >
                       <FormGroup row>
                            <Label for="input" sm={3}>
                              File
                            </Label>
                            <Col sm={10}>
                                <Input
                                  id="input"
                                  name="input"
                                  type="file"
                                />
                            </Col>
                       </FormGroup>
                       <br/>
                       <br/>
                       <br/>
                       <br/>
                       <br/>
                       <Button color="primary" outline type="submit">Submit</Button>
                  </Form>
              </Container>
        </div>
    }
}

export default withRouter(UploadExpense);
