import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    findIndex, isEqual, uniqueId
} from 'lodash';
import CheckBox from './CheckBox';
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
                    id={ uniqueId('checkbox-') }
                    disabled={ option.disabled }
                    value={ option.value }
                    selected={ (value || []).indexOf(option.value) > -1 }
                    label={ option.label || option.value }
                    onChange={ (selected) => {
                        let newValue = options
                            .slice(0)
                            .filter((o) => ((value || []).indexOf(o.value) > -1));

                        if (selected && findIndex(newValue, ['value', option.value]) === -1) {
                            newValue.push(option);
                        }

                        if (!selected && findIndex(newValue, ['value', option.value]) > -1) {
                            newValue = newValue.filter((o) => (o.value !== option.value));
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
                id={ uniqueId('radio-') }
                name={ fieldName }
                disabled={ option.disabled }
                value={ option.value }
                selected={ value && value === option.value }
                label={ option.label || option.value }
                onChange={ (selectedValue) => (onUpdate(selectedValue)) }
            />
        ));
    }

    render() {
        const { information, label } = this.props;
        return (
            <div
                className="orizzonte__filter"
            >
                <FilterInfo information={ information } />
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
    information: PropTypes.string,
    /** Label for this filter section */
    label: PropTypes.string.isRequired,
    /** Whether to show checkboxes (true) or radios (false) */
    multiple: PropTypes.bool,
    /** Internal callback for when filter value has changed */
    onUpdate: PropTypes.func,
    /** List of selectable options (value is required) */
    options: PropTypes.arrayOf(
        PropTypes.shape({
            disabled: PropTypes.bool,
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
    multiple: false,
    onUpdate: () => {},
    value: null
};

export default Choices;
