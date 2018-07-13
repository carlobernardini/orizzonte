import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    includes, isEqual, uniqueId, without
} from 'lodash';
import CheckBox from './CheckBox';
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
                    id={ uniqueId('checkbox-') }
                    disabled={ option.disabled }
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
                        onUpdate(newValue);
                        return true;
                    }}
                />
            ));            
        }

        return options.map((option, i) => (
            <RadioButton
                key={ i }
                id={ uniqueId('radio-') }
                name={ fieldName }
                disabled={ option.disabled }
                value={ option.value }
                selected={ value === option.value }
                label={ option.label || option.value }
                onChange={ (selectedValue) => (onUpdate(selectedValue)) }
            />
        ));
    }

    render() {
        const { label } = this.props;
        return (
            <div
                className="orizzonte__filter"
            >
                <div
                    className="orizzonte__filter-caption"
                >
                    { label }
                </div>
                { this.renderChoices() }
            </div>
        );
    }
}

Choices.propTypes = {
    /** Field name for this filter, to be used in composed query */
    fieldName: PropTypes.string.isRequired,
    /** Label for this filter section */
    label: PropTypes.string.isRequired,
    /** Whether to show checkboxes (true) or radios (false) */
    multiple: PropTypes.bool,
    /** Internal callback for when filter value has changed */
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
    multiple: false,
    onUpdate: () => {},
    value: null
};

export default Choices;
