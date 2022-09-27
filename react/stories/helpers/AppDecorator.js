import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../src/redux/store";
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const AppDecorator = story => (
  <DndProvider backend={HTML5Backend}>
    <Provider store={store}>
        <BrowserRouter>
          {story()}
        </BrowserRouter>
    </Provider>
  </DndProvider>
);

export default AppDecorator;