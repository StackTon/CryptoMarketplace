import React, { Component } from 'react';
import Input from "../common/Input";
import { getWeb3, contractABI, contractAddress } from "../../api/remote";

export default class WithdrawalMoneyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            web3: null,
            contractBalance: ""
        }

        this.withdrawal = this.withdrawal.bind(this);
        this.getContractBalance = this.getContractBalance.bind(this);
    }

    componentDidMount() {
        getWeb3.then(results => {
            this.setState({
                web3: results.web3
            })

            this.getContractBalance();

        }).catch((err) => {
            console.log(err);
            console.log('Error finding web3.')
        })
    }

    getContractBalance() {
        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        this.state.web3.eth.getAccounts((error, accounts) => {
            cryotoMarketplaceInstance.getContractBalance.call({from: accounts[0]}, (err, res) => {
                if(err){
                    console.log(err);
                    return;
                }

                this.setState({contractBalance: res.toString()});
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
        return (
            <div className="container">
                <h1>Withdrawal Money</h1>
                <p>contract balance: {this.state.contractBalance}</p>
                <button onClick={this.withdrawal}>Withdrawal</button>
            </div>
        );
    }
}