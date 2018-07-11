import React from 'react';
import BtnAdd from '../src/components/BtnAdd';

describe('<BtnAdd />', () => {
    it('should render a default add-button', () => {
        const wrapper = shallow(
            <BtnAdd />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a shown add-button', () => {
        const wrapper = shallow(
            <BtnAdd
                shown
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a disabled add-button', () => {
        const wrapper = shallow(
            <BtnAdd
                disabled
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a left-positioned add-button', () => {
        const wrapper = shallow(
            <BtnAdd
                position="left"
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
