import React, { Component } from 'react';
import Input from "../common/Input";
import { getWeb3, contractABI, contractAddress } from "../../api/remote";
import toastr from 'toastr';

export default class ChangeOwnerPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            address: "",
            web3: null,
            owner: " ",
            coinbase: " "
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.chageOwnerHandler = this.chageOwnerHandler.bind(this);
        this.getOwner = this.getOwner.bind(this);

    }

    componentDidMount() {
        getWeb3.then(results => {
            let coinbase = results.web3.eth.coinbase;
            this.setState({
                web3: results.web3,
                coinbase
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
            if (err) {
                console.log(err);
                return;
            }


            this.setState({ owner: res });
            if (this.state.coinbase !== this.state.owner) {
                this.props.history.push('/');
            }

        })
    }

    chageOwnerHandler(e) {
        e.preventDefault()

        if (this.state.address.length !== 42) {
            toastr.error("Address must be at least 42 chars long!");
            return;
        }

        if (!this.state.web3.isAddress(this.state.address)) {
            toastr.error("Address is not correct!");
            return;
        }

        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        this.state.web3.eth.getAccounts((error, accounts) => {
            cryotoMarketplaceInstance.transferOwnership(this.state.address, { from: accounts[0] }, (err, res) => {
                if (err) {
                    console.log(err);
                    toastr.error("There was an error with transfering ownership!");
                    return;
                }
                toastr.success("Transfer ownership was successful!")
                console.log(res);
            })
        })
    }

    render() {
        if (this.state.web3 === null) {
            return (
                <div className="no-metatask">
                    <h1>Please install metamask or check if it works correct</h1>
                </div>
            );
        }
        if (this.state.coinbase !== this.state.owner) {
            return (
                <div className="not-owner">
                    <h1>You dont have permission to use this route</h1>
                </div>
            );
        }
        return (
            <div className="change-owner">
                <form>
                    <h1>Change Owner</h1>
                    <p>Current owner: <strong>{this.state.owner}</strong></p>
                    <Input
                        name="address"
                        value={this.state.address}
                        onChange={this.onChangeHandler}
                        label="Address"
                        type="text" />
                    <button className="button" onClick={this.chageOwnerHandler}>Change owner</button>
                </form>
            </div>
        );
    }
}