import React from 'react';
import {PureComponent} from "react";
import {getBook, getRootSection, getSections} from "../db";

export class Reader extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            book: null,
            topSection: null
        };
    }

    async componentDidMount() {
        const book = await getBook(this.props.match.params.hash);
        const topSection = await getRootSection(book.hasHex);
        this.state.book = book;
        this.state.topSection =
        this.state.children = await getSections(topSection.id);
        this.forceUpdate();
    }

    render() {
        const { book, topSection, children } = this.state;
        debugger
        return (
            <div>
                { book &&
                    <div style={{maxWidth: 600}}>
                        <h1>{book.title}</h1>
                        <div><img src={book.image} align="left" style={{maxHeight:200, margin: 4}}/>{book.annotation}</div>
                        <h3>{topSection.title}</h3>
                    </div>
                }
            </div>
        )
    }
}
