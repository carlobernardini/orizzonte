import React from 'react';
import RadioButton from '../src/components/RadioButton';

const onChange = jest.fn();

describe('<RadioButton />', () => {
    it('should render a radio button', () => {
        const value = 'test';
        const wrapper = shallow(
            <RadioButton
                id="testRadio1"
                name="testRadioGroup"
                label="Test radio"
                value={ value }
                onChange={ onChange }
            />
        );

        wrapper.find('.orizzonte__radio-input').simulate('change');
        expect(onChange).toHaveBeenCalledWith(value);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a disabled radio button', () => {
        const wrapper = shallow(
            <RadioButton
                id="testRadio1"
                name="testRadioGroup"
                label="Test radio"
                value="test"
                disabled
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a selected radio button', () => {
        const wrapper = shallow(
            <RadioButton
                id="testRadio1"
                name="testRadioGroup"
                label="Test radio"
                value="test"
                selected
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a radio button with facet count', () => {
        const wrapper = shallow(
            <RadioButton
                id="testRadio1"
                name="testRadioGroup"
                label="Test radio"
                value="test"
                facetCount={ 123 }
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
