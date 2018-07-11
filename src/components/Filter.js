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

    renderBtn() {
        const { hideRemove } = this.props;

        if (hideRemove) {
            return null;
        }

        return (
            <button
                type="button"
                className="orizzonte__filter-btn"
                onClick={ this.removeFilter }
            >
                &times;
            </button>
        );
    }

    render() {
        const { label, selected } = this.props;
        const { shown, removing } = this.state;

        if (!selected) {
            return null;
        }

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
                { this.renderBtn() }
            </div>
        );
    }
}

Filter.propTypes = {
    /** If a remove button should be present */
    hideRemove: PropTypes.bool,
    /** Internal filter list index */
    i: PropTypes.number,
    /** Filter label */
    label: PropTypes.string.isRequired,
    /** Internal callback for filter removal */
    onFilterRemove: PropTypes.func,
    /** If the filter is added to the bar */
    selected: PropTypes.bool
};

Filter.defaultProps = {
    hideRemove: false,
    i: null,
    onFilterRemove: () => {},
    selected: false
};

export default Filter;
