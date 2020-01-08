import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import Caption from './Caption';
import FilterInfo from './FilterInfo';
import { DISPLAY_NAME_TOGGLE, NAME_PREFIX_TOGGLE } from '../constants';

const Toggle = ({ disabled, information, label, onUpdate, option, toggleStateLabel, value }) => {
    const id = uniqueId(NAME_PREFIX_TOGGLE);

    return (
        <div
            className="orizzonte__filter"
        >
            { !!label && (
                <FilterInfo
                    information={ information }
                />
            ) }
            <Caption>
                { label }
            </Caption>
            <div
                className={ classNames('orizzonte__toggle', {
                    'orizzonte__toggle--disabled': disabled
                }) }
            >
                <input
                    checked={ !!value }
                    className="orizzonte__toggle-input"
                    disabled={ disabled }
                    id={ id }
                    type="checkbox"
                    value={ option.value }
                    onChange={ (e) => {
                        const { checked } = e.target;
                        onUpdate(checked ? option.value : null);
                    }}
                />
                <label
                    htmlFor={ id }
                    className="orizzonte__toggle-label"
                >
                    <span
                        className="orizzonte__toggle-text"
                    >
                        { option.label || option.value }
                    </span>
                    { !!toggleStateLabel && (
                        <span
                            className={ classNames('orizzonte__toggle-state', {
                                'orizzonte__toggle-state--on': !!value
                            }) }
                        >
                            { value ? toggleStateLabel.on : toggleStateLabel.off }
                        </span>
                    ) }
                    <span
                        className="orizzonte__toggle-control"
                    />
                </label>
            </div>
        </div>
    );
};

Toggle.displayName = DISPLAY_NAME_TOGGLE;

Toggle.propTypes = {
    /** Disables the toggle switch */
    disabled: PropTypes.bool,
    /** Information tooltip for this filter (requires label prop to be defined */
    information: PropTypes.string,
    /** Label for this filter section */
    label: PropTypes.string,
    /** Internal callback for when filter state has changed */
    onUpdate: PropTypes.func,
    /** The label and value for this field. Value is used when switched on. */
    option: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]).isRequired
    }).isRequired,
    /** String indicators for the current toggle state, to be shown next to
        the toggle switch button */
    toggleStateLabel: PropTypes.shape({
        on: PropTypes.string.isRequired,
        off: PropTypes.string.isRequired
    }),
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

Toggle.defaultProps = {
    disabled: false,
    information: null,
    label: null,
    onUpdate: () => {},
    toggleStateLabel: null,
    value: null
};

export default Toggle;
