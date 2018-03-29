import React, { Component } from 'react';
import Web3 from 'web3';
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

export default class AllProductsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            web3: null,
            productsID: [],
            coinbase: ""
        }

        this.getProducts = this.getProducts.bind(this);
        this.details = this.details.bind(this);
    }

    componentDidMount() {
        getWeb3.then(results => {
            this.setState({
                web3: results.web3
            })
            let coinbase = this.state.web3.eth.coinbase;
            this.setState({coinbase})
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
            let productsID = [];

            for (let id of res) {
                let nonbyteID = this.state.web3.toAscii(id);

                let decryptID = decrypt(nonbyteID).trim().split(":");

                let obj = {
                    id: id,
                    name: decryptID[0],
                    price: decryptID[1]
                }

                productsID.push(obj);
            }

            this.setState({ productsID });
        })

    }

    details(id) {
        this.props.history.push('/product/' + id);
    }

    render() {
        if(this.state.web3 === null){
            return (
                <div className="container">
                    <h1>Please install metamask or check if it works correct</h1>
                </div>
            );
        }
        if(this.state.coinbase === null){
            return (
                <div className="container">
                    <h1>Please unlock your metamask</h1>
                </div>
            );
        }


        return (
            <div className="container">
                <h1>All Products Page</h1>
                <section>
                    {this.state.productsID.map((obj, index) => {
                        return <article key={index} onClick={() => this.details(obj.id)}>
                            <h2>{obj.name}</h2>
                            <p>price: {obj.price}</p>
                        </article>
                    })}
                </section>
            </div>
        );
    }
}