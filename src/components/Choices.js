import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    includes, isEqual, uniqueId, without
} from 'lodash-es';
import { DISPLAY_NAME_FILTER_CHOICES, NAME_PREFIX_CHECKBOX, NAME_PREFIX_RADIO } from '../constants';
import CheckBox from './CheckBox';
import Caption from './Caption';
import FilterInfo from './FilterInfo';
import RadioButton from './RadioButton';
import '../scss/Filter.scss';

class Choices extends Component {
    renderChoices() {
        const {
            fieldName, multiple, onUpdate, options, value
        } = this.props;

        if (multiple) {
            return options.map((option, i) => (
                <CheckBox
                    key={ i }
                    id={ uniqueId(NAME_PREFIX_CHECKBOX) }
                    disabled={ option.disabled }
                    facetCount={ option.facetCount }
                    value={ option.value }
                    selected={ (value || []).indexOf(option.value) > -1 }
                    label={ option.label || option.value }
                    onChange={ (selected) => {
                        let newValue = (value || []).slice(0);
                        if (selected && !includes(newValue, option.value)) {
                            newValue.push(option.value);
                        }
                        if (!selected && includes(newValue, option.value)) {
                            newValue = without(newValue, option.value);
                        }
                        if (isEqual(newValue, value)) {
                            return false;
                        }
                        onUpdate(newValue.length ? newValue : null);
                        return true;
                    }}
                />
            ));            
        }

        return options.map((option, i) => (
            <RadioButton
                key={ i }
                id={ uniqueId(NAME_PREFIX_RADIO) }
                name={ fieldName }
                disabled={ option.disabled }
                facetCount={ option.facetCount }
                value={ option.value }
                selected={ value === option.value }
                label={ option.label || option.value }
                onChange={ (selectedValue) => (onUpdate(selectedValue)) }
            />
        ));
    }

    renderNoPreference() {
        const { noPreferenceLabel, multiple } = this.props;

        if (multiple || !noPreferenceLabel) {
            return null;
        }

        const { fieldName, onUpdate, value } = this.props;

        return (
            <RadioButton
                id={ uniqueId(NAME_PREFIX_RADIO) }
                name={ fieldName }
                value="no-preference"
                selected={ !value }
                label={ noPreferenceLabel }
                onChange={ () => (onUpdate(null)) }
            />
        );
    }

    render() {
        const { information, label } = this.props;
        return (
            <div
                className="orizzonte__filter"
            >
                <FilterInfo
                    information={ information }
                />
                <Caption>
                    { label }
                </Caption>
                { this.renderNoPreference() }
                { this.renderChoices() }
            </div>
        );
    }
}

Choices.displayName = DISPLAY_NAME_FILTER_CHOICES;

Choices.propTypes = {
    /** Field name for this filter, to be used in composed query */
    fieldName: PropTypes.string.isRequired,
    information: PropTypes.string,
    /** Label for this filter section */
    label: PropTypes.string,
    /** Whether to show checkboxes (true) or radios (false) */
    multiple: PropTypes.bool,
    /** Label to show if you want to include a 'no preference' option
        Only available for radio groups */
    noPreferenceLabel: PropTypes.string,
    /** Internal callback for when filter value has changed */
    onUpdate: PropTypes.func,
    /** List of selectable options (value is required) */
    options: PropTypes.arrayOf(
        PropTypes.shape({
            disabled: PropTypes.bool,
            facetCount: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]),
            label: PropTypes.string,
            value: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]).isRequired
        })
    ).isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ])
        )
    ])
};

Choices.defaultProps = {
    information: null,
    label: null,
    multiple: false,
    noPreferenceLabel: null,
    onUpdate: () => {},
    value: null
};

export default Choices;
