import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { includes, isEqual, uniqueId, without } from 'lodash';
import CheckBox from './CheckBox';
import '../scss/Dropdown.scss';

class Dropdown extends Component {
	constructor(props) {
		super(props);

		this.state = {
			expanded: false,
			filter: null,
			focused: false
		};

		this.dropdown = React.createRef();
		this.filter = React.createRef();
		this.toggleDropdown = this.toggleDropdown.bind(this);
		this._onFocus = this._onFocus.bind(this);
	}

	componentDidUpdate() {
		if (this.filter && this.filter.current) {
			this.filter.current.focus();
		}
	}

	_onFocus(e) {
		const { focused } = this.state;

		if (focused) {
			return false;
		}

		this.setState({
			focused: true
		});
		return true;
	}

	getFilteredOptions() {
		const { options } = this.props;
		const { filter } = this.state;

		if (!filter) {
			return options;
		}

		const re = new RegExp(`(${ filter })`, 'gi');

		return options.filter((option) => {
			const label = option.label || option.value;
			return label.match(re);
		});
	}

	getHighlightedLabel(label) {
		const { filter } = this.state;

		if (!filter) {
			return label
		}

		const parts = label.split(new RegExp(`(${ filter })`, 'gi'));

		return parts.map((part) => {
			if (part.toLowerCase() === filter.toLowerCase()) {
				return (
					<strong>
						{ part }
					</strong>
				);
			}
			return part;
		});
	}

	toggleDropdown(e = {}, collapse = false) {
		const { disabled } = this.props;
		const { expanded, filter } = this.state;

		const newState = {
			expanded: collapse ? false : !expanded
		};

		if (newState.expanded && disabled) {
			return false;
		}
		if (!newState.expanded && filter) {
			newState.filter = null;
		}

		this.setState(newState);

		return true;
	}

	renderDropdownTrigger() {
		const { disabled, filter, filterPlaceholder } = this.props;
		const { expanded } = this.state;

		if (filter && expanded) {
			return (
				<input
					type="text"
					className="orizzonte__dropdown-filter"
					onChange={ (e) => {
						const { value } = e.target;
						this.setState({
							filter: value
						});
					}}
					placeholder={ filterPlaceholder }
					ref={ this.filter }
				/>
			);
		}

		return (
			<button
				className="orizzonte__dropdown-button"
				disabled={ disabled }
				onClick={ this.toggleDropdown }
				onFocus={ this._onFocus }
			>
				test
			</button>
		);
	}

	renderItem(option, i) {
		const { multiple, onUpdate, value } = this.props;

		const highlightedLabel = this.getHighlightedLabel(option.label || option.value);

		if (!multiple) {
			return highlightedLabel;
		}

		return (
			<CheckBox
				disabled={ option.disabled }
				id={ uniqueId('checkbox-') }
				value={ option.value }
				label={ highlightedLabel }
				selected={ (value || []).indexOf(option.value) > -1 }
				onChange={ (selected) => {
					let newValue = (value || []).slice(0);
                    if (selected && !includes(newValue, option.value)) {
                        newValue.push(option.value);
                    }
                    if (!selected && includes(newValue, option.value)) {
                        newValue = without(newValue, option.value);
                    }
                    if (isEqual(newValue, value)) {
                        return false;
                    }
                    onUpdate(newValue.length ? newValue : null);
                    return true;
				}}
				viewBox={[0, 0, 13, 13]}
			/>
		);
	}

	render() {
		const { disabled, label } = this.props;
		const { expanded, focused } = this.state;

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
						'orizzonte__dropdown--focused': expanded || focused,
						'orizzonte__dropdown--expanded': expanded,
						'orizzonte__dropdown--disabled': disabled
					}) }
					ref={ this.dropdown }
				>
					{ this.renderDropdownTrigger() }
					<ul
						className="orizzonte__dropdown-list"
					>
						{ this.getFilteredOptions().map((option, i) => (
							<li
								key={ `${ option.value }.${ i }` }
								className="orizzonte__dropdown-item"
							>
								{ this.renderItem(option) }
							</li>
						)) }
					</ul>
				</div>
			</div>
		)
	}
}

Dropdown.propTypes = {
	disabled: PropTypes.bool,
	filter: PropTypes.bool,
	filterPlaceholder: PropTypes.string,
	label: PropTypes.string.isRequired,
	onUpdate: PropTypes.func,
	value: PropTypes.array
};

Dropdown.defaultProps = {
	disabled: false,
	filter: false,
	filterPlaceholder: null,
	onUpdate: () => {},
	value: []
};

export default Dropdown;
