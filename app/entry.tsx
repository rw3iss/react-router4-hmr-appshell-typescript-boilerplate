import 'react-hot-loader/patch';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

ReactDOM.render(
  <AppContainer>
    <App/>
  </AppContainer>,
  document.body
);

// Hot Module Replacement API 
// Note: React Router v4 will throw an error saying you can't replace routes or history on the Router object
// This is unavoidable for now.
if (module.hot) {
  module.hot.accept('./components/App', () => {
    //const App = require('./components/App');
    ReactDOM.render(
	  <AppContainer>
	    <App/>
	  </AppContainer>,
      document.body
    );
  });
}
