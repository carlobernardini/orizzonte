import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import List from './List';
import '../scss/Group.scss';

class Group extends Component {
    constructor(props) {
        super(props);

        this.state = {
            removing: false
        };

        this.removeGroup = this.removeGroup.bind(this);
        this.toggleGroup = this.toggleGroup.bind(this);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    onKeyUp(e) {
        const { activeGroup, i, onGroupToggle } = this.props;

        const key = e.which || e.keyCode;

        if (activeGroup !== i || key !== 27) {
            return false;
        }

        return onGroupToggle(false);
    }

    removeGroup() {
        const {
            activeGroup, i, onGroupRemove, onGroupToggle
        } = this.props;

        if (activeGroup === i) {
            onGroupToggle();
        }

        this.setState({
            removing: true
        });

        setTimeout(onGroupRemove.bind(null, i), 300);
    }

    toggleGroup() {
        const { activeGroup, i, onGroupToggle } = this.props;

        if (activeGroup === i) {
            return onGroupToggle(false);
        }

        return onGroupToggle(i);
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
                &nbsp;
            </button>
        );
    }

    renderList() {
        const { activeGroup, children, i, orientation } = this.props;

        if (activeGroup !== i || !children.length) {
            return null;
        }

        return (
            <List
                isFilterGroup
                items={ children }
                orientation={ orientation }
            />
        );
    }

    render() {
        const {
            activeGroup, i, included, label
        } = this.props;
        const { removing } = this.state;

        if (!included) {
            return null;
        }

        return (
            <div
                className={ classNames('orizzonte__group', {
                    'orizzonte__group--shown': activeGroup === i,
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
    /** Internal index of currently expanded group */
    activeGroup: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.bool
    ]),
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
    /** Internal callback for setting currently expanded group */
    onGroupToggle: PropTypes.func,
    /** Orientation of the group dropdown list */
    orientation: PropTypes.oneOf([
        'left',
        'right'
    ]),
    /** If the group should be present in the bar */
    included: PropTypes.bool
};

Group.defaultProps = {
    activeGroup: null,
    children: [],
    hideRemove: false,
    i: null,
    onGroupRemove: () => {},
    onGroupToggle: () => {},
    orientation: 'left',
    included: false
};

export default Group;
