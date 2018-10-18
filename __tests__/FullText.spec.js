import React from 'react';
import FullText from '../src/components/FullText';

describe('<FullText />', () => {
    jest.useFakeTimers();

    it('should render a fulltext filter', () => {
        const expectedValue = 'some keywords';
        const onUpdate = jest.fn();

        const wrapper = shallow(
            <FullText
                label="Fulltext filter"
                placeholder="This is a textarea placeholder..."
                onUpdate={ onUpdate }
            />
        );

        wrapper.find('.orizzonte__filter-fulltext').simulate('change', {
            target: {
                value: expectedValue
            }
        });

        expect(wrapper.state().value).toBe(expectedValue);
        jest.runAllTimers();
        expect(onUpdate).toHaveBeenCalledWith(expectedValue);
        expect(wrapper).toMatchSnapshot();

        wrapper.find('.orizzonte__filter-fulltext').simulate('change', {
            target: {
                value: ''
            }
        });

        jest.runAllTimers();
        expect(onUpdate).toHaveBeenCalledWith(null);
    });

    it('should render a disabled fulltext filter', () => {
        const wrapper = shallow(
            <FullText
                label="Fulltext filter"
                placeholder="This is a textarea placeholder..."
                disabled
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a multiline fulltext filter with current value and max width / height', () => {
        const wrapper = shallow(
            <FullText
                label="Fulltext filter"
                placeholder="This is a textarea placeholder..."
                value="Current textarea value"
                maxWidth={ 500 }
                maxHeight={ 500 }
                multiline
            />
        );

        expect(wrapper).toMatchSnapshot();

        wrapper.setProps({
            value: 'updated value'
        });

        expect(wrapper.state().derivedValue).toBe('updated value');

        wrapper.setProps({
            value: null
        });

        expect(wrapper.state()).toEqual({
            derivedValue: null,
            value: ''
        });
    });

    it('should render a fulltext filter with input validation', () => {
        const onUpdate = jest.fn();

        const wrapper = shallow(
            <FullText
                label="Fulltext filter"
                placeholder="This is a textarea placeholder..."
                onUpdate={ onUpdate }
                validateInput={ (value) => (
                    !(/[0-9]/g.test(value))
                )}
            />
        );

        wrapper.find('.orizzonte__filter-fulltext').simulate('change', {
            target: {
                value: '123'
            }
        });

        expect(wrapper.state().value).toBe('123');
        jest.runAllTimers();
        expect(wrapper.find('.orizzonte__filter-fulltext').hasClass('orizzonte__filter-fulltext--invalid')).toBe(true);
        expect(onUpdate).not.toHaveBeenCalled();
        expect(wrapper.state().derivedValue).toBeNull();
    });
});
