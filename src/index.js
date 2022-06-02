import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import {store} from './redux/store';
import {Provider} from 'react-redux';
import {ErrorBoundary} from "./pages/ErrorBoundary";

ReactDOM.render(<Provider store={store}>
  <BrowserRouter>
    <ErrorBoundary>
      <App/>
    </ErrorBoundary>
  </BrowserRouter>
</Provider>, document.getElementById('root'));
