import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import Home from './src/components/Home';
import Register from './src/components/Register';
import LectureList from './src/components/LectureList';
import Lecture from './src/components/Lecture';
import Account from './src/components/Account';
import Notification from './src/components/Notification';

import reducers from './reducers'
import thunk from 'redux-thunk';

const Navigation = StackNavigator({
  Home: { screen: Home, params: {title: 'Prestige'} },
  Register: { screen: Register },
  LectureList: { screen: LectureList},
  Lecture: { screen: Lecture},
  Account: { screen: Account},
  Notification: { screen: Notification},
})

const store = createStore(reducers, applyMiddleware(thunk));


export default class App extends Component<{}> {
  render() {
    return (
    	<Provider store={store}>
  			<Navigation />
  		</Provider>
    );
  }
}

