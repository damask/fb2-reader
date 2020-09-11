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
        const topSection = await getRootSection(book.hashHex);
        this.state.book = book;
        this.state.topSection = topSection;
        this.state.children = await getSections(topSection.id);
        this.forceUpdate();
    }

    // rendering algo
    // get first non-section element - draw: sections and element
    // get next sibling if there is - draw - intersection observer
    // ..
    // when no next sibling

    render() {
        const { book, topSection, children } = this.state;
        return (
            <div>
                { book &&
                    <div>
                        <h2>{book.title}</h2>
                        <div  style={{maxWidth: 600}}>
                            <div><img src={book.image} align="left" style={{maxHeight:200, margin: 8}} alt={book.title}/>{book.annotation}</div>
                            <br/>
                            <h3>{topSection.title}</h3>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
