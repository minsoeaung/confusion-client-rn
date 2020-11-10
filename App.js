import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

export default class App extends React.Component {

  render() {

    const store = ConfigureStore();
    
    return (
      <Provider store = {store}>
        <Main />
      </Provider>
    );
  }
}