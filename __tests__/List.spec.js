import React from 'react';
import Choices from '../src/components/Choices';
import List from '../src/components/List';
import Select from '../src/components/Select';

describe('<List />', () => {
    it('should render a list of filters', () => {
        const fieldName = 'myAPIField';
        const onUpdate = jest.fn();
        const wrapper = shallow(
            <List
                isFilterGroup
                onUpdate={ onUpdate }
                items={ [
                    <Select
                        fieldName={ fieldName }
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
                        notSetLabel="None"
                    />,
                    <Choices
                        fieldName="myAPIField"
                        label="Test multiple choices"
                        options={ [{
                            label: 'Test value 1',
                            value: 1,
                            disabled: true
                        }, {
                            label: 'Test value 2',
                            value: 2
                        }, {
                            label: 'Test value 3',
                            value: 3,
                            disabled: true
                        }]}
                        multiple
                    />
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();

        wrapper.find(Select).props().onUpdate(1);
        expect(onUpdate).toHaveBeenCalledWith(fieldName, 1);
    });

    it('should render a list of filters without done button', () => {
        const wrapper = shallow(
            <List
                isFilterGroup
                doneBtn={ false }
                items={ [
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
                    />,
                    <Choices
                        fieldName="myAPIField"
                        label="Test multiple choices"
                        options={ [{
                            label: 'Test value 1',
                            value: 1,
                            disabled: true
                        }, {
                            label: 'Test value 2',
                            value: 2
                        }, {
                            label: 'Test value 3',
                            value: 3,
                            disabled: true
                        }]}
                        onUpdate={() => {}}
                        multiple
                    />
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a list of filters with custom done button and orientation', () => {
        const wrapper = shallow(
            <List
                isFilterGroup
                doneBtnLabel="Apply"
                orientation="right"
                items={ [
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
                    />,
                    <Choices
                        fieldName="myAPIField"
                        label="Test multiple choices"
                        options={ [{
                            label: 'Test value 1',
                            value: 1,
                            disabled: true
                        }, {
                            label: 'Test value 2',
                            value: 2
                        }, {
                            label: 'Test value 3',
                            value: 3,
                            disabled: true
                        }]}
                        onUpdate={() => {}}
                        multiple
                    />
                ]}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a list of clickable items', () => {
        const items = [{
            label: 'Filter 1'
        }, {
            label: 'Filter 2'
        }];

        const wrapper = shallow(
            <List
                items={ items.map((item) => (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        href="#"
                        className="orizzonte__item-clickable"
                        onClick={ jest.fn() }
                    >
                        { item.label }
                    </a>
                ))}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
