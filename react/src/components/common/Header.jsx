import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { getWeb3, contractABI, contractAddress } from "../../api/remote";

export default class Header extends Component {
    constructor(props) {
        super(props);

        const { web3, contractInterface } = this.props;

        this.state = {
            web3,
            contractInterface,
            owner: "",
            currentAddress: ""
        }

        this.getOwner = this.getOwner.bind(this);
        this.getCurrnetAddress = this.getCurrnetAddress.bind(this);
        this.isOwner = this.isOwner.bind(this);
    }

    componentDidMount() {
        getWeb3.then(results => {
            this.setState({
                web3: results.web3,
                contractInterface: results.web3.eth.contract(contractABI).at(contractAddress)
            });

            this.getCurrnetAddress();
            this.getOwner();
        }).catch((err) => {
            console.log(err);
            console.log('Error finding web3.')
        })
    }

    getCurrnetAddress() {
        this.state.web3.eth.getAccounts((error, accounts) => {
            this.setState({ currentAddress: accounts[0] })
        })
    }

    getOwner() {
        this.state.contractInterface.owner.call((err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log(res);
            this.setState({ owner: res });

        })
    }

    isOwner() {
        return this.state.owner === this.state.currentAddress
    }

    render() {
        return (
            <header>
                <div>
                    <NavLink exact to="/" activeClassName="active">Home</NavLink>
                    <NavLink exact to="/products" activeClassName="active">All Products</NavLink>
                    {this.isOwner() ? <NavLink exact to="/new" activeClassName="active">New product</NavLink> : ""}
                    {this.isOwner() ? <NavLink exact to="/chage-owner" activeClassName="active">Chage Owner</NavLink> : ""}
                    {this.isOwner() ? <NavLink exact to="/withdrawal" activeClassName="active">Withdrawal</NavLink> : ""}
                </div>
            </header>
        );
    }
}