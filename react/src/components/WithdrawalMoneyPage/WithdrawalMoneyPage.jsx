import React, { Component } from 'react';
import Input from "../common/Input";
import { getWeb3, contractABI, contractAddress } from "../../api/remote";

export default class WithdrawalMoneyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            web3: null,
            contractBalance: "",
            owner: " ",
            coinbase: " "
        }

        this.withdrawal = this.withdrawal.bind(this);
        this.getContractBalance = this.getContractBalance.bind(this);
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
            this.getContractBalance();
        }).catch((err) => {
            console.log(err);
            console.log('Error finding web3.')
        })
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

    getContractBalance() {
        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        this.state.web3.eth.getAccounts((error, accounts) => {
            cryotoMarketplaceInstance.getContractBalance.call({ from: accounts[0] }, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }

                this.setState({ contractBalance: res.toString() });
                console.log(res.toString());
            })

        })
    }

    withdrawal(e) {
        e.preventDefault();
        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        this.state.web3.eth.getAccounts((error, accounts) => {
            cryotoMarketplaceInstance.withdrawalMoney({ from: accounts[0] }, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
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
            <div className="withdrawal">
                <form>
                    <h1>Withdrawal Money</h1>
                    <p>contract balance: {this.state.contractBalance}</p>
                    <button className="button" onClick={this.withdrawal}>Withdrawal</button>
                </form>
            </div>
        );
    }
}