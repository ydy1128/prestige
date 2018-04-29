import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { AppContainer } from 'react-hot-loader'

import { App, Home, Login, Register } from 'containers';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from 'reducers';
import thunk from 'redux-thunk';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { composeWithDevTools } from 'redux-devtools-extension';

const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Home },
  childRoutes: [
	{ path: 'home', component: Home },
	{ path: 'login', component: Login },
	{ path: 'register', component: Register },
  ]
}

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

const render = Component => {
    ReactDOM.render(
			<AppContainer>
				<MuiThemeProvider>
					<Provider store={store}>
							<Router history={browserHistory}routes={routes} key={Math.random()}/>
						</Provider>
				</MuiThemeProvider>
	    </AppContainer>,
			document.getElementById('root')
    );
}

render(App);

if(module.hot) {
	module.hot.accept();
}
