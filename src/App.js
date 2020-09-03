import React from 'react';
import './App.css';

/* eslint-disable react/no-array-index-key */
import { PureComponent } from 'react';
import {Snackbar, Button, DialogContainer, NavigationDrawer, SVGIcon } from 'react-md';

import menu from './icons/menu.svg';
import arrowBack from './icons/arrow_back.svg';
import inboxListItems from './constants/inboxListItems';
import { loremIpsum } from 'lorem-ipsum';
import { BookList } from './components/BookList';
import * as Events from "./events";

export default class App extends PureComponent {
  constructor() {
    super();

    // Update the items so they have an onClick handler to change the current page
    this.navItems = inboxListItems.map((item) => {
      if (item.divider) {
        return item;
      }

      return {
        ...item,
        onClick: () => this.setPage(item.key, item.primaryText),
      };
    });

    this.state = {
      toasts: [],
      renderNode: null,
      visible: true,
      key: inboxListItems[0].key,
      page: inboxListItems[0].primaryText,
    };

    Events.on(Events.BOOK_ALREADY_ADDED).do(event => {
      const book = event.detail.book;
      debugger
      this.addToast(`Book "${book.title.toUpperCase()}" has been added earlier!`);
    });
  }

  addToast = (text, action, autohide = true) => {
    this.setState((state) => {
      const toasts = state.toasts.slice();
      toasts.push({ text, action });
      return { toasts, autohide };
    });
  }

  dismissToast = () => {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  };

  setPage = (key, page) => {
    this.navItems = this.navItems.map((item) => {
      if (item.divider) {
        return item;
      }

      return { ...item, active: item.key === key };
    });

    this.setState({ key, page });
  };

  hide = () => {
    this.setState({ visible: false, renderNode: null });
  };

  handleShow = () => {
    this.setState({ renderNode: document.getElementById('navigation-drawer-demo') });
  };

  render() {
    const { visible, page, renderNode, toasts } = this.state;
    return (
        <div>
          <DialogContainer
              id="navigation-drawer-demo"
              aria-label="Navigation Drawer Demo"
              visible={visible}
              fullPage
              focusOnMount={false}
              onShow={this.handleShow}
              onHide={this.hide}
          >
            <NavigationDrawer
                renderNode={renderNode}
                navItems={this.navItems}
                mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
                tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
                desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
                toolbarTitle="FB2 Reader"
                toolbarActions={<Button icon onClick={this.hide}>close</Button>}
                contentId="main-demo-content"
                temporaryIcon={<SVGIcon use={menu.url} />}
                persistentIcon={<SVGIcon use={arrowBack.url} />}
                contentClassName="md-grid">

              <h2 className="md-cell md-cell--12">Currently on page: {page}</h2>

              { (page === 'Books') &&
                <BookList></BookList>
              }

              { (page !== 'Books') &&
              <section className="md-text-container md-cell md-cell--12">
                <p>{loremIpsum({ units: 'paragraphs', count: 1 })}</p>
                <p>{loremIpsum({ units: 'paragraphs', count: 1 })}</p>
                <p>{loremIpsum({ units: 'paragraphs', count: 1 })}</p>
                <p>{loremIpsum({ units: 'paragraphs', count: 1 })}</p>
                <p>{loremIpsum({ units: 'paragraphs', count: 1 })}</p>
                <p>{loremIpsum({ units: 'paragraphs', count: 1 })}</p>
              </section>
              }

            </NavigationDrawer>
            <Snackbar
                id="example-snackbar"
                toasts={toasts}
                autohide={true}
                onDismiss={this.dismissToast}
                autohideTimeout={4000}
            />
          </DialogContainer>
        </div>
    );
  }
}
