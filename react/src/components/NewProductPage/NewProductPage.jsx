import React, { Component } from 'react';
import Input from "../common/Input";
import { getWeb3, contractABI, contractAddress } from "../../api/remote";

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
            if(err){
                console.log(err);
                return;
            }

            this.setState({owner: res})
        })
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    createProductHandler(e) {
        e.preventDefault();

        // TODO validate input

        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        const ID = encrypt(this.state.name + ":" + this.state.price);
        this.state.web3.eth.getAccounts((error, accounts) => {
            cryotoMarketplaceInstance.newProduct(ID, this.state.name, this.state.price, this.state.quantity, { from: accounts[0] }, (err, res) => {
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
                <div className="container">
                    <h1>Please install metamask or check if it works correct</h1>
                </div>
            );
        }
        if (this.state.coinbase !== this.state.owner && this.state.owner !== " "  && this.state.coinbase !== " ") {
            this.props.history.push('/');
        }
        return (
            <div className="container">
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


                <button onClick={this.createProductHandler}>Create new produtc</button>

            </div>
        );
    }
}