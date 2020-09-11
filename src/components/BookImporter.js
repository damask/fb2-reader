import React from 'react';
import {Button} from "react-md";
import {Fb2Parser} from "../fb2Parser";
import * as Events from "../events";

export function BookImporter() {
    const fileInput = React.createRef();

    function change(event) {
        const file = event.target.files[0];
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
            }
        });
        reader.readAsText(file);
    }

    return (
        <div>
            <Button floating primary style={{height: 32, width: 32, padding: 6}} onClick={() => fileInput.current.click()}>add</Button>
            <input type="file" id="file-selector" onChange={change} ref={fileInput}/>
        </div>
    );

}
