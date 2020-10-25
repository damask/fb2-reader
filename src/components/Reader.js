import React, {useEffect, useMemo, useState} from 'react';
import {PureComponent} from "react";
import {getBook, getRootSection, getSections} from "../db";
import {Section} from "./Section";

export function Reader(props) {
    const hash = props.match.params.hash;
    const [book, setBook] = useState(null);
    const [topSection, setTopSection] = useState(null);
    const [sections, setSections] = useState([]);

    useEffect( () => {
        getBook(hash).then(setBook);
        getRootSection(hash).then(setTopSection);
    }, [hash])

    // rendering algo
    // get first section
    // section renders all its elements by ordinal
    // when done - render next section

    function fullyRendered() {
        console.debug('rendered')
    }

    if (!book) {
        return <div>loading...</div>
    }

    if (book) {
        return (
          <div>
              <div>
                  <h2>{book.title}</h2>
                  <div>
                      <div><img src={book.image} align="left" alt={book.title}/>{book.annotation}</div>
                      <br/>
                      <Section section={topSection} ordinal={0} fullyRendered={fullyRendered} />
                  </div>
              </div>
          </div>
        )
    }


}
