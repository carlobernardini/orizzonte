import React from 'react';
import CheckBox from '../src/components/CheckBox';

describe('<CheckBox />', () => {
    it('should render a checkbox', () => {
        const wrapper = shallow(
            <CheckBox
                id="testCheckbox"
                label="Test checkbox"
                value="test"
                onChange={ () => {}}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a disabled checkbox', () => {
        const wrapper = shallow(
            <CheckBox
                id="testCheckbox"
                label="Test checkbox"
                value="test"
                disabled
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a selected checkbox', () => {
        const wrapper = shallow(
            <CheckBox
                id="testCheckbox"
                label="Test checkbox"
                value="test"
                selected
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
