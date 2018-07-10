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
    	this.setState({
    		shown: false,
    		removing: true
    	});
    }

	render() {
		const { name } = this.props;
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
				x
			</button>
		</div>);
	}
}

Filter.propTypes = {
	name: PropTypes.string.isRequired
};

Filter.defaultProps = {};

export default Filter;
