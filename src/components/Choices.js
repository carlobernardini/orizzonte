import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { includes, isEqual, uniqueId, without } from 'lodash';
import CheckBox from './CheckBox';
import RadioButton from './RadioButton';
import '../scss/Filter.scss';

class Choices extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: []
        };
    }

    renderChoices() {
        const {
            fieldName, multiple, onUpdate, options
        } = this.props;

        if (multiple) {
            return options.map((option, i) => (
                <CheckBox
                    key={ i }
                    id={ uniqueId('checkbox-') }
                    disabled={ option.disabled }
                    value={ option.value }
                    label={ option.label || option.value }
                    onChange={ (selected) => {
                        let value = [...this.state.value];
                        if (selected && !includes(value, option.value)) {
                            value.push(option.value);
                        }
                        if (!selected && includes(value, option.value)) {
                            value = without(value, option.value);
                        }
                        if (isEqual(value, this.state.value)) {
                            return false;
                        }
                        this.setState({
                            value
                        });
                        onUpdate(value);
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
                label={ option.label || option.value }
                onChange={ (selectedValue) => {
                    let value = [...this.state.value];
                    
                    value = [selectedValue];

                    this.setState({
                        value
                    });
                    onUpdate(value[0]);
                    return true;
                }}
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
    /** Whether to show checkboxes (true) or radios (false) */
    multiple: PropTypes.bool
};

Choices.defaultProps = {
    onUpdate: () => {},
    multiple: false
};

export default Choices;
