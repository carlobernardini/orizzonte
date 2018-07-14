import React from 'react';
import Choices from '../src/components/Choices';
import List from '../src/components/List';
import Select from '../src/components/Select';

describe('<List />', () => {
    it('should render a list of filters', () => {
        const wrapper = shallow(
            <List
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

    it('should render a list of filters without done button', () => {
        const wrapper = shallow(
            <List
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
});
