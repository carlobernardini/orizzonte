import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Orizzonte extends Component {
	render() {
		return (<div />);
	}
}

Orizzonte.propTypes = {
	onFilterAdded: PropTypes.func,
	onFilterRemoved: PropTypes.func
};

Orizzonte.defaultProps = {
	onFilterAdded: () => {},
	onFilterRemoved: () => {}
};

export default Orizzonte;
