/* eslint-disable react/no-array-index-key */
import React, {PureComponent} from 'react';
import './App.css';
import {Button, DialogContainer, FontIcon, NavigationDrawer, Snackbar} from 'react-md';
import inboxListItems from './constants/inboxListItems';
import {BookList} from './components/BookList';
import * as Events from "./events";


import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

import {createBrowserHistory} from 'history';
import {Reader} from "./components/Reader";

// создаём кастомную историю
const history = createBrowserHistory();

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
            this.addToast(`Book "${book.title.toUpperCase()}" has been added earlier!`);
        });
    }

    addToast = (text, action, autohide = true) => {
        this.setState((state) => {
            const toasts = state.toasts.slice();
            toasts.push({text, action});
            return {toasts, autohide};
        });
    }

    dismissToast = () => {
        const [, ...toasts] = this.state.toasts;
        this.setState({toasts});
    };

    setPage = (key, page) => {
        this.navItems = this.navItems.map((item) => {
            if (item.divider) {
                return item;
            }

            return {...item, active: item.key === key};
        });

        this.setState({key, page});
    };

    hide = () => {
        this.setState({visible: false, renderNode: null});
    };

    handleShow = () => {
        this.setState({renderNode: document.getElementById('navigation-drawer-demo')});
    };

    render() {
        const {visible, renderNode, toasts} = this.state;
        return (
            <BrowserRouter history={history} basename={'/fb2-reader'}>
                <div>
                    <DialogContainer
                        id="navigation-drawer-demo"
                        aria-label="Navigation Drawer Demo"
                        visible={visible}
                        fullPage
                        focusOnMount={false}
                        onShow={this.handleShow}
                        onHide={this.hide}>
                        <NavigationDrawer
                            renderNode={renderNode}
                            navItems={this.navItems}
                            mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
                            tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
                            desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
                            toolbarTitle="FB2 Reader"
                            toolbarActions={<Button icon onClick={this.hide}>close</Button>}
                            contentId="main-demo-content"
                            temporaryIcon={<FontIcon>menu</FontIcon>}
                            persistentIcon={<FontIcon>arrow_back</FontIcon>}
                            contentClassName="md-grid">

                            <Switch>
                                <Route path='/books' component={BookList}/>
                                <Route path='/read/:hash' component={Reader}/>
                                <Redirect from='/' to='/books'/>
                            </Switch>

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
            </BrowserRouter>
        );
    }
}
