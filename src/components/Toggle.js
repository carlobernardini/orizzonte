import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { uniqueId } from 'lodash-es';
import Caption from './Caption';
import FilterInfo from './FilterInfo';
import { NAME_PREFIX_TOGGLE } from '../constants';
import '../scss/Filter.scss';
import '../scss/Toggle.scss';

const Toggle = ({ disabled, information, label, onUpdate, option, value }) => {
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
                    <span
                        className="orizzonte__toggle-control"
                    />
                </label>
            </div>
        </div>
    );
};

Toggle.propTypes = {
    disabled: PropTypes.bool,
    information: PropTypes.string,
    label: PropTypes.string,
    onUpdate: PropTypes.func,
    option: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]).isRequired
    }).isRequired
};

Toggle.defaultProps = {
    disabled: false,
    information: null,
    label: null,
    onUpdate: () => {}
};

export default Toggle;
