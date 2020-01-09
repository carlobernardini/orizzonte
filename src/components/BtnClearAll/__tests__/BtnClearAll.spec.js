import React from 'react';
import BtnClearAll from '../BtnClearAll';

const onClearAll = jest.fn();

describe('<BtnClearAll />', () => {
    it('should render a default clear all button', () => {
        const wrapper = shallow(
            <BtnClearAll
                disabled={ false }
                onClearAll={ onClearAll }
                position="left"
                shown
            />
        );

        expect(wrapper).toMatchSnapshot();
        wrapper.find('button').simulate('click');
        expect(onClearAll).toHaveBeenCalledTimes(1);
    });

    it('should render a disabled clear all button', () => {
        const wrapper = shallow(
            <BtnClearAll
                onClearAll={ onClearAll }
                position="left"
                disabled
                shown
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a hidden clear all button', () => {
        const wrapper = (
            <BtnClearAll
                disabled={ false }
                onClearAll={ onClearAll }
                position="left"
                shown={ false }
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a right-positioned clear all button with custom label', () => {
        const wrapper = shallow(
            <BtnClearAll
                clearAllLabel="Reset"
                onClearAll={ onClearAll }
                position="right"
                disabled={ false }
                shown
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
