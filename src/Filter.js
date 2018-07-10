import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './scss/Filter.scss';

class Filter extends Component {
	constructor(props) {
        super(props);

        this.state = {
        	shown: false
        };
    }

	render() {
		const { name } = this.props;
		const { shown } = this.state;

		return (<a
			href="#"
			onClick={ (e) => {
				e.preventDefault();
				this.setState({
					shown: !shown
				});
			}}
			className={ classNames('orizzonte__filter', {
				'orizzonte__filter--shown': shown
			}) }
		>
			{ name }
		</a>);
	}
}

Filter.propTypes = {

};

Filter.defaultProps = {

};

export default Filter;
