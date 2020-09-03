import React from 'react';
import {PureComponent} from "react";

export class Reader extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        debugger
        const hash = this.props.match.params.hash;
        return (
            <div>book:
                { hash }
            </div>
        )
    }
}
