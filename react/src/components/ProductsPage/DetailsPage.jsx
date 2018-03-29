import React, { Component } from 'react';
import { getWeb3, contractABI, contractAddress } from "../../api/remote";
import Input from "../common/Input";

export default class DetailsPage extends Component {
    constructor(props) {
        super(props);

        let productId = props.match.params.id;

        this.state = {
            productId,
            web3: null,
            productName: "",
            productPrice: "",
            productQuantity: "",
            quantity: "",
            newQuantity: "",
            currentAccount: "",
            owner: " ",
            coinbase: ""
        }

        this.getProduct = this.getProduct.bind(this);
        this.buyHandler = this.buyHandler.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.getOwner = this.getOwner.bind(this);
        this.getCurrnetAddress = this.getCurrnetAddress.bind(this);
        this.isOwner = this.isOwner.bind(this);
    }

    componentDidMount() {
        getWeb3.then(results => {
            this.setState({
                web3: results.web3
            })
            let coinbase = this.state.web3.eth.coinbase;
            this.setState({ coinbase })
            this.getCurrnetAddress();
            this.getOwner();
            this.getProduct();
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
        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);
        cryotoMarketplaceInstance.owner.call((err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log(res);
            this.setState({ owner: res });

        })
    }

    getProduct() {
        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        cryotoMarketplaceInstance.getProduct.call(this.state.productId, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            this.setState({
                productName: res[0],
                productPrice: res[1].toString(),
                productQuantity: res[2].toString()
            });
            console.log(this.state);
        })
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    buyHandler(e) {
        e.preventDefault();

        // TODO validate input

        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        this.state.web3.eth.getAccounts((error, accounts) => {

            cryotoMarketplaceInstance.buy(this.state.productId, this.state.quantity, { from: accounts[0], value: this.state.productPrice * this.state.quantity }, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log(res);
            })
        })
    }

    updateHandler(e) {
        e.preventDefault();

        // TODO validate input

        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        this.state.web3.eth.getAccounts((error, accounts) => {
            cryotoMarketplaceInstance.update(this.state.productId, this.state.newQuantity, { from: accounts[0] }, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log(res);
            })
        })
    }

    isOwner() {
        return this.state.owner === this.state.currentAddress
    }

    render() {
        if (this.state.web3 === null) {
            return (
                <div className="container">
                    <h1>Please install metamask or check if it works correct</h1>
                </div>
            );
        }
        if (this.state.coinbase === null) {
            return (
                <div className="container">
                    <h1>Please unlock your metamask</h1>
                </div>
            );
        }
        return (
            <div className="container">
                <article>
                    <h1>{this.state.productName}</h1>
                    <p>Price: {this.state.productPrice} wai</p>
                    <p>Quantity: {this.state.productQuantity}</p>
                    <Input
                        name="quantity"
                        value={this.state.quantity}
                        onChange={this.onChangeHandler}
                        label="Quantity"
                        type="number" />
                    <button onClick={this.buyHandler}>Buy</button>
                    {this.isOwner() ? <div>
                        <Input
                            name="newQuantity"
                            value={this.state.newQuantity}
                            onChange={this.onChangeHandler}
                            label="NewQuantity"
                            type="number" />
                        <button onClick={this.updateHandler}>Update</button>
                    </div> : ""}
                </article>
            </div>
        );
    }
}