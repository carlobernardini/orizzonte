import React from 'react';
import Choices from '../src/components/Choices';

describe('<Choices />', () => {
    it('should render a series of checkboxes with some disabled ones', () => {
        const wrapper = shallow(
            <Choices
                fieldName="myAPIField"
                label="Test multiple choices"
                options={ [{
                    label: 'Test value 1',
                    value: 1,
                    disabled: true
                }, {
                    label: 'Test value 2',
                    value: 2
                }, {
                    label: 'Test value 3',
                    value: 3,
                    disabled: true
                }]}
                onUpdate={() => {}}
                multiple
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a series of checkboxes with selected values', () => {
        const wrapper = shallow(
            <Choices
                fieldName="myAPIField"
                label="Test multiple choices"
                options={ [{
                    label: 'Test value 1',
                    value: 1
                }, {
                    label: 'Test value 2',
                    value: 2
                }, {
                    label: 'Test value 3',
                    value: 3
                }]}
                onUpdate={() => {}}
                value={[2, 3]}
                multiple
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a series of radios with some disabled ones', () => {
        const wrapper = shallow(
            <Choices
                fieldName="myAPIField"
                label="Test multiple choices"
                options={ [{
                    label: 'Test value 1',
                    value: 1,
                    disabled: true
                }, {
                    label: 'Test value 2',
                    value: 2
                }, {
                    label: 'Test value 3',
                    value: 3,
                    disabled: true
                }]}
                onUpdate={() => {}}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a series of radios with selected value', () => {
        const wrapper = shallow(
            <Choices
                fieldName="myAPIField"
                label="Test multiple choices"
                options={ [{
                    label: 'Test value 1',
                    value: 1,
                    disabled: true
                }, {
                    label: 'Test value 2',
                    value: 2
                }, {
                    label: 'Test value 3',
                    value: 3,
                    disabled: true
                }]}
                onUpdate={() => {}}
                value={ 3 }
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
