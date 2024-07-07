import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Col } from 'reactstrap';

class UploadFile extends Component {
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

      uploadFile(data)
      .then(response => {
        console.log(response.uploadType);
        if (response.uploadType === 'TaxGoogleSheet')
          this.props.history.push('/');
        else if (response.uploadType === 'InvestmentGoogleSheet')
          this.props.history.push('/');
        else if (response.uploadType === 'ExpenseGoogleSheet')
         this.props.history.push('/');
        else if (response.uploadType === 'HDFCExportedStatement')
         this.props.history.push('/');
        else if (response.uploadType === 'KotakExportedStatement')
         this.props.history.push('/');
        else
          this.props.history.push('/');
      }).catch((error) => {
        // Your error is here!
         console.log(error)
         this.props.history.push('/');
      });

      async function uploadFile(data) {

        const response =  await fetch('/home/etl/file/upload', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('ID_TOKEN')
            },
            body: data
        });

        if (!response.ok) {
          const message = `An error has occurred: ${response.status}`;
          throw new Error(message);
        }

        // waits until the request completes...
        const responseJson = await response.json();
        return responseJson;
      }
  }


   render() {
        const title = <h3>Upload a file</h3>;

        return <div teal lighten-5>
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

export default withRouter(UploadFile);
