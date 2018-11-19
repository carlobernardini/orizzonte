import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { debounce, isFunction } from 'lodash-es';
import { DISPLAY_NAME_FILTER_FULLTEXT } from '../constants';
import Caption from './Caption';
import FilterInfo from './FilterInfo';

class FullText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            derivedValue: props.value,
            value: props.value || ''
        };

        this.dispatchDebounced = debounce(
            this.dispatchToQuery,
            props.dispatchTimeout
        );
        this.input = React.createRef();
        this.dispatchDebouncedWrapper = this.dispatchDebouncedWrapper.bind(this);
        this.dispatchToQuery = this.dispatchToQuery.bind(this);
    }

    componentDidMount() {
        const { autoFocus } = this.props;

        if (!autoFocus || !this.input || !this.input.current) {
            return false;
        }

        this.input.current.focus();
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { value } = nextProps;
        const { derivedValue } = prevState;

        if (value === null && derivedValue !== value) {
            return {
                derivedValue: value,
                value: ''
            };
        }

        return {
            derivedValue: value
        };
    }

    dispatchDebouncedWrapper() {
        if (!this.dispatchDebounced) {
            return true;
        }
        if (this.dispatchDebounced.cancel) {
            this.dispatchDebounced.cancel();
        }
        this.dispatchDebounced();
        return true;
    }

    dispatchToQuery() {
        const { onUpdate, validateInput } = this.props;
        const { value = '' } = this.state;

        if (isFunction(validateInput) && !validateInput(value)) {
            return false;
        }

        if (!value.trim().length) {
            return onUpdate(null);
        }

        return onUpdate(value);
    }

    renderField() {
        const {
            disabled, maxHeight, maxWidth, multiline, validateInput,
            placeholder, value: derivedValue
        } = this.props;

        const { value = '' } = this.state;

        let fieldProps = {
            className: classNames('orizzonte__filter-fulltext', {
                'orizzonte__filter-fulltext--disabled': disabled,
                'orizzonte__filter-fulltext--invalid': value.length && isFunction(validateInput) && !validateInput(value)
            }),
            disabled,
            onBlur: this.dispatchToQuery,
            onChange: (e) => {
                const { value: val = '' } = e.target;

                if (val === value) {
                    return false;
                }

                this.setState({
                    derivedValue,
                    value: val
                }, this.dispatchDebouncedWrapper);
                return true;
            },
            placeholder,
            ref: this.input,
            value
        };

        if (multiline) {
            fieldProps = {
                ...fieldProps,
                className: classNames(fieldProps.className, 'orizzonte__filter-fulltext--multiline'),
                style: ((mh, mw) => {
                    if (!mh && !mw) {
                        return null;
                    }

                    return {
                        maxHeight: mh ? `${ mh }px` : null,
                        maxWidth: mw ? `${ mw }px` : null
                    };
                })(maxHeight, maxWidth)
            };

            return (
                <textarea
                    { ...fieldProps }
                />
            );
        }

        return (
            <input
                type="text"
                onKeyUp={ (e) => {
                    const key = e.keyCode || e.which;

                    if (key !== 13) {
                        return true;
                    }

                    this.dispatchToQuery();
                    return true;
                }}
                { ...fieldProps }
            />
        );
    }

    render() {
        const { information, label } = this.props;

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
                { this.renderField() }
            </div>
        );
    }
}

FullText.displayName = DISPLAY_NAME_FILTER_FULLTEXT;

FullText.propTypes = {
    /** If the textarea should focus when group is expanded
        Only works when group has only one (enabled) fulltext filter */
    autoFocus: PropTypes.bool,
    /** If the textarea should be disabled */
    disabled: PropTypes.bool,
    /** Custom debounce timeout before dispatching the new value to the query object */
    dispatchTimeout: PropTypes.number,
    /** Field name for this filter, to be used in composed query */
    // eslint-disable-next-line
    fieldName: PropTypes.string,
    information: PropTypes.string,
    /** Label for this filter section */
    label: PropTypes.string,
    /** Maximum textarea height (only applicable in multiline mode) */
    maxHeight: PropTypes.number,
    /** Maximum textarea width (only applicable in multiline mode) */
    maxWidth: PropTypes.number,
    /** Whether to render a textarea (true) or input field (false) */
    multiline: PropTypes.bool,
    /** Internal callback for filter update */
    onUpdate: PropTypes.func,
    /** Placeholder text for the input field */
    placeholder: PropTypes.string,
    /** Transforming function or placeholder for group label */
    selectedLabel: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string
    ]),
    /** Function to validate user input, should return true (valid) or false (invalid) */
    validateInput: PropTypes.func,
    /** Current value for this filter */
    value: PropTypes.string
};

FullText.defaultProps = {
    autoFocus: false,
    disabled: false,
    dispatchTimeout: 300,
    fieldName: null,
    information: null,
    label: null,
    maxHeight: null,
    maxWidth: null,
    multiline: false,
    onUpdate: () => {},
    placeholder: null,
    selectedLabel: '%s',
    validateInput: null,
    value: null
};

export default FullText;
