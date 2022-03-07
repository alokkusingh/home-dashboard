import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormText, Col } from 'reactstrap';
import AppNavbar from './AppNavbar';

class UploadStatement extends Component {
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
      const {item} = this.state;

      const selectedFile = event.target.input.files[0];
      console.log('Selected File', selectedFile);
      var data = new FormData();
      data.append('file', selectedFile);
      console.log('Form', data);

      await fetch('http://jgte:8081/fin/bank/statement/upload', {
          method: 'POST',
          headers: {
              'Accept': 'application/json'
          },
          body: data,
      });
      this.props.history.push('/transactions');
  }


   render() {
        const {item} = this.state;
        const title = <h3>Upload Statement</h3>;

        return <div>
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

export default withRouter(UploadStatement);
