import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckBox from './CheckBox';
import '../scss/Dropdown.scss';

class Dropdown extends Component {
	constructor(props) {
		super(props);

		this.state = {
			expanded: false
		}

		this.dropdown = React.createRef();
		this.toggleDropdown = this.toggleDropdown.bind(this);
	}

	toggleDropdown(e, collapse = false) {
		const { disabled } = this.props;
		const { expanded } = this.state;

		const newState = collapse ? false : !expanded;

		if (newState && disabled) {
			return false;
		}

		this.setState({
			expanded: newState
		});
		return true;
	}

	render() {
		const { disabled, label } = this.props;
		const { expanded } = this.state;

		console.log(disabled);

		return (
			<div
		        className="orizzonte__filter"
		    >
		        <div
		            className="orizzonte__filter-caption"
		        >
		            { label }
		        </div>
				<div
					className={ classNames('orizzonte__dropdown', {
						'orizzonte__dropdown--expanded': expanded,
						'orizzonte__dropdown--disabled': disabled
					}) }
					ref={ this.dropdown }
				>
					<button
						className="orizzonte__dropdown-button"
						disabled={ disabled }
						onBlur={ (e) => {
							if (this.dropdown.current.contains(e.target)) {
								return false;
							}
							this.toggleDropdown(true)
						}}
						onClick={ this.toggleDropdown }
					>
						test
					</button>
					<ul
						className="orizzonte__dropdown-list"
					>
						<li
							className="orizzonte__dropdown-item"
						>
							test
						</li>
					</ul>
				</div>
			</div>
		)
	}
}

Dropdown.propTypes = {
	disabled: PropTypes.bool,
	label: PropTypes.string.isRequired
};

Dropdown.defaultProps = {
	disabled: false
};

export default Dropdown;
