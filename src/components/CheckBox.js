import React from 'react';
import PropTypes from 'prop-types';
import '../scss/CheckBox.scss';

/**
 * Styled checkbox courtesy from Andreas Storm
 * Source: https://codepen.io/andreasstorm/pen/yjLGGN
 */

const CheckBox = ({ id, label, value }) => (
    <div
        className="orizzonte__checkbox"
    >
        <input
            type="checkbox"
            id={ id }
            className="orizzonte__checkbox-input"
            value={ value }
        />
        <label
            htmlFor={ id }
            className="orizzonte__checkbox-label"
        >
            <span
                className="orizzonte__checkbox-span orizzonte__checkbox-span--first"
            >
                <svg
                    className="orizzonte__checkbox-svg"
                    width="12px"
                    height="10px"
                    viewBox="0 0 10px 0"
                >
                    <polyline
                        points="1.5 6 3.5 9 8 3"
                    />
                </svg>
            </span>
            <span
                className="orizzonte__checkbox-span orizzonte__checkbox-span--last"
            >
                { label }
            </span>
        </label>
    </div>
);

CheckBox.propTypes = {
    /** Internal ID for this checkbox */
    id: PropTypes.string.isRequired,
    /** Label for this checkbox */
    label: PropTypes.string.isRequired,
    /** Value for this checkbox */
    value: PropTypes.string.isRequired
};

export default CheckBox;
