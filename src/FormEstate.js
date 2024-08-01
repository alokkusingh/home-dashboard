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
  Dropdown,
  Select,
  FormField,
} from 'semantic-ui-react'
import {submitEstateForm} from './api/FormAPIManager.js'

const account = [
    {
      key: 'Adarsh',
      text: 'Adarsh',
      value: 'Adarsh',
      name: 'Adarsh'
    },
    {
      key: 'Interest_Adarsh',
      text: 'Interest Adarsh',
      value: 'Interest_Adarsh',
      name: 'Interest_Adarsh'
    },
    {
      key: 'Misc_Adarsh',
      text: 'Misc Adarsh',
      value: 'Misc_Adarsh',
      name: 'Misc_Adarsh'
    },
    {
      key: 'Odion',
      text: 'Odion',
      value: 'Odion',
      name: 'Odion'
    },
    {
      key: 'Interest',
      text: 'Odion Interest',
      value: 'Interest',
      name: 'Interest'
    },
    {
      key: 'Misc',
      text: 'Misc Odion',
      value: 'Misc',
      name: 'Misc'
    },
    {
      key: 'SBI Max Gain',
      text: 'SBI Max Gain',
      value: 'SBI Max Gain',
      name: 'SBI Max Gain'
    },
    {
      key: 'BoB Advantage',
      text: 'BoB Advantage',
      value: 'BoB Advantage',
      name: 'BoB Advantage'
    },
    {
      key: 'Saving',
      text: 'Saving',
      value: 'Saving',
      name: 'Saving'
    },
  ];

class FormEstate extends Component {

  state = {
    formInProgress: false
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = async() => {
    this.setState({formInProgress: true});
    const { particular, debitFrom, creditTo, amount } = this.state
    try {
      await submitEstateForm(particular, debitFrom, creditTo, amount);
      this.setState({ particular: '', amount: '', debitFrom: '', creditTo: '' });
    } catch(err) {
      alert(err);
    }
    this.setState({formInProgress: false});
  }

  render() {
    const { particular, debitFrom, creditTo, amount, formInProgress } = this.state

    return (
      <Segment inverted color="brown">
        <Label ribbon size="huge">Real Estate Transaction Entry Form</Label>
        <Divider />
        <Form inverted size="large" onSubmit={this.handleSubmit} >
          <FormInput label="Particular" placeholder='Particular' name='particular' value={particular} onChange={this.handleChange} width={6} required />
          <FormInput label="Amount" placeholder='Amount' name='amount' value={amount} onChange={this.handleChange} width={5} required type="number"/>
          <FormGroup widths='head'>
              <FormInput
                control={Select}
                options={account}
                label={{ children: 'Debit From', htmlFor: 'debitFrom' }}
                searchInput={{ id: 'debitFrom' }}
                placeholder='Debit From'
                name='debitFrom'
                value={debitFrom}
                onChange={this.handleChange}
                width={6}
                required />
              <FormInput
                control={Select}
                options={account}
                label={{ children: 'Credit To', htmlFor: 'creditTo' }}
                searchInput={{ id: 'creditTo' }}
                placeholder='Credit To'
                name='creditTo'
                value={creditTo}
                onChange={this.handleChange}
                width={6}
                required />
          </FormGroup>
          <Button type='submit' color='teal' loading={formInProgress} >Submit</Button>
        </Form>
      </Segment>
    )
  }
}

export default FormEstate
