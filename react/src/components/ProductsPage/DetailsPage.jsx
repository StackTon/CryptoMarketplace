import React, { Component } from 'react';

export default class DetailsPage extends Component {
    render() {
        return (
            <div className="container">
                <article>
                    <h1>Kartofi</h1>
                    <p>Price: $5</p>
                    <p>Quantity: 10</p>
                    <button>Buy</button>
                    <button>Update</button>
                </article>
            </div>
        );
    }
}