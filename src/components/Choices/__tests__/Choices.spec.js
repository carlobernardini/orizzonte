import React from 'react';
import Choices from '../Choices';
import CheckBox from '../../CheckBox';
import RadioButton from '../../RadioButton';

describe('<Choices />', () => {
    it('should render a series of checkboxes with some disabled ones', () => {
        const onUpdate = jest.fn();

        const wrapper = shallow(
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
                onUpdate={ onUpdate }
                multiple
            />
        );

        expect(wrapper).toMatchSnapshot();

        wrapper.find(CheckBox).at(1).prop('onChange')(true);
        expect(onUpdate).toHaveBeenCalledWith([2]);
    });

    it('should not update anything if option already checked', () => {
        const onUpdate = jest.fn();

        const wrapper = shallow(
            <Choices
                fieldName="myAPIField"
                label="Test multiple choices"
                options={ [{
                    value: 1,
                    disabled: true
                }, {
                    value: 2
                }, {
                    value: 3,
                    disabled: true
                }]}
                onUpdate={ onUpdate }
                value={[2]}
                multiple
            />
        );

        wrapper.find(CheckBox).at(1).prop('onChange')(true);
        expect(onUpdate).not.toHaveBeenCalled();

        wrapper.find(CheckBox).at(1).prop('onChange')(false);
        expect(onUpdate).toHaveBeenCalledWith(null);
    });

    it('should render a series of checkboxes with selected values', () => {
        const onUpdate = jest.fn();

        const wrapper = shallow(
            <Choices
                fieldName="myAPIField"
                label="Test multiple choices"
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
                onUpdate={ onUpdate }
                value={[2, 3]}
                multiple
            />
        );

        expect(wrapper).toMatchSnapshot();

        wrapper.find(CheckBox).at(2).prop('onChange')();
        expect(onUpdate).toHaveBeenCalledWith([2]);

        wrapper.find(CheckBox).first().prop('onChange')(true);
        expect(onUpdate).toHaveBeenCalledWith([2, 3, 1]);
    });

    it('should render a series of radios with some disabled ones', () => {
        const wrapper = shallow(
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
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a series of radios with selected value', () => {
        const onUpdate = jest.fn();

        const wrapper = shallow(
            <Choices
                fieldName="myAPIField"
                label="Test multiple choices"
                options={ [{
                    value: '1',
                    disabled: true
                }, {
                    value: '2'
                }, {
                    value: '3',
                    disabled: true
                }] }
                onUpdate={ onUpdate }
                value={ 3 }
            />
        );

        expect(wrapper).toMatchSnapshot();

        wrapper.find(RadioButton).at(1).prop('onChange')('2');
        expect(onUpdate).toHaveBeenCalledWith('2');
    });

    it('should render a series of radios with no preference option', () => {
        const onUpdate = jest.fn();

        const wrapper = shallow(
            <Choices
                fieldName="myAPIField"
                label="Test multiple choices"
                noPreferenceLabel="No preference"
                options={ [{
                    label: 'Test value 1',
                    value: 1
                }, {
                    label: 'Test value 2',
                    value: 2
                }, {
                    label: 'Test value 3',
                    value: 3
                }] }
                onUpdate={ onUpdate }
                value={ 3 }
            />
        );

        expect(wrapper).toMatchSnapshot();

        wrapper.find(RadioButton).first().prop('onChange')();
        expect(onUpdate).toHaveBeenCalledWith(null);
    });

    it('should render a series of checkboxes with facet counts', () => {
        const wrapper = shallow(
            <Choices
                fieldName="myAPIField"
                label="Test facet counts on checkboxes"
                options={ [{
                    label: 'Test value 1',
                    value: 1,
                    facetCount: 123
                }, {
                    label: 'Test value 2',
                    value: 2,
                    facetCount: 123
                }, {
                    label: 'Test value 3',
                    value: 3,
                    facetCount: 123
                }] }
                value={ [1, 3] }
                multiple
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a series of radios with facet counts', () => {
        const wrapper = shallow(
            <Choices
                fieldName="myAPIField"
                label="Test facet counts on radios"
                options={ [{
                    label: 'Test value 1',
                    value: 1,
                    facetCount: 123
                }, {
                    label: 'Test value 2',
                    value: 2,
                    facetCount: 123
                }, {
                    label: 'Test value 3',
                    value: 3,
                    facetCount: 123
                }] }
                value={ 3 }
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
