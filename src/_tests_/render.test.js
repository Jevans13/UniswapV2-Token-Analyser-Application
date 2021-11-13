import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App.js';
window.URL.createObjectURL = function() {};

it('renders without crashing', () => {

  ReactDOM.render(<App />, document.createElement('Router'));
});