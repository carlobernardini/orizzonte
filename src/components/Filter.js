import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../scss/Filter.scss';

class Filter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shown: false,
            removing: false
        };

        this.removeFilter = this.removeFilter.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
    }

    removeFilter() {
        const { i, onFilterRemove } = this.props;

        this.setState({
            shown: false,
            removing: true
        });

        setTimeout(onFilterRemove.bind(null, i), 300);
    }

    toggleFilter() {
        const { shown } = this.state;

        this.setState({
            shown: !shown
        });
    }

    render() {
        const { label } = this.props;
        const { shown, removing } = this.state;

        return (
            <div
                className={ classNames('orizzonte__filter', {
                    'orizzonte__filter--shown': shown,
                    'orizzonte__filter--removing': removing
                }) }
            >
                <button
                    type="button"
                    onClick={ this.toggleFilter }
                    className="orizzonte__filter-label"
                    
                >
                    { label }
                </button>
                <button
                    type="button"
                    className="orizzonte__filter-btn"
                    onClick={ this.removeFilter }
                >
                    &times;
                </button>
            </div>
        );
    }
}

Filter.propTypes = {
    /** Internal filter list index */
    i: PropTypes.number,
    /** Filter label */
    label: PropTypes.string.isRequired,
    /** Internal callback for filter removal */
    onFilterRemove: PropTypes.func
};

Filter.defaultProps = {
    i: null,
    onFilterRemove: () => {}
};

export default Filter;
