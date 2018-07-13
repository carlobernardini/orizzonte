import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../scss/Filter.scss';
import '../scss/Select.scss';

const Select = ({ disabled, label, onUpdate, options, value }) => (
    <div
        className="orizzonte__filter"
    >
        <div
            className="orizzonte__filter-caption"
        >
            { label }
        </div>
        <select
            className={ classNames('orizzonte__filter-select', {
                'orizzonte__filter-select--disabled': disabled
            }) }
            disabled={ disabled }
            onChange={ (e) => {
                const { value: val } = e.target;
                onUpdate(val);
            }}
            value={ value }
        >
            { options.map((option, i) => (
                <option
                    key={ `${ option.value }.${ i }` }
                    value={ option.value }
                >
                    { option.label || option.value }
                </option>
            )) }
        </select>
    </div>
);

Select.propTypes = {
    /** If the select should be disabled */
    disabled: PropTypes.bool,
    /** Label for this filter section */
    label: PropTypes.string.isRequired,
    /** Internal callback for when select value has changed */
    onUpdate: PropTypes.func,
    /** List of selectable options (value is required) */
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]).isRequired
        })
    ).isRequired,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

Select.defaultProps = {
    disabled: false,
    onUpdate: () => {},
    value: null
};

export default Select;
