import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logError } from 'redux/actions/commonActions';

class ErrorBoundary extends Component {
  state = {
    hasError: false
  }

  componentDidCatch(error) {
    this.props.logError(error);
    this.setState({ hasError: true });
  }

  render() {
    if(!this.state.hasError)
      return this.props.children;
    
    return null;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,

  logError: PropTypes.func.isRequired
};

export default connect(null, { logError })(ErrorBoundary);