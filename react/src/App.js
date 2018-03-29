import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Header from './components/common/Header';
import HomePage from './components/HomePage/HomePage';
import AllProducts from './components/ProductsPage/AllProducts';
import DetailsPage from './components/ProductsPage/DetailsPage';
import ChangeOwnerPage from './components/ChangeOwnerPage/ChangeOwnerPage';
import NewProductPage from './components/NewProductPage/NewProductPage';
import WithdrawalMoneyPage from './components/WithdrawalMoneyPage/WithdrawalMoneyPage';
import { getWeb3, contractABI, contractAddress } from "./api/remote";

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <Header />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/products" component={AllProducts} />
                    <Route exact path="/new" component={NewProductPage} />
                    <Route exact path="/product/:id" component={DetailsPage} />
                    <Route exact path="/chage-owner" component={ChangeOwnerPage} />
                    <Route exact path="/withdrawal" component={WithdrawalMoneyPage} />
                </Switch>
            </div>
        );
    }
}

export default withRouter(App);