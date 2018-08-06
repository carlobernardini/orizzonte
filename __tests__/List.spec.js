import React from 'react';
import Choices from '../src/components/Choices';
import List from '../src/components/List';
import Select from '../src/components/Select';

describe('<List />', () => {
    it('should render a list of filters', () => {
        const fieldName = 'myAPIField';
        const onApply = jest.fn();
        const onUpdate = jest.fn();
        const wrapper = shallow(
            <List
                isFilterGroup
                onApply={ onApply }
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

        wrapper.find('.orizzonte__list-done').simulate('click');
        expect(onApply).toHaveBeenCalled();
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

    it('should render a list of filters with clear button, custom done button and custom orientation', () => {
        const onClear = jest.fn();

        const wrapper = shallow(
            <List
                isFilterGroup
                clearBtn
                doneBtnLabel="Apply"
                orientation="right"
                onClear={ onClear }
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

        wrapper.find('.orizzonte__list-clear').simulate('click');
        expect(onClear).toHaveBeenCalled();
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
