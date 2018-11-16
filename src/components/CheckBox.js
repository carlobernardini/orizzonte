import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DEFAULT_CHOICES_VIEWBOX, DISPLAY_NAME_CHECKBOX } from '../constants';
import '../scss/CheckBox.scss';

/**
 * Styled checkbox courtesy from Andreas Storm
 * Source: https://codepen.io/andreasstorm/pen/yjLGGN
 */

const CheckBox = ({ disabled, facetCount, id, label, onChange, selected, value, viewBox }) => (
    <div
        className={ classNames('orizzonte__checkbox', {
            'orizzonte__checkbox--disabled': disabled
        }) }
    >
        <input
            type="checkbox"
            disabled={ disabled }
            id={ id }
            className="orizzonte__checkbox-input"
            value={ value }
            checked={ selected }
            onChange={ (e) => {
                const { checked } = e.target;
                onChange(checked);
            }}
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
                    viewBox={ viewBox || DEFAULT_CHOICES_VIEWBOX }
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
            { facetCount !== null && (
                <span
                    className="orizzonte__checkbox-span orizzonte__checkbox-span--count"
                >
                    { facetCount }
                </span>
            ) }
        </label>
    </div>
);

CheckBox.displayName = DISPLAY_NAME_CHECKBOX;

CheckBox.propTypes = {
    /** If the checkbox should be disabled */
    disabled: PropTypes.bool,
    /** Facet count to be shown at the right of the option */
    facetCount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    /** Internal ID for this checkbox */
    id: PropTypes.string.isRequired,
    /** Label for this checkbox */
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]).isRequired,
    onChange: PropTypes.func,
    /** If the checkbox should be checked */
    selected: PropTypes.bool,
    /** Value for this checkbox */
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired,
    viewBox: PropTypes.array
};

CheckBox.defaultProps = {
    disabled: false,
    facetCount: null,
    onChange: () => {},
    selected: false,
    viewBox: null
};

export default CheckBox;
