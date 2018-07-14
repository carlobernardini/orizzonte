import React from 'react';
import BtnAdd from '../src/components/BtnAdd';

describe('<BtnAdd />', () => {
    it('should render a default add-button', () => {
        const wrapper = shallow(
            <BtnAdd
                available={ [{
                    label: 'Filter 1'
                }, {
                    label: 'Filter 2'
                }] }
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render an add-button that is always shown', () => {
        const wrapper = shallow(
            <BtnAdd
                available={ [{
                    label: 'Filter 1'
                }, {
                    label: 'Filter 2'
                }] }
                shown
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render an add-button with expanded list of available filters', () => {
        const wrapper = shallow(
            <BtnAdd
                available={ [{
                    label: 'Filter 1'
                }, {
                    label: 'Filter 2'
                }] }
                shown
            />
        );

        wrapper.setState({ active: true });

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a disabled add-button', () => {
        const wrapper = shallow(
            <BtnAdd
                available={ [{
                    label: 'Filter 1'
                }, {
                    label: 'Filter 2'
                }] }
                disabled
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a left-positioned add-button', () => {
        const wrapper = shallow(
            <BtnAdd
                available={ [{
                    label: 'Filter 1'
                }, {
                    label: 'Filter 2'
                }] }
                position="left"
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
