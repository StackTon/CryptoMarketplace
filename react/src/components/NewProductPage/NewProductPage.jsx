import React, { Component } from 'react';
import Input from "../common/Input";

export default class NewProductPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            price: "",
            quantity: ""
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
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


                <button>Create new produtc</button>

            </div>
        );
    }
}