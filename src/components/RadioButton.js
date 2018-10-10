import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DEFAULT_CHOICES_VIEWBOX } from '../constants';
import '../scss/RadioButton.scss';

const RadioButton = ({ disabled, id, label, name, onChange, value, viewBox, selected }) => (
    <div
        className={ classNames('orizzonte__radio', {
            'orizzonte__radio--disabled': disabled
        }) }
    >
        <input
            type="radio"
            disabled={ disabled }
            id={ id }
            name={ name }
            className="orizzonte__radio-input"
            value={ value }
            checked={ selected }
            onChange={ () => {
                onChange(value);
            }}
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
                    viewBox={ viewBox || DEFAULT_CHOICES_VIEWBOX }
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

RadioButton.displayName = 'OrizzonteRadioButton';

RadioButton.propTypes = {
    /** If the radio button should be disabled */
    disabled: PropTypes.bool,
    /** Internal ID for this radio button */
    id: PropTypes.string.isRequired,
    /** Label for this radio button */
    label: PropTypes.string.isRequired,
    /** Name for current series of radio buttons */
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    /** If the radio button should be checked */
    selected: PropTypes.bool,
    /** Value for this radio button */
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired,
    viewBox: PropTypes.array
};

RadioButton.defaultProps = {
    disabled: false,
    onChange: () => {},
    selected: false,
    viewBox: null
};

export default RadioButton;
