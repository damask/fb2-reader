import React from 'react';
import {PureComponent} from "react";
import {getAllBooks} from "../db";
import {BookImporter} from "./BookImporter";
import * as Events from "../events";
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardText,
    CardTitle,
} from 'react-md';

export class BookList extends PureComponent {
    constructor() {
        super();

        this.state = {
            adding: false,
            books: [],
            book: null
        };

        Events.on(Events.BOOK_ADDING).do(event => {
            this.state.adding = true;
            this.state.book = event.detail.book;
            this.forceUpdate();
        });
        Events.on(Events.BOOK_ADDED).do(event => {
            this.state.books.push(event.detail.book);
            this.state.book = null;
            this.state.adding = false;
        });
    }

    async componentDidMount() {
        this.state.books = await getAllBooks();
        this.forceUpdate();
    }

    render() {
        const style = { maxWidth: 400 };
        const { books } = this.state;
        return (
            <div>
                <BookImporter></BookImporter>
                {
                    books.map(book =>
                        <Card style={style}>
                            <CardTitle
                                title={book.title}
                                subtitle={book.author}
                                avatar={<Avatar src={book.image} role="presentation" />}
                            />
                            <CardActions expander>
                                <Button flat>Read</Button>
                                <Button flat>Delete</Button>
                            </CardActions>
                            <CardText expandable>
                                {book.annotation}
                            </CardText>
                        </Card>
                    )
                }
            </div>
        );
    }
}
