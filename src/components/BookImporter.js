import React from 'react';
import {PureComponent} from "react";
import {FontIcon} from "react-md";
import { Button, SVGIcon } from 'react-md';
import {Fb2Parser} from "../fb2Parser";

export class BookImporter extends PureComponent {
    constructor() {
        super();
        this.state = {
            loading: false
        };

        this.fileInput = React.createRef();
    }

    change = (event) => {
        const file = event.target.files[0];
        this.state.loading = true;
        const reader = new FileReader();
        reader.addEventListener('load', async event => {
            debugger
            try {
                const xml = event.target.result;
                const parser = new Fb2Parser(xml);
                const book = await parser.parseDescription();

                if (parser.isAlreadyAdded) {
                    // Events.dispatch(Events.BOOK_ALREADY_ADDED, {book});
                    return;
                }

                // Events.dispatch(Events.BOOK_ADDING, {book});
                await parser.parseBody();
                // Events.dispatch(Events.BOOK_ADDED, {book});
            } catch (e) {
                console.error('error when parsing', e);
            } finally {
                this.state.loading = false;
            }
        });
        reader.readAsText(file);
    }

    render() {
        return (
            <div>
                <Button floating primary mini onClick={() => this.fileInput.current.click()}>add</Button>
                <input type="file" id="file-selector" onChange={this.change} ref={this.fileInput}/>
            </div>
        );
    }
}
