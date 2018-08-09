import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    assign, concat, filter, find, fromPairs, indexOf, intersection,
    isEqual, isFunction, isNil, isNumber, pick, without
} from 'lodash';
import utils from '../utils';
import List from './List';
import '../scss/Group.scss';

class Group extends Component {
    constructor(props) {
        super(props);

        this.state = {
            removing: false,
            groupValues: {},
            hasError: false
        };

        this.removeGroup = this.removeGroup.bind(this);
        this.toggleGroup = this.toggleGroup.bind(this);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    onKeyUp(e) {
        const { onGroupToggle } = this.props;

        const key = e.which || e.keyCode;

        if (!this.groupIsActive() || key !== 27) {
            return false;
        }

        return onGroupToggle(false);
    }

    static getDerivedStateFromProps(props, state) {
        const { activeGroup, i } = props;
        const { groupValues } = state;

        if (activeGroup === i || !Object.keys(groupValues).length) {
            return null;
        }

        return {
            groupValues: {}
        };
    }

    componentDidCatch() {
        this.setState({
            hasError: true
        });
    }

    queryHasGroupFilters() {
        const { children, queryPart } = this.props;

        const fieldNames = React.Children.map(children, (child) => (child.props.fieldName));

        const fieldsInQueryPart = intersection(Object.keys(queryPart), fieldNames);

        if (!fieldsInQueryPart.length) {
            return false;
        }

        return fieldsInQueryPart;
    }

    removeGroup() {
        const {
            i, onGroupRemove, onGroupToggle, onUpdate
        } = this.props;

        if (this.groupIsActive()) {
            onGroupToggle();
        }

        this.setState({
            removing: true
        }, () => {
            const fieldsInQueryPart = this.queryHasGroupFilters();

            if (!fieldsInQueryPart) {
                return false;
            }

            onUpdate(fieldsInQueryPart);
            return true;
        });

        setTimeout(onGroupRemove.bind(null, i), 300);
    }

    groupIsActive() {
        const { activeGroup, i } = this.props;

        return activeGroup === i;
    }

    toggleGroup() {
        const { i, onGroupToggle } = this.props;

        if (this.groupIsActive()) {
            return onGroupToggle(false);
        }

        return onGroupToggle(i);
    }

    transformLabel(selectedLabel, value, totalOptionCount) {
        if (!selectedLabel) {
            return null;
        }
        if (isFunction(selectedLabel)) {
            return selectedLabel(value, totalOptionCount);
        }
        if (Array.isArray(value)) {
            return selectedLabel.replace('%d', value.length);
        }
        if (isNumber(value)) {
            return selectedLabel.replace('%d', value.toString());
        }
        return selectedLabel.replace('%s', value.label || value);
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
            mutuallyExclusiveFilters, children, description, onUpdate, orientation, queryPart
        } = this.props;

        if (!this.groupIsActive() || !children.length) {
            return null;
        }

        const filterFields = this.queryHasGroupFilters();
        const listValues = assign({}, pick(queryPart, filterFields), groupValues);

        const filters = description ? concat([
            <div
                className="orizzonte__group-description"
            >
                { description }
            </div>
        ], children) : children;


        return (
            <List
                clearBtn
                isFilterGroup
                items={ filters }
                values={ listValues }
                orientation={ orientation }
                onApply={ () => {
                    this.toggleGroup();
                    onUpdate(groupValues);
                }}
                onClear={ () => {
                    this.toggleGroup();
                    onUpdate(filterFields);
                }}
                onUpdate={ (fieldName, value) => {
                    if (fieldName in groupValues && isEqual(groupValues[fieldName], value)) {
                        return false;
                    }

                    let values = (!mutuallyExclusiveFilters || isNil(value))
                        ? { ...groupValues }
                        : {};

                    values[fieldName] = value;

                    if (
                        mutuallyExclusiveFilters
                        && !isNil(value)
                        && filterFields
                    ) {
                        const otherFilters = without(filterFields, fieldName);
                        values = assign(
                            values,
                            fromPairs(otherFilters.map((field) => [field, null]))
                        );
                    }

                    this.setState({
                        groupValues: values
                    });
                    return true;
                }}
            />
        );
    }

