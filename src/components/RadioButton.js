import React from 'react';
import PropTypes from 'prop-types';
import '../scss/RadioButton.scss';

const RadioButton = ({ id, label, name, value }) => (
    <div
        className="orizzonte__radio"
    >
        <input
            type="radio"
            id={ id }
            name={ name }
            className="orizzonte__radio-input"
            value={ value }
        />
        <label
            htmlFor={ id }
            className="orizzonte__radio-label"
        >
            <span
                className="orizzonte__radio-span orizzonte__radio-span--first"
            >
                <svg
                    className="orizzonte__radio-svg"
                    width="12px"
                    height="10px"
                    viewBox="0 0 10 10"
                >
                    <circle
                        cx="5"
                        cy="6"
                        r="3"
                    />
                </svg>
            </span>
            <span
                className="orizzonte__radio-span orizzonte__radio-span--last"
            >
                { label }
            </span>
        </label>
    </div>
);

RadioButton.propTypes = {
    /** Internal ID for this radio button */
    id: PropTypes.string.isRequired,
    /** Label for this radio button */
    label: PropTypes.string.isRequired,
    /** Name for current series of radio buttons*/
    name: PropTypes.string.isRequired,
    /** Value for this radio button */
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired
};

export default RadioButton;
