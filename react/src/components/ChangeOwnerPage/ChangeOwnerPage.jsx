import React, { Component } from 'react';
import Input from "../common/Input";
import { getWeb3, contractABI, contractAddress } from "../../api/remote";

export default class ChangeOwnerPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            address: "",
            web3: null,
            owner: ""
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.chageOwnerHandler = this.chageOwnerHandler.bind(this);
        this.getOwner = this.getOwner.bind(this);
        
    }

    componentDidMount() {
        getWeb3.then(results => {
            this.setState({
                web3: results.web3
            })
            
            this.getOwner();
        }).catch((err) => {
            console.log(err);
            console.log('Error finding web3.')
        })
    }

    onChangeHandler(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    getOwner() {
        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        cryotoMarketplaceInstance.owner.call((err, res) => {
            if(err) {
                console.log(err);
                return;
            }

            console.log(res);
            this.setState({owner: res});

        })
    }

    chageOwnerHandler(e){
        console.log("here")
        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        this.state.web3.eth.getAccounts((error, accounts) => { 
            cryotoMarketplaceInstance.transferOwnership(this.state.address, {from: accounts[0]}, (err, res) => {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log(res);
            })
        })
    }

    render() {
        return (
            <div className="container">
                <h1>Change Owner</h1>
                <p>current owner: {this.state.owner}</p>
                <Input
                    name="address"
                    value={this.state.address}
                    onChange={this.onChangeHandler}
                    label="Address"
                    type="text" />
                <button onClick={this.chageOwnerHandler}>Change owner</button>
            </div>
        );
    }
}