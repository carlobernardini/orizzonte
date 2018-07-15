import React from 'react';
import Select from '../src/components/Select';

describe('<Select />', () => {
    it('should render a normal select', () => {
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
                onUpdate={() => {}}
            />
        );

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
});
