import React, { Component } from 'react';
import Input from "../common/Input";
import { getWeb3, contractABI, contractAddress } from "../../api/remote";
import toastr from 'toastr';

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text) {
    let cipher = crypto.createCipher(algorithm, password)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    let decipher = crypto.createDecipher(algorithm, password)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

export default class NewProductPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            price: "",
            quantity: "",
            web3: null,
            owner: " ",
            coinbase: " "
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.createProductHandler = this.createProductHandler.bind(this);
        this.getOwner = this.getOwner.bind(this);
    }

    componentDidMount() {
        getWeb3.then(results => {
            let coinbase = results.web3.eth.coinbase;
            this.setState({
                web3: results.web3,
                coinbase
            })
            this.getOwner()


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

            this.setState({ owner: res })
            if (this.state.coinbase !== this.state.owner) {
                this.props.history.push('/');
            }
        })
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    createProductHandler(e) {
        e.preventDefault();

        if (this.state.name.length === 0) {
            toastr.error("Name must at leat one char long!")
            return;
        }

        if (this.state.name.length > 9) {
            toastr.error("Name mustn't be more then 9 char long!")
            return;
        }

        if (this.state.price < 100000000000000) {
            toastr.error("Price must be above then 100000000000000!")
            return;
        }

        if (this.state.price > 10000000000000000000000) {
            toastr.error("Price must be below 10000000000000000000000!")
            return;
        }

        if (this.state.quantity.length === 0) {
            toastr.error("Quantity is not written!");
            return;
        }

        if (this.state.quantity == 0) {
            toastr.error("Quantity must be more then zero!");
            return;
        }

        

        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        let priceInEth = this.state.web3.fromWei(this.state.price, "ether").toString();

        const ID = encrypt(this.state.name + ":" + priceInEth);
        this.state.web3.eth.getAccounts((error, accounts) => {
            cryotoMarketplaceInstance.newProduct(ID, this.state.name, this.state.price, this.state.quantity, { from: accounts[0] }, (err, res) => {
                if (err) {
                    console.log(err);
                    toastr.error("There was an error with creating the product!");
                    return;
                }

                console.log(res);
                toastr.success("Product was created successfully!")
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
            <div className="new">
                <form action="">
                    <h1>New Product</h1>

                    <Input
                        name="name"
                        value={this.state.name}
                        onChange={this.onChangeHandler}
                        label="Name"
                        type="text" />
                    <Input
                        name="price"
                        value={this.state.price}
                        onChange={this.onChangeHandler}
                        label="Price"
                        type="number" />
                    <Input
                        name="quantity"
                        value={this.state.quantity}
                        onChange={this.onChangeHandler}
                        label="Quantity"
                        type="number" />


                    <button className="button" onClick={this.createProductHandler}>Create new produtc</button>
                </form>

            </div>
        );
    }
}