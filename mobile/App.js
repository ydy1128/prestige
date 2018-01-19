import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import Home from './src/components/Home';
import Register from './src/components/Register';
import LectureList from './src/components/LectureList';

import reducers from './reducers'
import thunk from 'redux-thunk';

const Navigation = StackNavigator({
  Home: { screen: Home },
  Register: { screen: Register },
  LectureList: { screen: LectureList},

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

