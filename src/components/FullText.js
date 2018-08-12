import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { assign, debounce } from 'lodash-es';
import FilterInfo from './FilterInfo';
import '../scss/Filter.scss';
import '../scss/FullText.scss';

class FullText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            derivedValue: props.value,
            value: props.value || ''
        };

        this.dispatchToQuery = debounce(() => {
            const { value = '' } = this.state;

            if (!value.trim().length) {
                return props.onUpdate(null);
            }

            return props.onUpdate(value);
        }, props.dispatchTimeout);
        this.dispatch = this.dispatch.bind(this);
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

    dispatch() {
        if (!this.dispatchToQuery) {
            return true;
        }
        if (this.dispatchToQuery.cancel) {
            this.dispatchToQuery.cancel();
        }
        this.dispatchToQuery();
        return true;
    }

    renderField() {
        const {
            disabled, maxHeight, maxWidth, multiline, placeholder, value: derivedValue
        } = this.props;
        const { value = '' } = this.state;

        let fieldProps = {
            className: classNames('orizzonte__filter-fulltext', {
                'orizzonte__filter-fulltext--disabled': disabled
            }),
            disabled,
            onBlur: this.dispatch,
            onChange: (e) => {
                const { value: val = '' } = e.target;

                if (val === value) {
                    return false;
                }

                this.setState({
                    derivedValue,
                    value: val
                }, this.dispatch);
                return true;
            },
            placeholder,
            value
        };

        if (multiline) {
            fieldProps = assign({}, fieldProps, {
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
            });

            return (
                <textarea
                    { ...fieldProps }
                />
            );
        }

        return (
            <input
                type="text"
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
                <FilterInfo information={ information } />
                <div
                    className="orizzonte__filter-caption"
                >
                    { label }
                </div>
                { this.renderField() }
            </div>
        );
    }
}

FullText.displayName = 'OrizzonteFullText';

FullText.propTypes = {
    /** If the textarea should be disabled */
    disabled: PropTypes.bool,
    /** Custom debounce timeout before dispatching the new value to the query object */
    dispatchTimeout: PropTypes.number,
    /** Field name for this filter, to be used in composed query */
    // eslint-disable-next-line
    fieldName: PropTypes.string,
    information: PropTypes.string,
    /** Label for this filter section */
    label: PropTypes.string.isRequired,
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
    /** Current value for this filter */
    value: PropTypes.string
};

FullText.defaultProps = {
    disabled: false,
    dispatchTimeout: 300,
    fieldName: null,
    information: null,
    maxHeight: null,
    maxWidth: null,
    multiline: false,
    onUpdate: () => {},
    placeholder: null,
    selectedLabel: '%s',
    value: null
};

export default FullText;