    renderLabel() {
        const { children, label, queryPart } = this.props;

        const fields = Object.keys(queryPart);

        if (!fields.length) {
            return label;
        }

        const selectedLabels = React.Children.map(children, (child) => {
            if (!child.props || !child.props.fieldName || !(child.props.fieldName in queryPart)) {
                return null;
            }

            const { fieldName, options, selectedLabel } = child.props;
            const { flatOptions } = utils.getFlattenedOptions(options);

            const value = queryPart[fieldName];

            if (!options) {
                return this.transformLabel(selectedLabel, value);
            }
            if (!Array.isArray(value) && flatOptions) {
                const selectedOption = find(flatOptions, (option) => (option.value === value));
                return this.transformLabel(selectedLabel, selectedOption);
            }

            const selectedOptions = filter(flatOptions, (option) => (
                indexOf(value, option.value) > -1
            ));

            return this.transformLabel(selectedLabel, selectedOptions, flatOptions.length);
        });

        if (!selectedLabels.length) {
            return label;
        }

        return selectedLabels.join(', ');
    }

    renderTopLabel() {
        const {
            children, groupTopLabels, label, queryPart
        } = this.props;

        if (!groupTopLabels) {
            return null;
        }

        const fieldNames = React.Children.map(children, (child) => (child.props.fieldName));

        if (!fieldNames.length) {
            return null;
        }

        const queryPartKeys = Object.keys(queryPart);

        if (!queryPartKeys.length || !intersection(queryPartKeys, fieldNames).length) {
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
            className, groupTopLabels, included, label
        } = this.props;
        const { hasError, removing } = this.state;

        if (!included) {
            return null;
        }

        if (hasError) {
            return (
                <div
                    className="orizzonte__group orizzonte__group--error"
                >
                    Something went wrong...
                    { this.renderBtn() }
                </div>
            );
        }

        return (
            <div
                className={ classNames('orizzonte__group', {
                    'orizzonte__group--shown': this.groupIsActive(),
                    'orizzonte__group--removing': removing,
                    'orizzonte__group--empty': !this.queryHasGroupFilters(),
                    [className]: className
                }) }
            >
                { this.renderTopLabel() }
                <button
                    type="button"
                    onClick={ this.toggleGroup }
                    className="orizzonte__group-label"
                    style={{
                        minWidth: groupTopLabels && label ? `${ (label.length * 5) + 30 }px` : null
                    }}
                >
                    { this.renderLabel() }
                </button>
                { this.renderBtn() }
                { this.renderList() }
            </div>
        );
    }
}

Group.displayName = 'OrizzonteGroup';

Group.propTypes = {
    /** Internal index of currently expanded group */
    activeGroup: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.bool
    ]),
    /** When true, only one filter can be selected for this group */
    mutuallyExclusiveFilters: PropTypes.bool,
    /** Internal list of filters in this group */
    children: PropTypes.array,
    /** Custom additional class name for top-level component element */
    className: PropTypes.string,
    /** A description for this group of filters */
    description: PropTypes.string,
    /** Internal flag if a label should be shown at the top */
    groupTopLabels: PropTypes.bool,
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
    /** Part of current query object representing this group */
    queryPart: PropTypes.object
};

Group.defaultProps = {
    activeGroup: null,
    mutuallyExclusiveFilters: false,
    children: [],
    className: null,
    description: null,
    groupTopLabels: false,
    hideRemove: false,
    i: null,
    included: false,
    onGroupRemove: () => {},
    onGroupToggle: () => {},
    onUpdate: () => {},
    orientation: 'left',
    queryPart: {}
};

export default Group;
