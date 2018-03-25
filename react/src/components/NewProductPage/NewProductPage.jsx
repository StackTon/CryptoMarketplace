import React, { Component } from 'react';
import Input from "../common/Input";
import { getWeb3, contractABI, contractAddress } from "../../api/remote";

export default class NewProductPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            price: "",
            quantity: "",
            web3: null
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.createProductHandler = this.createProductHandler.bind(this);
    }

    componentDidMount() {
        getWeb3.then(results => {
            this.setState({
                web3: results.web3
            })
        

        }).catch((err) => {
            console.log(err);
            console.log('Error finding web3.')
        })
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    createProductHandler(e) {
        e.preventDefault();

        // TODO validate input

        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        this.state.web3.eth.getAccounts((error, accounts) => {
            cryotoMarketplaceInstance.newProduct(this.state.name, this.state.price, this.state.quantity, {from: accounts[0]}, (err, res) => {
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