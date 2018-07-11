import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import List from './List';
import '../scss/Group.scss';

class Group extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shown: false,
            removing: false
        };

        this.removeGroup = this.removeGroup.bind(this);
        this.toggleGroup = this.toggleGroup.bind(this);
    }

    removeGroup() {
        const { i, onGroupRemove } = this.props;

        this.setState({
            shown: false,
            removing: true
        });

        setTimeout(onGroupRemove.bind(null, i), 300);
    }

    toggleGroup() {
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
                className="orizzonte__group-btn"
                onClick={ this.removeGroup }
            >
                &times;
            </button>
        );
    }

    renderList() {
        const { children } = this.props;
        const { shown } = this.state;

        if (!shown || !children.length) {
            return null;
        }

        return (
            <List
                isFilterGroup
                items={ children }
            />
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
                className={ classNames('orizzonte__group', {
                    'orizzonte__group--shown': shown,
                    'orizzonte__group--removing': removing
                }) }
            >
                <button
                    type="button"
                    onClick={ this.toggleGroup }
                    className="orizzonte__group-label"
                >
                    { label }
                </button>
                { this.renderBtn() }
                { this.renderList() }
            </div>
        );
    }
}

Group.propTypes = {
    /** Internal list of filters in this group */
    children: PropTypes.array,
    /** If a remove button should be present */
    hideRemove: PropTypes.bool,
    /** Internal filter group list index */
    i: PropTypes.number,
    /** Group label */
    label: PropTypes.string.isRequired,
    /** Internal callback for group removal */
    onGroupRemove: PropTypes.func,
    /** If the group should be present in the bar */
    selected: PropTypes.bool
};

Group.defaultProps = {
    children: [],
    hideRemove: false,
    i: null,
    onGroupRemove: () => {},
    selected: false
};

export default Group;
