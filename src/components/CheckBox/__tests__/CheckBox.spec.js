import React from 'react';
import CheckBox from '../CheckBox';

const onChange = jest.fn();

describe('<CheckBox />', () => {
    it('should render a checkbox', () => {
        const expectedCheckState = true;
        const wrapper = shallow(
            <CheckBox
                id="testCheckbox"
                label="Test checkbox"
                value="test"
                onChange={ onChange }
            />
        );

        wrapper.find('.orizzonte__checkbox-input').simulate('change', {
            target: {
                checked: expectedCheckState
            }
        });
        expect(onChange).toHaveBeenCalledWith(expectedCheckState);
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

    it('should render a checkbox with facet count', () => {
        const wrapper = shallow(
            <CheckBox
                id="testCheckbox"
                label="Test checkbox"
                value="test"
                facetCount={ 123 }
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
