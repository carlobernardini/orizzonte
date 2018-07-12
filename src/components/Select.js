import React from 'react';
import PropTypes from 'prop-types';
import '../scss/Filter.scss';
import '../scss/Select.scss';

const Select = ({ label, onUpdate, options }) => (
    <div
        className="orizzonte__filter"
    >
        <div
            className="orizzonte__filter-caption"
        >
            { label }
        </div>
        <select
            className="orizzonte__filter-select"
            onChange={ (e) => {
                const { value } = e.target;
                onUpdate(value);
            }}
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
    /** Label for this filter section */
    label: PropTypes.string.isRequired,
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
    ).isRequired
};

Select.defaultProps = {
    onUpdate: () => {}
};

export default Select;
