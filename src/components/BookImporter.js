import React, {PureComponent} from 'react';
import {Button} from "react-md";
import {Fb2Parser} from "../fb2Parser";
import * as Events from "../events";

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
        // eslint-disable-next-line
        this.state.loading = true;
        const reader = new FileReader();
        reader.addEventListener('load', async event => {
            try {
                const xml = event.target.result;
                const parser = new Fb2Parser(xml);
                const book = await parser.parseDescription();

                if (parser.isAlreadyAdded) {
                    Events.dispatch(Events.BOOK_ALREADY_ADDED, {book});
                    return;
                }

                Events.dispatch(Events.BOOK_ADDING, {book});
                await parser.parseBody();
                Events.dispatch(Events.BOOK_ADDED, {book});
            } catch (e) {
                console.error('error when parsing', e);
            } finally {
                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.loading = false;
            }
        });
        reader.readAsText(file);
    }

    render() {
        return (
            <div>
                <Button floating primary style={{height: 32, width: 32, padding: 6}} onClick={() => this.fileInput.current.click()}>add</Button>
                <input type="file" id="file-selector" onChange={this.change} ref={this.fileInput}/>
            </div>
        );
    }
}
