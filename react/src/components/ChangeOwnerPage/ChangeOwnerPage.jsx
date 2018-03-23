import React, { Component } from 'react';
import Input from "../common/Input";

export default class ChangeOwnerPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            address: "",

        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div className="container">
                <h1>Change Owner</h1>
                <Input
                    name="address"
                    value={this.state.address}
                    onChange={this.onChangeHandler}
                    label="Address"
                    type="text" />
                <button>Change owner</button>
            </div>
        );
    }
}