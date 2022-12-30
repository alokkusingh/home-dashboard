import React, {Component} from 'react';
import {Navbar, NavbarBrand, NavbarText} from 'reactstrap';
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
            <NavbarBrand  className="card-panel teal lighten-2" href="/">
              <img alt="logo" src="/logo512.png" style={{ height: 55, width: 55 }} />
            </NavbarBrand>
            <NavbarText>Home Dashboard</NavbarText>
        </Navbar>
    }
}