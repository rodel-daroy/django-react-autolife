import React from "react";
import { connect } from "react-redux";
import get from "lodash/get";

const reloadForUser = WrappedComponent => {
  let Wrapper = ({ userChangeCount, ...otherProps }) => {
    const props = {
      ...otherProps,

      key: userChangeCount
    };

    return (
      <WrappedComponent {...props} />
    );
  };

  const mapStateToProps = state => ({
    userChangeCount: get(state, "user.userChangeCount")
  });

  Wrapper = connect(mapStateToProps)(Wrapper);

  Wrapper.displayName = `reloadForUser(${WrappedComponent.displayName || WrappedComponent.name})`;

  return Wrapper;
};

export default reloadForUser;