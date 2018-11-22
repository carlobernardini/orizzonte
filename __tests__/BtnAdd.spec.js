import React from 'react';
import BtnAdd from '../src/components/BtnAdd';
import List from '../src/components/List';

const onGroupAdd = jest.fn();

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

    it('should render an add-button that is (always) shown', () => {
        const wrapper = shallow(
            <BtnAdd
                available={ [{
                    i: 0,
                    label: 'Filter 1'
                }, {
                    i: 1,
                    label: 'Filter 2'
                }] }
                onGroupAdd={ onGroupAdd }
                shown
            />
        );

        expect(wrapper).toMatchSnapshot();
        wrapper.find('.orizzonte__btn-add').simulate('click');
        expect(wrapper.state().active).toBe(true);
        wrapper.find(List).childAt(0).simulate('click', {
            preventDefault: () => {}
        });
        expect(onGroupAdd).toHaveBeenCalledWith(0, 'Filter 1');
        expect(wrapper.state().active).toBe(false);
    });

    it('should render an add-button with expanded list of available filters', () => {
        const component = (
            <BtnAdd
                available={ [{
                    label: 'Filter 1'
                }, {
                    label: 'Filter 2'
                }] }
                shown
            />
        );
        const wrapper = shallow(component);
        wrapper.setState({ active: true });
        expect(wrapper).toMatchSnapshot();

        document.body.innerHTML = `
            <div>
                body
            </div>
        `;
        const mountedComponent = mount(component);

        document.body.click();
        expect(mountedComponent.state().active).toBe(false);

        document.removeEventListener = jest.fn();
        mountedComponent.unmount();
        expect(document.removeEventListener).toHaveBeenCalledTimes(1);
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

    it('should render a labeled add-button', () => {
        const wrapper = shallow(
            <BtnAdd
                available={ [{
                    label: 'Filter 1'
                }, {
                    label: 'Filter 2'
                }] }
                label="Add more groups"
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
