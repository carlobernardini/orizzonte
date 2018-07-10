import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './scss/Orizzonte.scss';

class Orizzonte extends Component {
	renderAddBtn(position) {
		const { btnAddPosition, maxFilters } = this.props;

		if (btnAddPosition !== position) {
			return null;
		}

		if (maxFilters && maxFilters === React.Children.length) {
			return null;
		}

		return (<button
			type="button"
			className={ classNames('orizzonte__btn-add', {
				'orizzonte__btn-add--left': btnAddPosition === 'left'
			}) }
		>
			+
		</button>);
	}

	render() {
		const { children } = this.props;

		return (<div
			className="orizzonte__container"
		>
			{ this.renderAddBtn('left') }
			{ React.Children.map(children, (child) => {
				if (child.type.name !== 'Filter') {
					return null;
				}
				return child;
			}) }
			{ this.renderAddBtn('right') }
		</div>);
	}
}

Orizzonte.propTypes = {
	btnAddPosition: PropTypes.oneOf([
		'left',
		'right'
	]),
	disabled: PropTypes.bool,
	onFilterAdded: PropTypes.func,
	onFilterRemoved: PropTypes.func
};

Orizzonte.defaultProps = {
	btnAddPosition: 'right',
	disabled: false,
	onFilterAdded: () => {},
	onFilterRemoved: () => {}
};

export default Orizzonte;
