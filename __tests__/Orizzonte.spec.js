import React from 'react';
import Orizzonte from '../src/components/Orizzonte';
import { Group, Select } from '../src';
import BtnClearAll from '../src/components/BtnClearAll';
import BtnSave from '../src/components/BtnSave';

describe('<Orizzonte />', () => {
    it('should render an empty filter container', () => {
        const wrapper = shallow(
            <Orizzonte />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a simple filter container with custom className / styles', () => {
        const query = {
            testSelect: 2
        };
        const clearedQuerySnapshot = {
            testSelect: 1
        };
        const onClearAll = jest.fn();
        const onSave = jest.fn();

        const wrapper = shallow(
            <Orizzonte
                className="custom__class"
                style={{
                    border: '3px solid #000'
                }}
                query={ query }
                onClearAll={ onClearAll }
                onSave={ onSave }
                clearedQuerySnapshot={ clearedQuerySnapshot }
            >
                <Group
                    i={ 1 }
                    label="Test group"
                    groupTopLabels
                    included
                >
                    <Select
                        fieldName="testSelect"
                        label="Test select"
                        options={ [{
                            label: 'Test value 1',
                            value: 1
                        }, {
                            label: 'Test value 2',
                            value: 2
                        }] }
                    />
                </Group>
            </Orizzonte>
        );

        expect(wrapper).toMatchSnapshot();

        wrapper.find(Group).first().prop('onGroupToggle')(1);
        expect(wrapper.state().activeGroup).toBe(1);

        wrapper.find('.orizzonte__container').simulate('mouseover');
        expect(wrapper.state().showControls).toBe(true);

        wrapper.find(BtnClearAll).prop('onClearAll')();
        expect(onClearAll).toHaveBeenCalledWith(clearedQuerySnapshot);

        wrapper.find(BtnSave).prop('onSave')();
        expect(onSave).toHaveBeenCalledWith(query);
    });

    it('should unset an active group when clicking outside of the main component', () => {
        const map = {}

        const onGroupRemove = jest.fn();

        document.addEventListener = jest.fn((event, callback) => {
            map[event] = callback;
        });

        const wrapper = mount(
            <Orizzonte
                className="custom__class"
                style={{
                    border: '3px solid #000'
                }}
                collapseGroupOnClickOutside
                maxGroups={ 1 }
                onGroupRemove={ onGroupRemove }
                autoHideTimeout={ 300 }
            >
                <Group
                    i={ 1 }
                    label="Test group"
                    groupTopLabels
                    included
                >
                    <Select
                        fieldName="testSelect"
                        label="Test select"
                        options={ [{
                            label: 'Test value 1',
                            value: 1
                        }, {
                            label: 'Test value 2',
                            value: 2
                        }] }
                    />
                </Group>
            </Orizzonte>
        );

        expect(wrapper.instance().renderAddBtn()).toBeNull();

        map.click({
            target: null
        });
        expect(wrapper.state().activeGroup).toBeNull();

        wrapper.setState({
            activeGroup: null
        });

        expect(wrapper.instance().toggleGroup(false)).toBe(false);

        wrapper.find(Group).first().prop('onGroupRemove')(0)
        expect(onGroupRemove).toHaveBeenCalledWith(0);

        jest.useFakeTimers();
        wrapper.setState({
            showControls: true
        });
        expect(wrapper.instance().toggleControls(false)).toBe(true);
        jest.runAllTimers();
        expect(wrapper.state('showControls')).toBe(false);

    });

    it('should test top-level element event handlers', () => {
        const InvalidNode = () => (
            <div />
        );

        const wrapper = shallow(
            <Orizzonte
                hideOnAllGroupsIncluded
            >
                <InvalidNode />
            </Orizzonte>
        );

        const instance = wrapper.instance();
        jest.spyOn(instance, 'toggleControls');

        wrapper.simulate('focus');
        expect(instance.toggleControls).toHaveBeenCalledWith(true);

        wrapper.simulate('blur', {
            target: {
                contains: jest.fn()
            }
        });
        expect(instance.toggleControls).toHaveBeenCalledWith(true);

        wrapper.simulate('mouseover');
        expect(instance.toggleControls).toHaveBeenCalledWith(true);

        wrapper.simulate('mouseout');
        expect(instance.toggleControls).toHaveBeenCalledWith(false);

        expect(wrapper).toMatchSnapshot();
    });
});
