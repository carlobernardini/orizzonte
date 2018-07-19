import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../scss/Filter.scss';
import '../scss/FullText.scss';

class FullText extends Component {
    renderField() {
        const {
            disabled, multiline, onUpdate, placeholder, value
        } = this.props;

        const fieldProps = {
            className: classNames('orizzonte__filter-fulltext', {
                'orizzonte__filter-fulltext--disabled': disabled
            }),
            disabled,
            onChange: (e) => {
                const { value: val } = e.target;
                if (!val.trim().length) {
                    return onUpdate(null);
                }
                return onUpdate(val);
            },
            placeholder,
            value: value || ''
        };

        if (multiline) {
            fieldProps.className = classNames(fieldProps.className, 'orizzonte__filter-fulltext--multiline');

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
        const { label } = this.props;

        return (
            <div
                className="orizzonte__filter"
            >
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

FullText.propTypes = {
    /** If the textarea should be disabled */
    disabled: PropTypes.bool,
    /** Label for this filter section */
    label: PropTypes.string.isRequired,
    multiline: PropTypes.bool,
    /** Internal callback for filter update */
    onUpdate: PropTypes.func,
    /** Label for this filter section */
    placeholder: PropTypes.string,
    /** Current value for this filter */
    value: PropTypes.string
};

FullText.defaultProps = {
    disabled: false,
    multiline: false,
    onUpdate: () => {},
    placeholder: null,
    value: null
};

export default FullText;
