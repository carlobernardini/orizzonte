import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './scss/Filter.scss';

class Filter extends Component {
	constructor(props) {
        super(props);

        this.state = {
        	shown: false,
        	removing: false
        };

        this.removeFilter = this.removeFilter.bind(this);
    }

    removeFilter(e) {
    	const { i, onFilterRemove } = this.props;

    	this.setState({
    		shown: false,
    		removing: true
    	});

    	setTimeout(onFilterRemove.bind(null, i), 300);
    }

	render() {
		const { name, onFilterRemove } = this.props;
		const { shown, removing } = this.state;

		return (<div
			className={ classNames('orizzonte__filter', {
				'orizzonte__filter--shown': shown,
				'orizzonte__filter--removing': removing
			}) }
		>
			<a
				href="#"
				onClick={ (e) => {
					e.preventDefault();
					this.setState({
						shown: !shown
					});
				}}
				className="orizzonte__filter-label"
				
			>
				{ name }
			</a>
			<button
				type="button"
				className="orizzonte__filter-btn"
				onClick={ this.removeFilter }
			>
				&times;
			</button>
		</div>);
	}
}

Filter.propTypes = {
	name: PropTypes.string.isRequired,
	onFilterRemove: PropTypes.func
};

Filter.defaultProps = {
	onFilterRemove: () => {}
};

export default Filter;
