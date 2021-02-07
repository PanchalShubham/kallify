import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import BaseContainer from './components/BaseContainer';
import PageNotFound from './components/PageNotFound';
export default function App(props){
	document.title = "Callify | Connect instantly with your friends, family and community!";
	return (
		<div id="app">
			<Router>
				<Switch>
					<Route path="/" exact component={BaseContainer} />
					<Route path="/" component={PageNotFound} />
				</Switch>
			</Router>
		</div>
	);
};
