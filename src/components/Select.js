import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DISPLAY_NAME_FILTER_SELECT } from '../constants';
import Caption from './Caption';
import FilterInfo from './FilterInfo';
import '../scss/Filter.scss';
import '../scss/Select.scss';

const Select = ({ disabled, information, label, notSetLabel, onUpdate, options, value }) => (
    <div
        className="orizzonte__filter"
    >
        <FilterInfo
            information={ information }
        />
        <Caption>
            { label }
        </Caption>
        <select
            className={ classNames('orizzonte__filter-select', {
                'orizzonte__filter-select--disabled': disabled
            }) }
            disabled={ disabled }
            onChange={ (e) => {
                const { value: val } = e.target;
                onUpdate(val);
            }}
            value={ value || '' }
        >
            {
                notSetLabel
                    ? (
                        <option
                            value=""
                        >
                            { notSetLabel }
                        </option>
                    )
                    : null
            }
            { options.map((option, i) => {
                if (option.children) {
                    if (!option.children.length) {
                        return null;
                    }

                    return (
                        <optgroup
                            key={ `${ option.value }.${ i }` }
                            label={ option.value }
                        >
                            { option.children.map((child, j) => (
                                <option
                                    disabled={ child.disabled }
                                    key={ `${ child.value }.${ i }.${ j }` }
                                    value={ child.value }
                                >
                                    { child.label || child.value }
                                </option>
                            )) }
                        </optgroup>
                    );
                }

                return (
                    <option
                        disabled={ option.disabled }
                        key={ `${ option.value }.${ i }` }
                        value={ option.value }
                    >
                        { option.label || option.value }
                    </option>
                );
            }) }
        </select>
    </div>
);

Select.displayName = DISPLAY_NAME_FILTER_SELECT;

Select.propTypes = {
    /** If the select should be disabled */
    disabled: PropTypes.bool,
    information: PropTypes.string,
    /** Label for this filter section */
    label: PropTypes.string,
    /** Which label the first (empty) option should have in case the select can be empty */
    notSetLabel: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    /** Internal callback for when select value has changed */
    onUpdate: PropTypes.func,
    /** List of selectable options (value is required) */
    options: PropTypes.arrayOf(
        PropTypes.shape({
            disabled: PropTypes.bool,
            label: PropTypes.string,
            value: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]).isRequired,
            children: PropTypes.arrayOf(
                PropTypes.shape({
                    disabled: PropTypes.bool,
                    value: PropTypes.oneOfType([
                        PropTypes.number,
                        PropTypes.string
                    ]).isRequired,
                    label: PropTypes.any
                })
            )
        })
    ).isRequired,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

Select.defaultProps = {
    disabled: false,
    information: null,
    label: null,
    notSetLabel: false,
    onUpdate: () => {},
    value: ''
};

export default Select;
