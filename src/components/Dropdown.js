import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import _filter from 'lodash/filter';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';
import toArray from 'lodash/toArray';
import uniqueId from 'lodash/uniqueId';
import without from 'lodash/without';
import diacritics from 'diacritics';
import { escapeRegExp, getFlattenedOptions, getSelectedOptionsDeep, mergeOptionsDeep } from '../utils';
import {
    DEFAULT_STR_LOADING, DEFAULT_STR_NO_MATCH, DEFAULT_STR_NO_OPTIONS, DISPLAY_NAME_FILTER_DROPDOWN
} from '../constants';
import CheckBox from './CheckBox';
import LoadingIndicator from './LoadingIndicator';
import Caption from './Caption';
import FilterInfo from './FilterInfo';

class Dropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            filter: null,
            focused: false,
            cursor: -1,
            remoteLoading: false,
            remoteOptions: [] // Options that were fetched from a remote API
        };

        this.debounceRemote = null;
        this.dropdown = React.createRef();
        this.dropdownButton = React.createRef();
        this.filter = React.createRef();
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleEscPress = this.handleEscPress.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.queryRemote = this.queryRemote.bind(this);
        this.nodes = {};
        this.setNodeRef = (node, cursorIndex) => {
            this.nodes[cursorIndex] = node;
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const { expanded } = this.state;

        if (prevState.expanded === expanded) {
            return false;
        }

        if (this.filter && this.filter.current) {
            this.filter.current.focus();
        } else if (this.dropdownButton && this.dropdownButton.current) {
            this.dropdownButton.current.focus();
        }

        return true;
    }

    onFocus() {
        const { focused } = this.state;

        if (focused) {
            return false;
        }

        this.setState({
            focused: true
        });
        return true;
    }

    onBlur() {
        const { focused } = this.state;

        if (!focused) {
            return false;
        }

        this.setState({
            focused: false
        });
        return true;
    }

    getFilteredOptions() {
        const { filter } = this.state;
        const { filter: filterProp } = this.props;

        const mergedOptions = this.getMergedOptions();

        if (!filter) {
            return mergedOptions;
        }

        const re = new RegExp(`${ filterProp.matchPosition === 'start' ? '^' : '' }(${ escapeRegExp(filter) })`, `g${ !filterProp.matchCase ? 'i' : '' }`);

        return mergedOptions.filter((option) => {
            const label = option.label || option.value;
            return label.match(re);
        });
    }

    getHighlightedLabel(label) {
        const { filter } = this.state;

        if (!filter) {
            return label;
        }

        const parts = label.split(new RegExp(`(${ escapeRegExp(filter) })`, 'gi'));

        return (
            <span>
                { parts.map((part, i) => {
                    if (part.toLowerCase() === filter.toLowerCase()) {
                        return (
                            <strong
                                key={ i }
                                className="orizzonte__dropdown-match"
                            >
                                { part }
                            </strong>
                        );
                    }
                    return (
                        <span key={ i }>
                            { part }
                        </span>
                    );
                }) }
            </span>
        );
    }

    getLoadingText() {
        const { remote } = this.props;

        if (!remote || !remote.loadingText) {
            return DEFAULT_STR_LOADING;
        }

        return remote.loadingText;
    }

    getMergedOptions() {
        const { cache = [], options } = this.props;
        const { remoteOptions } = this.state;

        if (!remoteOptions.length && !cache.length) {
            return options;
        }

        const { mergedOptions } = mergeOptionsDeep(options, remoteOptions, cache);

        return mergedOptions;
    }

    dispatchUpdate(newValue) {
        const { remoteOptions } = this.state;
        const { cache, onUpdate, syncCache } = this.props;

        if (remoteOptions && isFunction(syncCache)) {
            const { selectedOptions } = getSelectedOptionsDeep(
                remoteOptions,
                toArray(newValue)
            );

            if (!isEqual(cache, selectedOptions)) {
                syncCache(selectedOptions);
            }
        }

        onUpdate(newValue);
    }

    handleClickOutside(e) {
        if (!this.dropdown || !this.dropdown.current) {
            return false;
        }
        if (this.dropdown.current.contains(e.target)) {
            return false;
        }
        this.toggleDropdown(null, true, true);
        return true;
    }

    handleEscPress(e) {
        e.stopPropagation();
        const key = e.keyCode || e.which;

        if (key !== 27) {
            return false;
        }

        this.toggleDropdown(null, true, true);
        return false;
    }

    handleKeyDown(e, option, selected) {
        const { multiple } = this.props;
        const { cursor } = this.state;
        const mergedOptions = this.getMergedOptions();
        const { flatOptions } = getFlattenedOptions(mergedOptions);
        const options = flatOptions.filter((o) => (!o.disabled));
        const key = e.keyCode || e.which;

        if ((key === 32 || key === 13) && option) { // Space or enter
            if (option.disabled) {
                return false;
            }

            if (!multiple) {
                this.handleSingleSelection(option.value);
                return false;
            }

            this.handleSelection(selected, option.value);
            return false;
        }

        let newCursor = null;

        if (key === 38) { // Arrow up
            newCursor = cursor > 0
                ? cursor - 1
                : (options.length - 1);
        } else if (key === 40) { // Arrow down
            newCursor = cursor < (options.length - 1)
                ? cursor + 1
                : 0;
        }

        if (newCursor === null) {
            return true;
        }

        e.preventDefault();

        this.setState({
            cursor: newCursor
        }, () => {
            if (!this.nodes[newCursor]) {
                return false;
            }
            this.nodes[newCursor].focus();
            return true;
        });

        return false;
    }

    handleSelection(selected, optionValue) {
        const { value } = this.props;

        let newValue = (value || []).slice(0);
        if (selected && !includes(newValue, optionValue)) {
            newValue.push(optionValue);
        }

        if (!selected && includes(newValue, optionValue)) {
            newValue = without(newValue, optionValue);
        }

        if (isEqual(newValue, value)) {
            return false;
        }

        this.dispatchUpdate(newValue.length ? newValue : null);
        return true;
    }

    handleSingleSelection(optionValue) {
        this.dispatchUpdate(optionValue);
        this.toggleDropdown(null, true);
    }

    toggleDropdown(e, collapse = false, focusOut = false) {
        const { disabled } = this.props;
        const { expanded, filter } = this.state;

        if (e && e.stopPropagation) {
            e.stopPropagation();
        }

        const newState = {
            expanded: collapse ? false : !expanded
        };

        if (newState.expanded && disabled) {
            return false;
        }
        if (!newState.expanded && filter) {
            newState.filter = null;
        }
        if (focusOut) {
            newState.focused = false;
        }

        if (newState.expanded) {
            document.addEventListener('click', this.handleClickOutside, false);
            document.addEventListener('keyup', this.handleEscPress, true);
        } else {
            document.removeEventListener('click', this.handleClickOutside, false);
            document.removeEventListener('keyup', this.handleEscPress, true);
        }

        this.setState(newState, this.queryRemote);

        return true;
    }

    queryRemote() {
        const { remote } = this.props;
        const { expanded, filter, remoteOptions } = this.state;

        if (!expanded || !remote || !remote.endpoint || !remote.searchParam) {
            return false;
        }

        this.setState({
            remoteLoading: true
        }, () => {
            const method = remote.method || 'get';

            const requestOptions = {
                method,
                url: remote.endpoint
            };

            if (remote.params) {
                requestOptions.params = remote.params;
            }

            const filterOption = filter && filter.length ? {
                [remote.searchParam]: filter
            } : {};

            if (method.toLowerCase() === 'post') {
                requestOptions.data = {
                    ...(remote.data || {}),
                    ...filterOption
                };
            } else {
                requestOptions.params = {
                    ...(requestOptions.params || {}),
                    ...filterOption
                };
            }

            if (remote.transformer && isFunction(remote.transformer)) {
                // Use a custom callback to transform the remote response
                // so the result conforms to the expected data structure
                // (collection of options)
                requestOptions.transformResponse = remote.transformer;
            }

            axios(requestOptions)
                .then((response) => {
                    const { data } = response;
                    const newState = {
                        remoteLoading: false
                    };

                    if (!isEqual(data, remoteOptions)) {
                        newState.remoteOptions = data;
                    }

                    this.setState(newState);
                });
        });

        return true;
    }

    renderButtonLabel() {
        const { notSetLabel, value, selectedLabel } = this.props;
        const mergedOptions = this.getMergedOptions();
        const { flatOptions } = getFlattenedOptions(mergedOptions);

        if (!value || !value.length) {
            return notSetLabel || 'None selected';
        }

        const selectedOptions = _filter(flatOptions, (option) => {
            if (Array.isArray(value)) {
                return value.indexOf(option.value) > -1;
            }
            return option.value === value;
        });

        if (!selectedLabel) {
            if (selectedOptions.length === 1) {
                return selectedOptions[0].label || value;
            }
            return `${ selectedOptions.length } selected`;
        }
        if (isFunction(selectedLabel)) {
            return selectedLabel(selectedOptions, flatOptions.length);
        }
        if (includes(selectedLabel, '%d')) {
            return selectedLabel.replace('%d', selectedOptions.length);
        }
        return selectedLabel.replace('%s', selectedOptions[0].label || value);
    }

    renderDropdownTriggerButton() {
        const { remoteLoading } = this.state;

        if (remoteLoading) {
            return (
                <div
                    className="orizzonte__dropdown-filter-loading"
                >
                    <LoadingIndicator
                        size="12"
                    />
                </div>
            );
        }

        return (
            <button
                className="orizzonte__dropdown-filter-button"
                onClick={ () => (this.toggleDropdown(null, true, true)) }
                type="button"
            >
                &nbsp;
            </button>
        );
    }

    renderDropdownTrigger() {
        const {
            disabled, filter
        } = this.props;
        const { expanded } = this.state;

        if (filter && filter.enabled && expanded) {
            return (
                <div className="orizzonte__dropdown-filter-wrapper">
                    <input
                        type="text"
                        className="orizzonte__dropdown-filter"
                        onChange={ (e) => {
                            const { value } = e.target;
                            this.setState({
                                filter: filter.matchDiacritics ? value : diacritics.remove(value)
                            }, () => {
                                if (!this.debounceRemote) {
                                    this.debounceRemote = debounce(this.queryRemote, 300);
                                } else {
                                    this.debounceRemote.cancel();
                                }
                                this.debounceRemote();
                            });
                        }}
                        onKeyDown={ this.handleKeyDown }
                        placeholder={ filter.placeholder || '' }
                        ref={ this.filter }
                    />
                    { this.renderDropdownTriggerButton() }
                </div>
            );
        }

        return (
            <button
                className="orizzonte__dropdown-button"
                disabled={ disabled }
                onBlur={ this.onBlur }
                onClick={ this.toggleDropdown }
                onFocus={ this.onFocus }
                onKeyDown={ this.handleKeyDown }
                ref={ this.dropdownButton }
                type="button"
            >
                { this.renderButtonLabel() }
            </button>
        );
    }

    renderItem(option, key, cursorIndex) {
        const { multiple, value } = this.props;

        const highlightedLabel = this.getHighlightedLabel(option.label || option.value);

        const ref = (node) => {
            if (option.disabled) {
                return null;
            }
            return this.setNodeRef(node, cursorIndex);
        };

        if (!multiple) {
            return (
                // eslint-disable-next-line
                <li
                    key={ key }
                    className={ classNames('orizzonte__dropdown-item', {
                        'orizzonte__dropdown-item--disabled': option.disabled
                    }) }
                    onClick={ () => (this.handleSingleSelection(option.value)) }
                    onKeyDown={ (e) => (this.handleKeyDown(e, option)) }
                    ref={ ref }
                    tabIndex="-1"
                >
                    { highlightedLabel }
                    { !isNil(option.facetCount) && (
                        <span
                            className="orizzonte__checkbox-span--count"
                        >
                            { option.facetCount }
                        </span>
                    ) }
                </li>
            );
        }

        const isSelected = (value || []).indexOf(option.value) > -1;

        return (
            // eslint-disable-next-line
            <li
                key={ key }
                className={ classNames('orizzonte__dropdown-item', {
                    'orizzonte__dropdown-item--disabled': option.disabled
                }) }
                onKeyDown={ (e) => (this.handleKeyDown(e, option, !isSelected)) }
                ref={ ref }
                tabIndex="-1"
            >
                <CheckBox
                    disabled={ option.disabled }
                    facetCount={ option.facetCount }
                    id={ uniqueId('checkbox-') }
                    value={ option.value }
                    label={ highlightedLabel }
                    selected={ isSelected }
                    onChange={ (selected) => (this.handleSelection(selected, option.value)) }
                    viewBox={[0, 0, 13, 13]}
                />
            </li>
        );
    }

    renderList() {
        const { filter, remoteLoading } = this.state;
        const options = this.getFilteredOptions();

        if (!options.length) {
            const noOptionsLabel = filter ? DEFAULT_STR_NO_MATCH : DEFAULT_STR_NO_OPTIONS;

            return (
                <li
                    className="orizzonte__dropdown-item--empty"
                >
                    { remoteLoading ? this.getLoadingText() : noOptionsLabel }
                </li>
            );
        }

        let cursorIndex = -1;

        return options.map((option, i) => {
            if (option.children) {
                if (!option.children.length) {
                    return null;
                }

                return (
                    <ul
                        className="orizzonte__dropdown-group"
                        key={ `${ option.value }.${ i }` }
                    >
                        <li
                            className="orizzonte__dropdown-item--empty orizzonte__dropdown-group-label"
                        >
                            { option.value }
                        </li>
                        { option.children.map((child, j) => {
                            if (!child.disabled) {
                                cursorIndex += 1;
                            }

                            return this.renderItem(
                                child,
                                `${ child.value }.${ i }.${ j }`,
                                cursorIndex
                            );
                        }) }
                    </ul>
                );
            }

            if (!option.disabled) {
                cursorIndex += 1;
            }

            return (
                this.renderItem(
                    option,
                    `${ option.value }.${ i }`,
                    cursorIndex
                )
            );
        });
    }

    renderSelectAll() {
        const {
            multiple, onUpdate, options, remote, selectAll, selectAllCount, selectAllLabel, value
        } = this.props;

        if (!selectAll || !multiple || remote) {
            return null;
        }

        const { flatOptions } = getFlattenedOptions(options);
        const totalOptionCount = flatOptions
            .filter((option) => (!option.disabled))
            .length;

        const label = selectAllLabel || 'Select all';

        return (
            <li
                className="orizzonte__dropdown-item"
            >
                <CheckBox
                    id={ uniqueId('checkbox-') }
                    value="select-all"
                    label={ selectAllCount ? `${ label } (${ totalOptionCount })` : label }
                    selected={ (value || []).length === totalOptionCount }
                    onChange={ (selected) => {
                        const newValue = selected
                            ? flatOptions
                                .filter((option) => (!option.disabled))
                                .map((option) => (option.value))
                            : null;

                        onUpdate(newValue);
                    }}
                    viewBox={[0, 0, 13, 13]}
                />
            </li>
        );
    }

    render() {
        const { information, disabled, label } = this.props;
        const { expanded, focused } = this.state;

        return (
            <div
                className="orizzonte__filter"
            >
                <FilterInfo
                    information={ information }
                />
                <Caption>
                    { label }
                </Caption>
                <div
                    className={ classNames('orizzonte__dropdown', {
                        'orizzonte__dropdown--focused': expanded || focused,
                        'orizzonte__dropdown--expanded': expanded,
                        'orizzonte__dropdown--disabled': disabled
                    }) }
                    ref={ this.dropdown }
                >
                    { this.renderDropdownTrigger() }
                    <ul
                        className="orizzonte__dropdown-list"
                    >
                        { this.renderSelectAll() }
                        { this.renderList() }
                    </ul>
                </div>
            </div>
        );
    }
}

