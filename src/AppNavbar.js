import React, {Component} from 'react';
import {Navbar, NavbarBrand} from 'reactstrap';
import {Link} from 'react-router-dom';

export default class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return <Navbar className="card-panel teal lighten-1" expand="md">
            <NavbarBrand tag={Link} to="/">
              <h2>Home Dashboard</h2>
              <h5>{this.props.title}</h5>
            </NavbarBrand>
        </Navbar>
    }
}