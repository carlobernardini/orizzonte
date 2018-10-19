import React from 'react';
import Group from '../src/components/Group';
import GroupBtn from '../src/components/GroupBtn';
import List from '../src/components/List';
import Select from '../src/components/Select';

describe('<Group />', () => {
    jest.useFakeTimers();

    it('should render a basic group', () => {
        const queryPart = {
            testSelect: 1
        };
        const onGroupToggle = jest.fn();
        const onGroupRemove = jest.fn();
        const onUpdate = jest.fn();

        const wrapper = shallow(
            <Group
                i={ 1 }
                label="Test group"
                onGroupToggle={ onGroupToggle }
                onGroupRemove={ onGroupRemove }
                onUpdate={ onUpdate }
                queryPart={ queryPart }
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
        );

        expect(wrapper).toMatchSnapshot();

        wrapper.find('.orizzonte__group-label').simulate('click');
        expect(onGroupToggle).toHaveBeenCalledWith(1);

        wrapper.setProps({
            active: true
        });

        wrapper.find(List).first().prop('onRemove')();
        expect(wrapper.state().removing).toBe(true);

        expect(onUpdate).toHaveBeenCalledWith(Object.keys(queryPart));
        jest.advanceTimersByTime(300);
        expect(onGroupRemove).toHaveBeenCalledWith(1);
    });

    it('should render an active group with description and min width', () => {
        const map = {};

        document.addEventListener = jest.fn((event, callback) => {
            map[event] = callback;
        });

        const onGroupToggle = jest.fn();

        const wrapper = shallow(
            <Group
                label="Test group"
                description="Description for this group"
                onGroupToggle={ onGroupToggle }
                groupTopLabels
                included
                active
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
        );

        expect(wrapper).toMatchSnapshot();

        map.keyup({
            keyCode: 27
        });

        expect(onGroupToggle).toHaveBeenCalledWith(false);
    });

    it('should render group without clear / remove / done buttons, and higher min width', () => {
        const wrapper = shallow(
            <Group
                label="Test group"
                listMinWidth={ 400 }
                groupTopLabels
                included
                active
                hideClear
                hideRemove
                hideDone
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
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render an active group without top label and no remove button', () => {
        const wrapper = shallow(
            <Group
                label="Test group"
                description="Description for this group"
                hideRemove
                included
                active
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
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render nothing when the group is not included', () => {
        const wrapper = shallow(
            <Group
                label="Test group"
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
        );

        expect(wrapper).toMatchSnapshot();
    });
});
