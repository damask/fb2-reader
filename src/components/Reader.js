import React from 'react';
import {PureComponent} from "react";
import {getBook} from "../db";

export class Reader extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {book: null};
    }

    async componentDidMount() {
        this.state.book = await getBook(this.props.match.params.hash);
        this.forceUpdate();
    }

    render() {
        const book = this.state.book;
        return (
            <div>
                { book &&
                    <div style={{maxWidth: 600}}>
                        <h1>{book.title}</h1>
                        <div><img src={book.image} align="left" style={{maxHeight:200, margin: 4}}></img>{book.annotation}</div>
                    </div>
                }
            </div>
        )
    }
}
