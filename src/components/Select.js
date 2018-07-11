import React from 'react';
import PropTypes from 'prop-types';
import '../scss/Filter.scss';
import '../scss/Select.scss';

const Select = ({ label, options }) => (
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
        >
            { options.map((option) => (
                <option
                    value={ option.value }
                >
                    { option.label || option.value }
                </option>
            )) }
        </select>
    </div>
);

Select.propTypes = {
    label: PropTypes.string.isRequired,
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

export default Select;
