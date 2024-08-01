import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
//import { Button, Container, Form, FormGroup, Input, Label, Col } from 'reactstrap';
import {
  FormInput,
  FormGroup,
  FormCheckbox,
  Button,
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

class UploadFile extends Component {

  state = {
    formInProgress: false
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async() => {
    this.setState({formInProgress: true});
    const { file } = this.state
    try {
      await this.uploadFile(file);
      this.setState({ file: ''});
    } catch(err) {
      alert(err);
    }
    this.setState({formInProgress: false});
  }

  uploadFile = async(data) => {

    var requestOptions = {
      method: 'POST',
      headers: postHeadersJson(),
      body: data
    };

    const responsePromise = await fetch_retry_async_json(
      '/home/etl/file/uploadx',
      requestOptions,
      1
    );
    const responseJson = await responsePromise.json();

    return responseJson;
  }

   render() {
        const { file, formInProgress } = this.state

          return (
            <Segment raised color="brown">
              <Dimmer active={formInProgress}>
                <Loader>Uploading</Loader>
              </Dimmer>
              <Label ribbon size="huge">Upload Statement</Label>
              <Divider />
              <Segment inverted color="brown">
                <Form inverted size="large" onSubmit={this.handleSubmit} success error>
                  <FormInput type="file" placeholder='File' name='file' value={file} onChange={this.handleChange} width={6} required />
                  <Button type='submit' loading={formInProgress} color='teal' size='large' icon labelPosition='right'>
                    Upload
                    <Icon name='upload' />
                  </Button>
                </Form>
              </Segment>
            </Segment>
          )
    }
}

export default UploadFile
