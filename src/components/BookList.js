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
import './BookList.css';

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
        Events.on(Events.BOOK_ADDED).do(async event => {
            this.state.books.push(event.detail.book);
            this.state.book = null;
            this.state.books = await getAllBooks();
            this.state.adding = false;
            this.forceUpdate();
        });
        Events.on(Events.BOOK_ALREADY_ADDED).do(book => {
            //TODO Toast
        });
    }

    async componentDidMount() {
        this.state.books = await getAllBooks();
        this.forceUpdate();
    }

    render() {
        let { books, book, adding } = this.state;
        return (
            <div>
                <BookImporter></BookImporter><br/>
                <div id="list">
                    {
                        adding &&
                        <Card key={book.title} className="loading">
                            <CardTitle title={book.title}
                                       subtitle={book.author}
                                       avatar={<Avatar src={book.image} role="presentation"/>}
                            />
                            <CardActions expander>
                                <Button flat>
                                    <div className="lds-dual-ring"></div>
                                </Button>
                                <Button flat>
                                    Loading...
                                </Button>
                            </CardActions>
                            <CardText expandable expanded={true}>
                                {book.annotation}
                            </CardText>
                        </Card>
                    }
                    {
                    books.map(book =>
                        <Card key={book.title}>
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
                }</div>
            </div>
        );
    }
}
