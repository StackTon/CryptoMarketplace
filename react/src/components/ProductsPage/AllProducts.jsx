import React, { Component } from 'react';
import { getWeb3, contractABI, contractAddress } from "../../api/remote"

export default class AllProductsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            web3: null
        }

        this.getProducts = this.getProducts.bind(this);
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
        const cryotoCharityInstance = this.state.web3.eth.contract(contractABI).at(contractAddress);

        cryotoCharityInstance.getProducts.call((err, res) => {
            if(err){
                console.log(err);
                return;
            }

            console.log(res);
        })

    }

    render() {
        return (
            <div className="container">
                <h1>All Products Page</h1>
                <section>
                    <article>
                        <h2>Kartofi</h2>
                        <p>price: 5$</p>
                    </article>
                    <article>
                        <h2>Kartofi</h2>
                        <p>price: 5$</p>
                    </article><article>
                        <h2>Kartofi</h2>
                        <p>price: 5$</p>
                    </article><article>
                        <h2>Kartofi</h2>
                        <p>price: 5$</p>
                    </article><article>
                        <h2>Kartofi</h2>
                        <p>price: 5$</p>
                    </article><article>
                        <h2>Kartofi</h2>
                        <p>price: 5$</p>
                    </article><article>
                        <h2>Kartofi</h2>
                        <p>price: 5$</p>
                    </article><article>
                        <h2>Kartofi</h2>
                        <p>price: 5$</p>
                    </article><article>
                        <h2>Kartofi</h2>
                        <p>price: 5$</p>
                    </article><article>
                        <h2>Kartofi</h2>
                        <p>price: 5$</p>
                    </article><article>
                        <h2>Kartofi</h2>
                        <p>price: 5$</p>
                    </article>
                </section>
            </div>
        );
    }
}