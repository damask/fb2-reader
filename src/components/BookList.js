import React from 'react';
import {PureComponent} from "react";
import {getAllBooks} from "../db";
import {BookImporter} from "./BookImporter";

export class BookList extends PureComponent {
    constructor() {
        super();

        setTimeout(async () => this.books = await getAllBooks(), 1000);
        this.state = {
            books: []
        }
    }

    render() {
        const { books } = this.state;
        return (
            <div>
                <BookImporter></BookImporter>
            </div>
        );
    }
}
