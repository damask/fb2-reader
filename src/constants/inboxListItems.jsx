import React from 'react';
import { FontIcon } from 'react-md';

export default [{
  key: 'books',
  primaryText: 'Books',
  leftIcon: <FontIcon>book</FontIcon>,
  active: true,
}, {
  key: 'read',
  primaryText: 'Read',
  leftIcon: <FontIcon>assignment</FontIcon>,
},{
  key: 'drafts',
  primaryText: 'Drafts',
  leftIcon: <FontIcon>drafts</FontIcon>,
}, {
  key: 'trash',
  primaryText: 'Trash',
  leftIcon: <FontIcon>delete</FontIcon>,
}];
