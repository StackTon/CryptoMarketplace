import React, { Component } from 'react';
import Input from "../common/Input";

export default class WithdrawalMoneyPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <h1>Withdrawal Money</h1>
                <p>contract balance</p>
                <button>Withdrawal</button>
            </div>
        );
    }
}