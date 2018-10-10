import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    assign, concat, filter, find, fromPairs, indexOf, intersection,
    isEqual, isNil, pick, union, without
} from 'lodash-es';
import { DEFAULT_STR_EXCEPTION, DEFAULT_ORIENTATION, DISPLAY_NAME_GROUP, GROUP_MIN_WIDTH } from '../constants';
import { getFlattenedOptions, mergeOptionsDeep, transformLabel } from '../utils';
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
        this.removeGroup = this.removeGroup.bind(this);
        this.toggleGroup = this.toggleGroup.bind(this);
        this.updateGroupValues = this.updateGroupValues.bind(this);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    onKeyUp(e) {
        const { activeGroup, onGroupToggle } = this.props;

        const key = e.which || e.keyCode;

        if (!activeGroup || key !== 27) {
            return false;
        }

        return onGroupToggle(false);
    }

    static getDerivedStateFromProps(props, state) {
        const { activeGroup } = props;
        const { groupValues } = state;

        if (activeGroup || !Object.keys(groupValues).length) {
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

    removeGroup() {
        const {
            activeGroup, i, onGroupRemove, onGroupToggle, onUpdate
        } = this.props;

        if (activeGroup) {
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

    toggleGroup() {
        const { activeGroup, i, onGroupToggle } = this.props;

        if (activeGroup) {
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
            values = assign({}, groupValues, {
                [fieldName]: value
            });
        } else if (
            Array.isArray(mutuallyExclusiveFilters)
            && mutuallyExclusiveFilters.length >= 2
            && indexOf(mutuallyExclusiveFilters, fieldName) > -1
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

            values = assign({}, groupValues, reset, {
                [fieldName]: value
            });
        } else {
            const reset = fromPairs(
                without(
                    filterFields,
                    fieldName
                ).map((field) => ([field, null]))
            );

            values = assign({}, reset, {
                [fieldName]: value
            });
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
        const { cache, groupValues } = this.state;
        const {
            activeGroup, children, description, onUpdate, orientation, queryPart
        } = this.props;

        if (!activeGroup || !children.length) {
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
                cache={ cache || {} }
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
                onUpdate={ this.updateGroupValues }
                syncCacheToGroup={ (fieldName, options) => {
                    this.setState({
                        cache: assign({}, cache, {
                            [fieldName]: options
                        })
                    });
                }}
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
                indexOf(value, option.value) > -1
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
            activeGroup, children, groupTopLabels, label, queryPart
        } = this.props;

        if (!groupTopLabels) {
            return null;
        }

        const fieldNames = React.Children.map(children, (child) => (child.props.fieldName));

        if (!fieldNames.length) {
            return null;
        }

        const queryPartKeys = Object.keys(queryPart);

        const isShown = (activeGroup
            || (
                queryPartKeys.length
                && intersection(queryPartKeys, fieldNames).length
            )
        );

        return (
            <span
                className={ classNames('orizzonte__group-label--top', {
                    'orizzonte__group-label--top-shown': isShown
                }) }
                ref={ this.groupTopLabel }
            >
                { label }
            </span>
        );
    }

    render() {
        const {
            activeGroup, className, included, hideRemove, style
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
                    { this.renderBtn() }
                </div>
            );
        }

        return (
            <div
                className={ classNames('orizzonte__group', {
                    'orizzonte__group--shown': activeGroup,
                    'orizzonte__group--removing': removing,
                    'orizzonte__group--removable': !hideRemove,
                    'orizzonte__group--empty': !this.queryHasGroupFilters(),
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
                    { this.renderBtn() }
                </div>
                { this.renderList() }
            </div>
        );
    }
}

Group.displayName = DISPLAY_NAME_GROUP;

Group.propTypes = {
    /** Internal flag if current group is expanded */
    activeGroup: PropTypes.bool,
    /** Internal list of filters in this group */
    children: PropTypes.array,
    /** Custom additional class name for top-level component element */
    className: PropTypes.string,
    /** A description for this group of filters */
    description: PropTypes.string,
    /** Internal prop */
    dispatchOnFilterChange: PropTypes.bool,
    /** Internal flag if a label should be shown at the top */
    groupTopLabels: PropTypes.bool,
    /** Hides the button to remove this group */
    hideRemove: PropTypes.bool,
    /** Internal filter group list index */
    i: PropTypes.number,
    /** If the group should be present in the bar */
    included: PropTypes.bool,
    /** Group label */
    label: PropTypes.string.isRequired,
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
    activeGroup: null,
    children: [],
    className: null,
    description: null,
    dispatchOnFilterChange: false,
    groupTopLabels: false,
    hideRemove: false,
    i: null,
    included: false,
    mutuallyExclusiveFilters: false,
    onGroupRemove: () => {},
    onGroupToggle: () => {},
    onUpdate: () => {},
    orientation: DEFAULT_ORIENTATION,
    queryPart: {},
    style: {}
};

export default Group;
