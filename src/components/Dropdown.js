import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import classNames from 'classnames';
import {
    assign, debounce, includes, isEqual, isFunction, isNumber, unionBy, uniqueId, without
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
        const { options } = this.props;
        const { filter, remoteOptions } = this.state;

        const mergedOptions = unionBy(options, remoteOptions, 'value');

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

        this.setState(newState);

        return true;
    }

    queryRemote() {
        const { remote } = this.props;
        const { filter, remoteOptions } = this.state;

        if (!remote || !remote.endpoint || !remote.searchParam) {
            return false;
        }

        this.setState({
            remoteLoading: true
        }, () => {
            axios
                .get(remote.endpoint, {
                    data: assign({}, remote.data || {}, {
                        [remote.searchParam]: filter
                    })
                })
                .then((response) => {
                    let { data } = response;
                    const newState = {
                        remoteLoading: false
                    };

                    if (remote.transformer && isFunction(remote.transformer)) {
                        // Use a custom callback to transform the remote response
                        // so the result conforms to the expected data structure (collection of options)
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

        if (!value || !value.length) {
            return notSetLabel || 'None selected';
        }

        if (selectedLabel) {
            if (isFunction(selectedLabel)) {
                return selectedLabel(value);
            }
            if (Array.isArray(value)) {
                return selectedLabel.replace('%d', value.length);
            }
            if (isNumber(value)) {
                return selectedLabel.replace('%d', value.toString());
            }
            return selectedLabel.replace('%s', value);
        }

        return Array.isArray(value) ? `${ value.length } selected` : value;
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
                        strokeWidth="4"
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
            disabled, filter, filterDiacriticsStrictly, filterPlaceholder
        } = this.props;
        const { expanded } = this.state;

        if (filter && expanded) {
            return (
                <div className="orizzonte__dropdown-filter-wrapper">
                    <input
                        type="text"
                        className="orizzonte__dropdown-filter"
                        onChange={ (e) => {
                            const { value } = e.target;
                            this.setState({
                                filter: filterDiacriticsStrictly ? value : diacritics.remove(value)
                            }, () => {
                                if (!this.debounceRemote) {
                                    this.debounceRemote = debounce(this.queryRemote, 300);
                                } else {
                                    this.debounceRemote.cancel();
                                }
                                this.debounceRemote();
                            });
                        }}
                        placeholder={ filterPlaceholder }
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
        const { filter } = this.state;
        const options = this.getFilteredOptions();

        if (filter && !options.length) {
            return (
                <li
                    className="orizzonte__dropdown-item--empty"
                >
                    No matches
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
    filter: PropTypes.bool,
    filterDiacriticsStrictly: PropTypes.bool,
    filterPlaceholder: PropTypes.string,
    label: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    notSetLabel: PropTypes.string,
    onUpdate: PropTypes.func,
    options: PropTypes.array,
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
    filter: false,
    filterDiacriticsStrictly: false,
    filterPlaceholder: null,
    multiple: true,
    notSetLabel: null,
    onUpdate: () => {},
    options: [],
    remote: null,
    selectedLabel: null,
    value: []
};

export default Dropdown;
