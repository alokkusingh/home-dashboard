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
  Header
} from 'semantic-ui-react'

import {submitExpenseForm} from './api/FormAPIManager.js'

class FormExpense extends Component {

  state = {}

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const { head, amount, comment } = this.state
    submitExpenseForm(head, amount, comment);
    this.setState({ head: '', amount: '', comment: '' });
  }

  render() {
    const { head, amount, comment } = this.state

    return (
      <Segment inverted color="brown">
        <Label ribbon size="huge">Expense Entry From</Label>
        <Divider />
        <Form inverted size="large" onSubmit={this.handleSubmit} success error>
          <FormInput label="Head" placeholder='Head' name='head' value={head} onChange={this.handleChange} width={6} required />
          <FormInput label="Amount" placeholder='Amount' name='amount' value={amount} onChange={this.handleChange} width={5} required type="number"/>
          <FormInput label="Comment" placeholder='Comment' name='comment' value={comment} onChange={this.handleChange} width={10}  />
          <Button type='submit'  color='teal'>Submit</Button>
        </Form>
      </Segment>
    )
  }
}

export default FormExpense
