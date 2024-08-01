import {React, Component} from 'react'
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

import {submitExpenseForm} from './api/FormAPIManager.js'

class FormExpense extends Component {

  state = {
    formInProgress: false
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = async() => {
    this.setState({formInProgress: true});
    const { head, amount, comment } = this.state
    try {
      await submitExpenseForm(head, amount, comment);
      this.setState({ head: '', amount: '', comment: '' });
    } catch(err) {
      alert(err);
    }
    this.setState({formInProgress: false});
  }

  render() {
    const { head, amount, comment, formInProgress } = this.state

    return (
      <Segment raised color="brown">
        <Dimmer active={formInProgress}>
          <Loader>Submitting</Loader>
        </Dimmer>
        <Label ribbon size="huge">Expense Entry Form</Label>
        <Divider />
        <Form inverted size="large" onSubmit={this.handleSubmit} success error>
          <Segment inverted color="brown">
            <FormInput label="Head" placeholder='Head' name='head' value={head} onChange={this.handleChange} width={6} required />
            <FormInput label="Amount" placeholder='Amount' name='amount' value={amount} onChange={this.handleChange} width={5} required type="number"/>
            <FormInput label="Comment" placeholder='Comment' name='comment' value={comment} onChange={this.handleChange} width={10}  />
          </Segment>
          <Button type='submit' loading={formInProgress} color='teal' size='large' icon labelPosition='right'>
            Submit
            <Icon name='send' />
          </Button>
        </Form>
      </Segment>
    )
  }
}

export default FormExpense
