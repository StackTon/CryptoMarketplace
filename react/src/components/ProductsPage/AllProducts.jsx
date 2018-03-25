import React, { Component } from 'react';
import { getWeb3, contractABI, contractAddress } from "../../api/remote";

export default class AllProductsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            web3: null,
            productsID: []
        }

        this.getProducts = this.getProducts.bind(this);
        this.details = this.details.bind(this);
    }

    componentDidMount() {
        getWeb3.then(results => {
            this.setState({
                web3: results.web3
            })
            this.getProducts();
        }).catch((err) => {
            console.log(err);
            console.log('Error finding web3.')
        })
    }

    getProducts() {
        const cryotoMarketplaceInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        cryotoMarketplaceInstance.getProducts.call((err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            this.setState({ productsID: res });
        })

    }

    details(id) {
        this.props.history.push('/product/' + id);
    }

    render() {
        console.log(this.state.productsID);
        return (
            <div className="container">
                <h1>All Products Page</h1>
                <section>
                    {this.state.productsID.map((value, index) => {
                        return <article key={index} onClick={() => this.details(value)}>{value}</article>
                    })}
                </section>
            </div>
        );
    }
}