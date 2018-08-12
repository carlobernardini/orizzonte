import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { assign } from 'lodash-es';
import FilterInfo from './FilterInfo';
import '../scss/Filter.scss';
import '../scss/FullText.scss';

class FullText extends PureComponent {
    renderField() {
        const {
            disabled, maxHeight, maxWidth, multiline, onUpdate, placeholder, value
        } = this.props;

        let fieldProps = {
            className: classNames('orizzonte__filter-fulltext', {
                'orizzonte__filter-fulltext--disabled': disabled
            }),
            disabled,
            onChange: (e) => {
                const { value: val } = e.target;

                if (!(val || '').trim().length) {
                    return onUpdate(null);
                }

                return onUpdate(val);
            },
            placeholder,
            value: value || ''
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
