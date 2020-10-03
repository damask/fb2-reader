import React, {useEffect, useMemo, useState} from 'react';
import {PureComponent} from "react";
import {getBook, getRootSection, getSections} from "../db";

export function Reader(props) {
    const hash = props.match.params.hash;
    const [book, setBook] = useState(null);
    const [topSection, setTopSection] = useState(null);

    useEffect( () => {
        getBook(hash).then(setBook);
        getRootSection(hash).then(setTopSection);
    }, [hash])

    // rendering algo
    // get first non-section element - draw: sections and element
    // get next sibling if there is - draw - intersection observer
    // ..
    // when no next sibling

    if (book) {
        return (
          <div>
              <div>
                  <h2>{book.title}</h2>
                  <div>
                      <div><img src={book.image} align="left" alt={book.title}/>{book.annotation}</div>
                      <br/>
                      <h3>{topSection.title}</h3>
                  </div>
              </div>
          </div>
        )
    }

    return <div>loading...</div>
}
