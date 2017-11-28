import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { App, Home, Login, Register } from 'containers';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from 'reducers';
import thunk from 'redux-thunk';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';



const store = createStore(reducers, applyMiddleware(thunk));

const Main = () => {
	return (
		<MuiThemeProvider>
			<Provider store={store}>
			    <Router history={browserHistory}>
			        <Route path="/" component={App}>
			            <IndexRoute component={Home}/>
			            <Route path="home" component={Home}/>
			            <Route path="login" component={Login}/>
			            <Route path="register" component={Register}/>
			        </Route>
			    </Router>
		    </Provider>
		</MuiThemeProvider>
	)
};
const rootElement = document.getElementById('root');

ReactDOM.render( Main(), rootElement );
