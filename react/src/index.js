// polyfill must come before any other code
import "babel-polyfill";
import "url-search-params-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import App from "./App";

import Spinner from "components/common/Spinner";
import { PersistGate } from "redux-persist/integration/react";
import * as serviceWorker from "./serviceWorker";
import { ScrollContext } from "react-router-scroll-4";
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// this can help debugging development builds
// refer: https://github.com/welldone-software/why-did-you-render
if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

ReactDOM.render(
	<DndProvider backend={HTML5Backend}>
    <Provider store={store}>
      <PersistGate loading={<Spinner />} persistor={persistor}>
        <BrowserRouter>
          <ScrollContext>
            <App />
          </ScrollContext>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </DndProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
