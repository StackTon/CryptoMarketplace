import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Header extends Component {
    render() {
        const { loggedIn, onLogout } = this.props;

        return (
            <header>
                <NavLink exact to="/" activeClassName="active">Home</NavLink>
                <NavLink exact to="/products" activeClassName="active">All Products</NavLink>
                <NavLink exact to="/new" activeClassName="active">New product</NavLink>
                <NavLink exact to="/chage-owner" activeClassName="active">Chage Owner</NavLink>
                <NavLink exact to="/withdrawal" activeClassName="active">Withdrawal</NavLink>
            </header>
        );
    }
}