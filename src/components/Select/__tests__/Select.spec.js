import React from 'react';
import Select from '../Select';

const onUpdate = jest.fn();

describe('<Select />', () => {
    it('should render a normal select', () => {
        const expectedValue = 'test';
        const wrapper = shallow(
            <Select
                label="Test select"
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
                onUpdate={ onUpdate }
            />
        );

        wrapper.find('.orizzonte__filter-select').simulate('change', {
            target: {
                value: expectedValue
            }
        });
        expect(onUpdate).toHaveBeenCalledWith(expectedValue);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a disabled select that allows empty value', () => {
        const wrapper = shallow(
            <Select
                label="Test select"
                notSetLabel="None"
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
                disabled
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a select with selected value', () => {
        const wrapper = shallow(
            <Select
                label="Test select"
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
                value={ 3 }
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a grouped select with some options that only have values and no labels', () => {
        const wrapper = shallow(
            <Select
                label="Test select"
                options={ [{
                    value: 'fallback_label_0'
                }, {
                    value: 'Grouped values',
                    children: [{
                        value: 'fallback_label_1'
                    }, {
                        label: 'Test value 3',
                        value: 3
                    }]
                }, {
                    value: 4,
                    label: 'Test value 4'
                }] }
                value={ 3 }
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a select a group that has no children', () => {
        const wrapper = shallow(
            <Select
                label="Test select"
                options={ [{
                    label: 'Test value 1',
                    value: 1
                }, {
                    value: 'Grouped values',
                    children: []
                }] }
                value={ 1 }
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
