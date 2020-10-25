// section should render one by one with intersection observer

import React, {useEffect, useState} from "react";
import {getChild} from "../db";

export function Section({section: {id, title, image}, ordinal, fullyRendered} ) {
  const [items, setItems] = useState([]);
  const [observer, setObserver] = useState(null);
  const [childOrdinal, setChildOrdinal] = useState(ordinal + 1);

  const [unobservedItems, setUnobservedItems] = useState({});

  useEffect(() => {
    async function fetchChild() {
      // getting child
      console.debug('child loading', childOrdinal);
      const c = await getChild(id, childOrdinal);

      if (c) {
        console.debug('child loaded', id, childOrdinal, c.content);
        setItems(items => [...items, c]);
      } else {
        console.debug('fully rendered');
        debugger
        fullyRendered(ordinal);
      }
    }
    fetchChild();
  }, [childOrdinal, fullyRendered, id, ordinal])

  useEffect( () => {
    const o = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const target = entry.target;
        const index = Number(target.getAttribute('data-index'));
        if (entry.isIntersecting && !unobservedItems[index]) {
          console.debug('intersection!', entry.target);
          // console.debug('new child ordinal', childOrdinal + 1);
          setChildOrdinal(childOrdinal => childOrdinal + 1);

          setUnobservedItems(items => {
            items[index] = 1;
            return {...items};
          })
          o.unobserve(entry.target);
        }
      })
    }, {threshold: 0.5});
    setObserver(o);

    return () => {
      o.disconnect();
    }

  }, [id])

  return (
    <div className="section">
      {title && <h3>{title}</h3> }
      {image && <img src={image} alt={title}/> }
      { items.map((item, index) => {
        if (!item.tag) {
          return <Section key={index} section={item} ordinal={childOrdinal}
                          fullyRendered={() => setChildOrdinal(childOrdinal + 1)}/>
        }
        switch (item.tag) {
          case 'p':
            return <p ref={node => {
              if (node && !unobservedItems[index]) {
                console.debug('observer set', index)
                observer.observe(node);
              }
            }} key={index} data-index={index}>{item.content}</p>
        }
      }) }
    </div>

  )
}