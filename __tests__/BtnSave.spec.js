import React from 'react';
import BtnSave from '../src/components/BtnSave';

const onSave = jest.fn();

describe('<BtnSave />', () => {
    it('should render a default save button', () => {
        const wrapper = shallow(
            <BtnSave
                disabled={ false }
                onSave={ onSave }
                position="left"
                shown
            />
        );

        expect(wrapper).toMatchSnapshot();
        wrapper.find('button').simulate('click');
        expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('should render a disabled save button', () => {
        const wrapper = shallow(
            <BtnSave
                onSave={ onSave }
                position="left"
                disabled
                shown
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a hidden save button', () => {
        const wrapper = (
            <BtnSave
                disabled={ false }
                onSave={ onSave }
                position="left"
                shown={ false }
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a right-positioned save button with custom label', () => {
        const wrapper = shallow(
            <BtnSave
                saveLabel="Store"
                onSave={ onSave }
                position="right"
                disabled={ false }
                shown
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
