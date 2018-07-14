import React from 'react';
import RadioButton from '../src/components/RadioButton';

describe('<RadioButton />', () => {
    it('should render a radio button', () => {
        const wrapper = shallow(
            <RadioButton
                id="testRadio1"
                name="testRadioGroup"
                label="Test radio"
                value="test"
                onChange={ () => {}}
            />
        );

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
});
