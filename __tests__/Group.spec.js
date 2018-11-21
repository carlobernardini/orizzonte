import React from 'react';
import Dropdown from '../src/components/Dropdown';
import FullText from '../src/components/FullText';
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
                    selectedLabel="testSelect: %s"
                />
            </Group>
        );

        expect(wrapper).toMatchSnapshot();

        expect(wrapper.instance().renderLabel()).toBe('testSelect: Test value 1');

        wrapper.find('.orizzonte__group-label').simulate('click');
        expect(onGroupToggle).toHaveBeenCalledWith(1);

        wrapper.setProps({
            active: true
        });

        wrapper.find(List).first().prop('onRemove')();
        expect(wrapper.state().removing).toBe(true);

        expect(onUpdate).toHaveBeenCalledWith(Object.keys(queryPart));
        jest.advanceTimersByTime(500);
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
                queryPart={{
                    testSelect: 1
                }}
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

    it('should return a correct label for multiselects', () => {
        const wrapper = shallow(
            <Group
                queryPart={{
                    testDropdown: [1, 2]
                }}
                label="Some group"
            >
                <Dropdown
                    fieldName="testDropdown"
                    label="My dropdown"
                    options={ [{
                        label: 'First',
                        value: 1
                    }, {
                        label: 'Second',
                        value: 2
                    }, {
                        label: 'Third',
                        value: 3
                    }] }
                    selectedLabel={ (options) => {
                        const labels = options.map((option) => (option.label.toLowerCase()));
                        return `Selected ${ labels.join(', ') }`;
                    }}
                />
            </Group>
        );

        expect(wrapper.instance().renderLabel()).toBe('Selected first, second');
    });

    it('should render a correct label for filters without options (e.g. fulltext)', () => {
        const wrapper = shallow(
            <Group
                queryPart={{
                    testFullText: 'test'
                }}
                label="Some group"
            >
                <FullText
                    fieldName="testFullText"
                    label="My fulltext filter"
                    selectedLabel="Value equals %s"
                />
            </Group>
        );

        expect(wrapper.instance().renderLabel()).toBe('Value equals test');
    });

    it('should not render top labels if no filters available and test error boundary', () => {
        const wrapper = shallow(
            <Group
                label="Test group"
                groupTopLabels
                included
            />
        );

        expect(wrapper.instance().renderTopLabel()).toBeNull();

        wrapper.setState({
            hasError: true
        });

        expect(wrapper).toMatchSnapshot();
    })
});
