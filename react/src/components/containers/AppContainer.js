import React, { Component } from "react";
import PropTypes from "prop-types";
import { applyRouterMiddleware, browserHistory, Router } from "react-router";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { isStatic, isCrawler, isPrerender } from "utils";

class AppContainer extends Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      rehydrated: false
    };
  }

  componentWillMount() {
    const { store } = this.props;
    persistStore(store, { whitelist: ["user"] }, () => {
      this.setState({ rehydrated: true });
    });
  }

  componentDidMount() {
    const classList = document.documentElement.classList;

    if (isCrawler()) classList.add("crawler");
    if (isPrerender()) classList.add("prerender");
    if (isStatic()) classList.add("static");
  }

  render() {
    const { routes, store, render } = this.props;
    if (!this.state.rehydrated) {
      return <div className="loader-site" />;
    }
    return (
      <Provider store={store}>
        <div className="app-container">
          <Router history={browserHistory} children={routes} render={render} />
        </div>
      </Provider>
    );
  }
}

export default AppContainer;
