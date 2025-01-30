import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
import {uploadHeadersJson, fetch_retry_async_json} from './api/APIUtils'

class UploadFile extends Component {

  state = {
    formInProgress: false
  }

  handleChange = (e, { name, value }) => {
    console.log(e);
    console.log(name);
    console.log(value);
    console.log(document.getElementById("fileInput").files[0]);
    this.setState({ [name]: value });
  }

  handleSubmit = async() => {
    this.setState({formInProgress: true});
    const { file } = this.state
    try {

      const formFile = document.getElementById("fileInput").files[0];
      const fileName = formFile.name;
      console.log('Selected File', fileName);

      let data = new FormData();
      data.append('file', formFile, fileName);
      await this.uploadFile(data);
      this.setState({ file: ''});
    } catch(err) {
      alert(err);
    }
    this.setState({formInProgress: false});
  }

  uploadFile = async(data) => {

    console.log(data)
    let requestOptions = {
      method: 'POST',
      headers: uploadHeadersJson(),
      body: data
    };

    const responsePromise = await fetch_retry_async_json(
      '/home/etl/file/upload',
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
                  <FormInput id="fileInput" type="file" placeholder='File' name='file' value={file} onChange={this.handleChange} width={6} required />
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
