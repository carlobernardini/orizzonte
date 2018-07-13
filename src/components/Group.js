import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    find, intersection, isEqual, isFunction, isNumber
} from 'lodash';
import List from './List';
import '../scss/Group.scss';

class Group extends Component {
    constructor(props) {
        super(props);

        this.state = {
            removing: false,
            groupValues: {},
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
            activeGroup, children, i, onGroupRemove, onGroupToggle, onUpdate, query
        } = this.props;

        if (activeGroup === i) {
            onGroupToggle();
        }

        this.setState({
            removing: true
        }, () => {
            const fieldNames = React.Children.map(children, (child) => (child.props.fieldName));
            
            if (!intersection(Object.keys(query), fieldNames).length) {
                return false;
            }

            onUpdate(fieldNames);
            return true;
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
        const { groupValues } = this.state;
        const {
            activeGroup, children, i, onUpdate, orientation
        } = this.props;

        if (activeGroup !== i || !children.length) {
            return null;
        }

        return (
            <List
                isFilterGroup
                items={ children }
                orientation={ orientation }
                onApply={ () => {
                    this.toggleGroup();
                    onUpdate(groupValues);
                }}
                onUpdate={ (fieldName, value) => {
                    if (fieldName in groupValues && isEqual(groupValues[fieldName], value)) {
                        return false;
                    }
                    const values = { ...groupValues };
                    values[fieldName] = value;

                    this.setState({
                        groupValues: values
                    });
                    return true;
                }}
            />
        );
    }

    renderLabel() {
        const { children, label, query } = this.props;

        const selectedLabels = React.Children.map(children, (child) => {
            if (!child.props || !child.props.fieldName || !(child.props.fieldName in query)) {
                return null;
            }

            const { fieldName, selectedLabel } = child.props;

            if (!('fieldName' in child.props)) {
                return null;
            }

            const value = query[fieldName];
            const option = find(child.props.options || {}, { value });

            if (selectedLabel) {
                if (isFunction(selectedLabel)) {
                    if (option && option.label) {
                        return selectedLabel(value, option.label);
                    }
                    return selectedLabel(value);
                }
                if (Array.isArray(value)) {
                    return selectedLabel.replace('%d', value.length);
                }
                if (isNumber(value)) {
                    return selectedLabel.replace('%d', value.toString());
                }
                return selectedLabel.replace('%s', option.label || value);
            }

            return null;
        });

        if (!selectedLabels.length) {
            return label;
        }

        return selectedLabels.join(', ');
    }

    renderTopLabel() {
        const { children, label, query } = this.props;

        const fieldNames = React.Children.map(children, (child) => (child.props.fieldName));

        if (!fieldNames.length) {
            return null;
        }

        const queryKeys = Object.keys(query);

        if (!queryKeys.length || !intersection(queryKeys, fieldNames).length) {
            return null;
        }

        return (
            <span
                className="orizzonte__group-label--top"
            >
                { label }
            </span>
        );
    }

    render() {
        const {
            activeGroup, i, included
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
                { this.renderTopLabel() }
                <button
                    type="button"
                    onClick={ this.toggleGroup }
                    className="orizzonte__group-label"
                >
                    { this.renderLabel() }
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
    /** If the group should be present in the bar */
    included: PropTypes.bool,
    /** Group label */
    label: PropTypes.string.isRequired,
    /** Internal callback for group removal */
    onGroupRemove: PropTypes.func,
    /** Internal callback for setting currently expanded group */
    onGroupToggle: PropTypes.func,
    /** Internal callback for applying group values to query */
    onUpdate: PropTypes.func,
    /** Orientation of the group dropdown list */
    orientation: PropTypes.oneOf([
        'left',
        'right'
    ]),
    /** Current composed query */
    query: PropTypes.object
};

Group.defaultProps = {
    activeGroup: null,
    children: [],
    hideRemove: false,
    i: null,
    included: false,
    onGroupRemove: () => {},
    onGroupToggle: () => {},
    onUpdate: () => {},
    orientation: 'left',
    query: {}
};

export default Group;
