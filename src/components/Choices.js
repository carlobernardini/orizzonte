import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import CheckBox from './CheckBox';
import RadioButton from './RadioButton';
import '../scss/Filter.scss';

class Choices extends Component {
    renderChoices() {
        const { multiple, options } = this.props;

        if (multiple) {
            return options.map((option, i) => (
                <CheckBox
                    key={ i }
                    id={ uniqueId('checkbox-') }
                    value={ option.value }
                    label={ option.label || option.value }
                />
            ));            
        }

        return options.map((option, i) => (
            <RadioButton
                key={ i }
                id={ uniqueId('radio-') }
                name="orizzonte"
                value={ option.value }
                label={ option.label || option.value }
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
    /** Label for this filter section */
    label: PropTypes.string.isRequired,
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
    multiple: PropTypes.bool
};

Choices.defaultProps = {
    multiple: false
};

export default Choices;