Dropdown.displayName = DISPLAY_NAME_FILTER_DROPDOWN;

Dropdown.propTypes = {
    /** Currently cached selected options from remote endpoint */
    cache: PropTypes.arrayOf(
        PropTypes.object
    ),
    information: PropTypes.string,
    disabled: PropTypes.bool,
    /** Field name for this filter, to be used in composed query */
    // eslint-disable-next-line
    fieldName: PropTypes.string.isRequired,
    /** Filter dropdown options and highlight matches */
    filter: PropTypes.shape({
        /** If filtering should be enabled */
        enabled: PropTypes.bool.isRequired,
        /** If the filter is case sensitive */
        matchCase: PropTypes.bool,
        /** If the filter should strictly match diacritics */
        matchDiacritics: PropTypes.bool,
        /** Whether to match at any position in the string or from the start */ 
        matchPosition: PropTypes.oneOf([
            'any',
            'start'
        ]),
        /** Input placeholder when filter is empty */
        placeholder: PropTypes.string
    }),
    label: PropTypes.string,
    /** Allows selecting multiple options */
    multiple: PropTypes.bool,
    /** Label to shown when no options are selected */
    notSetLabel: PropTypes.string,
    onUpdate: PropTypes.func,
    /** Collection of dropdown options */
    options: PropTypes.arrayOf(
        PropTypes.shape({
            disabled: PropTypes.bool,
            facetCount: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            value: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]).isRequired,
            label: PropTypes.any,
            children: PropTypes.arrayOf(
                PropTypes.shape({
                    disabled: PropTypes.bool,
                    value: PropTypes.oneOfType([
                        PropTypes.number,
                        PropTypes.string
                    ]).isRequired,
                    label: PropTypes.any
                })
            )
        })
    ),
    /** Remote API to fetch dropdown options from */
    remote: PropTypes.shape({
        data: PropTypes.object,
        /** Remote endpoint URI */
        endpoint: PropTypes.string.isRequired,
        /** Text to show while loading data */
        loadingText: PropTypes.string,
        params: PropTypes.object,
        /** Request method */
        requestMethod: PropTypes.string,
        /** Query parameter to apply the filter value to */
        searchParam: PropTypes.string.isRequired,
        /** Function for transforming response data before consuming it */
        transformer: PropTypes.func
    }),
    /** Whether to include a select all option on multiselects
        This is not supported when remote source is configured
     */
    selectAll: PropTypes.bool,
    /** Show option count in select all label */
    selectAllCount: PropTypes.bool,
    /** What label to show for the select all option */
    selectAllLabel: PropTypes.string,
    selectedLabel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]),
    /** Internal callback for syncing selected values from remote endpoint */
    syncCache: PropTypes.func,
    value: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string
    ])
};

Dropdown.defaultProps = {
    cache: [],
    information: null,
    disabled: false,
    filter: null,
    label: null,
    multiple: false,
    notSetLabel: null,
    onUpdate: () => {},
    options: [],
    remote: null,
    selectAll: false,
    selectAllCount: false,
    selectAllLabel: null,
    selectedLabel: null,
    syncCache: () => {},
    value: []
};

export default Dropdown;
