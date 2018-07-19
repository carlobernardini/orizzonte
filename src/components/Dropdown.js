import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import classNames from 'classnames';
import {
    assign, debounce, filter as _filter, includes, indexOf,
    isEqual, isFunction, unionBy, uniqueId, without
} from 'lodash';
import diacritics from 'diacritics';
import CheckBox from './CheckBox';
import LoadingIndicator from './LoadingIndicator';
import '../scss/Dropdown.scss';

class Dropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            filter: null,
            focused: false,
            remoteLoading: false,
            remoteOptions: [] // Options that were fetched from a remote API
        };

        this.debounceRemote = null;
        this.dropdown = React.createRef();
        this.filter = React.createRef();
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleEscPress = this.handleEscPress.bind(this);
        this.queryRemote = this.queryRemote.bind(this);
    }

    componentDidUpdate() {
        if (this.filter && this.filter.current) {
            this.filter.current.focus();
        }
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

        const mergedOptions = this.getMergedOptions();

        if (!filter) {
            return mergedOptions;
        }

        const re = new RegExp(`(${ filter })`, 'gi');

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

        const parts = label.split(new RegExp(`(${ filter })`, 'gi'));

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

    getMergedOptions() {
        const { options } = this.props;
        const { remoteOptions } = this.state;

        return unionBy(options, remoteOptions, 'value');
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

    toggleDropdown(e, collapse = false, focusOut = false) {
        const { disabled } = this.props;
        const { expanded, filter } = this.state;

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
            axios
                .get(remote.endpoint, {
                    data: assign({}, remote.data || {}, {
                        [remote.searchParam]: filter || ''
                    })
                })
                .then((response) => {
                    let { data } = response;
                    const newState = {
                        remoteLoading: false
                    };

                    if (remote.transformer && isFunction(remote.transformer)) {
                        // Use a custom callback to transform the remote response
                        // so the result conforms to the expected data structure
                        // (collection of options)
                        data = remote.transformer(data);
                    }

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

        if (!value || !value.length) {
            return notSetLabel || 'None selected';
        }

        const selectedOptions = _filter(mergedOptions, (option) => {
            if (Array.isArray(value)) {
                return indexOf(value, option.value) > -1;
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
            return selectedLabel(selectedOptions);
        }
        if (indexOf(selectedLabel, '%d') > -1) {
            return selectedLabel.replace('%d', selectedoptions.length);
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
                onClick={ this.toggleDropdown }
                onFocus={ this.onFocus }
                onBlur={ this.onBlur }
                type="button"
            >
                { this.renderButtonLabel() }
            </button>
        );
    }

    renderItem(option) {
        const { multiple, onUpdate, value } = this.props;

        const highlightedLabel = this.getHighlightedLabel(option.label || option.value);

        if (!multiple) {
            return highlightedLabel;
        }

        return (
            <CheckBox
                disabled={ option.disabled }
                id={ uniqueId('checkbox-') }
                value={ option.value }
                label={ highlightedLabel }
                selected={ (value || []).indexOf(option.value) > -1 }
                onChange={ (selected) => {
                    let newValue = (value || []).slice(0);
                    if (selected && !includes(newValue, option.value)) {
                        newValue.push(option.value);
                    }
                    if (!selected && includes(newValue, option.value)) {
                        newValue = without(newValue, option.value);
                    }
                    if (isEqual(newValue, value)) {
                        return false;
                    }
                    onUpdate(newValue.length ? newValue : null);
                    return true;
                }}
                viewBox={[0, 0, 13, 13]}
            />
        );
    }

    renderList() {
        const { filter, remoteLoading } = this.state;
        const options = this.getFilteredOptions();

        if (!options.length) {
            const noOptionsLabel = filter ? 'No matches' : 'No options available';

            return (
                <li
                    className="orizzonte__dropdown-item--empty"
                >
                    { remoteLoading ? 'Loading...' : noOptionsLabel }
                </li>
            );
        }

        return options.map((option, i) => (
            <li
                key={ `${ option.value }.${ i }` }
                className="orizzonte__dropdown-item"
            >
                { this.renderItem(option) }
            </li>
        ));
    }

    render() {
        const { disabled, label } = this.props;
        const { expanded, focused } = this.state;

        return (
            <div
                className="orizzonte__filter"
            >
                <div
                    className="orizzonte__filter-caption"
                >
                    { label }
                </div>
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
                        { this.renderList() }
                    </ul>
                </div>
            </div>
        );
    }
}

Dropdown.propTypes = {
    disabled: PropTypes.bool,
    /** Filter dropdown options and highlight matches */
    filter: PropTypes.shape({
        enabled: PropTypes.bool.isRequired,
        matchDiacritics: PropTypes.bool,
        placeholder: PropTypes.string
    }),
    label: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    /** Label to shown when no options are selected */
    notSetLabel: PropTypes.string,
    onUpdate: PropTypes.func,
    /** Collection of dropdown options */
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]).isRequired,
            label: PropTypes.any
        })
    ),
    /** Remote API to fetch dropdown options from */
    remote: PropTypes.shape({
        data: PropTypes.object,
        endpoint: PropTypes.string.isRequired,
        searchParam: PropTypes.string.isRequired,
        transformer: PropTypes.func
    }),
    selectedLabel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]),
    value: PropTypes.array
};

Dropdown.defaultProps = {
    disabled: false,
    filter: null,
    multiple: true,
    notSetLabel: null,
    onUpdate: () => {},
    options: [],
    remote: null,
    selectedLabel: null,
    value: []
};

export default Dropdown;
