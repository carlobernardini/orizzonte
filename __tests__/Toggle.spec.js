import React from 'react';
import Toggle from '../src/components/Toggle';

describe('<Toggle />', () => {
    it('should render a toggle filter', () => {
        const onUpdate = jest.fn();

        const wrapper = shallow(
            <Toggle
                label="Some toggle"
                option={{
                    label: 'Toggle me on or off',
                    value: 'on'
                }}
                onUpdate={ onUpdate }
            />
        );

        expect(wrapper).toMatchSnapshot();
        wrapper.find('.orizzonte__toggle-input').simulate('change', {
            target: {
                checked: true
            }
        });
        expect(onUpdate).toHaveBeenCalledWith('on');

        wrapper.setProps({
            value: 'on'
        });
        wrapper.find('.orizzonte__toggle-input').simulate('change', {
            target: {
                checked: false
            }
        });
        expect(onUpdate).toHaveBeenCalledWith(null);
    });

    it('should render a toggle filter that only has a value property (no label)', () => {
        const wrapper = shallow(
            <Toggle
                label="Some toggle"
                option={{
                    value: 'Active'
                }}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a disabled toggle filter', () => {
        const wrapper = shallow(
            <Toggle
                label="Some toggle"
                option={{
                    label: 'Toggle me on or off',
                    value: 'on'
                }}
                disabled
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
