import React, {useEffect, useState} from 'react';
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

export function BookList(props) {

    const [books, setBooks] = useState([]);
    const [book, setBook] = useState(null);


    Events.on(Events.BOOK_ADDING).do(event => {
        setBook(event.detail.book);
    });
    Events.on(Events.BOOK_ADDED).do(async event => {
        setBook(null);
        setBooks(await getAllBooks());
    });


    useEffect(() => {
        (async () => setBooks(await getAllBooks()))();
    }, []);


    const readBook = book => props.history.push(`/read/${book.hashHex}`);

    return (
        <div>
            <BookImporter></BookImporter><br/>
            <div id="list">
                {
                    book &&
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
                                avatar={<Avatar src={book.image} role="presentation"/>}
                            />
                            <CardActions expander>
                                <Button flat onClick={() => readBook(book)}>Read</Button>
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

