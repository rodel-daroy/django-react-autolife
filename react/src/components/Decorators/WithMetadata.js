import React, { Component } from "react";
import { connect } from "react-redux";
import { saveMetadata, removeMetadata } from "../../redux/actions/metaData";
import isEqual from "lodash/isEqual";

const WithMetadata = (propsToKey, mapPropsToState) => WrappedComponent => {
  class WrapperComponent extends Component {
    constructor(props) {
      super(props);

      this.store(props);
    }

    store(props = this.props) {
      const key = propsToKey(props);
      const state = mapPropsToState(props);

      props.saveMetadata(key, state);
    }

    componentWillReceiveProps(nextProps) {
      const oldKey = propsToKey(this.props);
      const newKey = propsToKey(nextProps);

      if (oldKey !== newKey) {
        this.props.removeMetadata(oldKey);
        this.store(nextProps);
      } else {
        const oldState = mapPropsToState(this.props);
        const newState = mapPropsToState(nextProps);

        if (!isEqual(oldState, newState)) this.store(nextProps);
      }
    }

    componentWillUnmount() {
      const key = propsToKey(this.props);

      this.props.removeMetadata(key);
    }

    render() {
      const { saveMetadata, removeMetadata, ...otherProps } = this.props;

      return <WrappedComponent {...otherProps} />;
    }
  }

  WrapperComponent.displayName = `WithMetadata(${WrappedComponent.displayName ||
    WrappedComponent.name})`;

  const mapDispatchToProps = {
    saveMetadata,
    removeMetadata
  };

  return connect(
    null,
    mapDispatchToProps
  )(WrapperComponent);
};

export default WithMetadata;

const getMetadata = key => state => state.metadata.metadata[key];

export { getMetadata };
