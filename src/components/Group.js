import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    concat, filter, find, fromPairs, intersection,
    isEqual, isNil, pick, union, without
} from 'lodash-es';
import { DEFAULT_STR_EXCEPTION, DEFAULT_ORIENTATION, DISPLAY_NAME_GROUP, GROUP_MIN_WIDTH } from '../constants';
import { getFlattenedOptions, mergeOptionsDeep, transformLabel } from '../utils';
import GroupTopLabel from './GroupTopLabel';
import GroupBtn from './GroupBtn';
import List from './List';
import '../scss/Group.scss';

class Group extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cache: {},
            removing: false,
            groupValues: {},
            hasError: false
        };

        this.groupTopLabel = React.createRef();
        this.clearGroup = this.clearGroup.bind(this);
        this.removeGroup = this.removeGroup.bind(this);
        this.toggleGroup = this.toggleGroup.bind(this);
        this.updateGroupValues = this.updateGroupValues.bind(this);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    onKeyUp(e) {
        const { active, onGroupToggle } = this.props;

        const key = e.which || e.keyCode;

        if (!active || key !== 27) {
            return false;
        }

        return onGroupToggle(false);
    }

    static getDerivedStateFromProps(props, state) {
        const { active } = props;
        const { groupValues } = state;

        if (active || !Object.keys(groupValues).length) {
            return null;
        }

        return {
            groupValues: {}
        };
    }

    getGroupMinWidth() {
        if (!this.groupTopLabel || !this.groupTopLabel.current) {
            return {
                minWidth: `${ GROUP_MIN_WIDTH }px`
            };
        }

        const { width } = this.groupTopLabel.current.getBoundingClientRect();

        return {
            minWidth: `${ width + GROUP_MIN_WIDTH || GROUP_MIN_WIDTH }px`
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

    clearGroup() {
        const { onUpdate } = this.props;
        const filterFields = this.queryHasGroupFilters();

        this.toggleGroup(null, true);
        onUpdate(filterFields);
    }

    removeGroup() {
        const {
            active, i, onGroupRemove, onGroupToggle, onUpdate
        } = this.props;

        if (active) {
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

    toggleGroup(e, forceCollapse = false) {
        const { active, i, onGroupToggle } = this.props;

        if (active || forceCollapse) {
            return onGroupToggle(false);
        }

        return onGroupToggle(i);
    }

    updateGroupValues(fieldName, value) {
        const { dispatchOnFilterChange, mutuallyExclusiveFilters, onUpdate } = this.props;
        const { groupValues } = this.state;

        const filterFields = this.queryHasGroupFilters();

        if (fieldName in groupValues && isEqual(groupValues[fieldName], value)) {
            return false;
        }

        let values;

        if (!mutuallyExclusiveFilters || isNil(value)) {
            values = {
                ...groupValues,
                [fieldName]: value
            };
        } else if (
            Array.isArray(mutuallyExclusiveFilters)
            && mutuallyExclusiveFilters.length >= 2
            && mutuallyExclusiveFilters.indexOf(fieldName) > -1
        ) {
            const reset = fromPairs(
                intersection(
                    union(
                        Object.keys(groupValues),
                        filterFields
                    ),
                    without(
                        mutuallyExclusiveFilters,
                        fieldName
                    )
                ).map((field) => ([field, null]))
            );

            values = {
                ...groupValues,
                ...reset,
                [fieldName]: value
            };
        } else {
            const reset = fromPairs(
                without(
                    filterFields,
                    fieldName
                ).map((field) => ([field, null]))
            );

            values = {
                ...reset,
                [fieldName]: value
            };
        }

        this.setState({
            groupValues: values
        }, () => {
            if (!dispatchOnFilterChange) {
                return false;
            }

            return onUpdate(values);
        });

        return true;
    }

    renderList() {
        const { cache, groupValues } = this.state;
        const {
            active, children, description, hideRemove, hideDone, listMinWidth,
            onUpdate, orientation, queryPart
        } = this.props;

        if (!active || !children) {
            return null;
        }

        const filterFields = this.queryHasGroupFilters();
        const listValues = {
            ...pick(queryPart, filterFields),
            ...groupValues
        };

        const filters = description ? concat([
            <div
                className="orizzonte__group-description"
            >
                { description }
            </div>
        ], children) : children;

        return (
            <List
                cache={ cache || {} }
                removeBtn={ !hideRemove }
                doneBtn={ !hideDone }
                isFilterGroup
                items={ filters }
                minWidth={ listMinWidth }
                orientation={ orientation }
                onApply={ () => {
                    this.toggleGroup();
                    onUpdate(groupValues);
                }}
                onRemove={ this.removeGroup }
                onUpdate={ this.updateGroupValues }
                syncCacheToGroup={ (fieldName, options) => {
                    this.setState({
                        cache: {
                            ...cache,
                            [fieldName]: options
                        }
                    });
                }}
                values={ listValues }
            />
        );
    }

    renderLabel() {
        const { children, label, queryPart } = this.props;
        const { cache } = this.state;

        const fields = Object.keys(queryPart);

        if (!fields.length) {
            return label;
        }

        const selectedLabels = React.Children.map(children, (child) => {
            if (!child.props || !child.props.fieldName || !(child.props.fieldName in queryPart)) {
                return null;
            }

            const { fieldName, options, selectedLabel } = child.props;
            const { flatOptions } = getFlattenedOptions(
                mergeOptionsDeep(
                    options,
                    cache[child.props.fieldName] || []
                ).mergedOptions
            );

            const value = queryPart[fieldName];

            if (!options) {
                return transformLabel(selectedLabel, value);
            }
            if (!Array.isArray(value) && flatOptions) {
                const selectedOption = find(flatOptions, (option) => (option.value === value));
                return transformLabel(selectedLabel, selectedOption);
            }

            const selectedOptions = filter(flatOptions, (option) => (
                value.indexOf(option.value) > -1
            ));

            return transformLabel(selectedLabel, selectedOptions, flatOptions.length);
        });

        if (!selectedLabels.length) {
            return label;
        }

        return selectedLabels.join(', ');
    }

    renderTopLabel() {
        const {
            active, children, groupTopLabels, label, queryPart
        } = this.props;

        if (!groupTopLabels) {
            return null;
        }

        const fieldNames = React.Children.map(children, (child) => (child.props.fieldName));

        if (!fieldNames.length) {
            return null;
        }

        const queryPartKeys = Object.keys(queryPart);

        const isShown = Boolean(active
            || (
                queryPartKeys.length
                && intersection(queryPartKeys, fieldNames).length
            ));

        return (
            <GroupTopLabel
                shown={ isShown }
                ref={ this.groupTopLabel }
            >
                { label }
            </GroupTopLabel>
        );
    }

    render() {
        const {
            active, className, included, hideClear, style
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
                    { DEFAULT_STR_EXCEPTION }
                </div>
            );
        }

        const queryHasFilters = this.queryHasGroupFilters().length;

        return (
            <div
                className={ classNames('orizzonte__group', {
                    'orizzonte__group--shown': active,
                    'orizzonte__group--removing': removing,
                    'orizzonte__group--clearable': queryHasFilters && !hideClear,
                    'orizzonte__group--empty': !queryHasFilters,
                    [className]: className
                }) }
                style={{
                    ...style,
                    ...this.getGroupMinWidth()
                }}
            >
                { this.renderTopLabel() }
                <div
                    className="orizzonte__group-btn-wrapper"
                >
                    <button
                        type="button"
                        onClick={ this.toggleGroup }
                        className="orizzonte__group-label"
                    >
                        { this.renderLabel() }
                    </button>
                    <GroupBtn
                        hidden={ !queryHasFilters || hideClear }
                        onClick={ this.clearGroup }
                    />
                </div>
                { this.renderList() }
            </div>
        );
    }
}

Group.displayName = DISPLAY_NAME_GROUP;

Group.propTypes = {
    /** Internal flag if current group is expanded */
    active: PropTypes.bool,
    /** Internal list of filters in this group */
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.node
        ),
        PropTypes.node
    ]),
    /** Custom additional class name for top-level component element */
    className: PropTypes.string,
    /** A description for this group of filters */
    description: PropTypes.string,
    /** Internal prop */
    dispatchOnFilterChange: PropTypes.bool,
    /** Internal flag if a label should be shown at the top */
    groupTopLabels: PropTypes.bool,
    /** Hides the clear button in the dropdown */
    hideClear: PropTypes.bool,
    /** Hides the done button in the dropdown */
    hideDone: PropTypes.bool,
    /** Hides the button to remove this group */
    hideRemove: PropTypes.bool,
    /** Internal filter group list index */
    i: PropTypes.number,
    /** If the group should be present in the bar */
    included: PropTypes.bool,
    /** Group label */
    label: PropTypes.string.isRequired,
    /** Minimum width for the dropdown list */
    listMinWidth: PropTypes.number,
    /** When true, only one filter can be selected for this group
        When you want only specific filters to be mutually exclusive,
        you can provide an array of (two or more) field names */
    mutuallyExclusiveFilters: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.array
    ]),
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
    /** Internal prop representing part of current query object for this group */
    queryPart: PropTypes.object,
    /** Custom inline styles for top-level component element */
    style: PropTypes.object
};

Group.defaultProps = {
    active: null,
    children: [],
    className: null,
    description: null,
    dispatchOnFilterChange: false,
    groupTopLabels: false,
    hideClear: false,
    hideDone: false,
    hideRemove: false,
    i: null,
    included: false,
    listMinWidth: null,
    mutuallyExclusiveFilters: false,
    onGroupRemove: () => {},
    onGroupToggle: () => {},
    onUpdate: () => {},
    orientation: DEFAULT_ORIENTATION,
    queryPart: {},
    style: {}
};

export default Group;
