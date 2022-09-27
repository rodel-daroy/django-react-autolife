import { Component } from 'react';
import PropTypes from 'prop-types';
import { makeDecorator } from 'utils';

class WithHash extends Component {
	state = {
		hash: window.location.hash,
		activeHash: window.location.hash
	}

	componentDidMount() {
		window.addEventListener('hashchange', this.handleActiveHashChange);

		this._interval = setInterval(this.handleHashChange, 100);
	}

	componentWillUnmount() {
		window.removeEventListener('hashchange', this.handleActiveHashChange);

		clearInterval(this._interval);
	}

	handleHashChange = () => {
		if(this.state.hash !== window.location.hash)
			this.setState({
				hash: window.location.hash
			});
	}

	handleActiveHashChange = () => {
		if(this.state.activeHash !== window.location.hash)
			this.setState({
				activeHash: window.location.hash
			});
	}

	render() {
		const { children } = this.props;
		const { hash, activeHash } = this.state;

		return children({ hash, activeHash });
	}
}

WithHash.propTypes = {
	children: PropTypes.func.isRequired
};
 
export default WithHash;

export const withHash = makeDecorator(WithHash, 'withHash');