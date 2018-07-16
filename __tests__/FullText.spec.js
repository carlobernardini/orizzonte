import React from 'react';
import FullText from '../src/components/FullText';

const onUpdate = jest.fn();

describe('<FullText />', () => {
    it('should render a fulltext filter', () => {
        const expectedValue = 'some keywords';
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
        expect(onUpdate).toHaveBeenCalledWith(expectedValue);
        wrapper.find('.orizzonte__filter-fulltext').simulate('change', {
            target: {
                value: ''
            }
        });
        expect(onUpdate).toHaveBeenCalledWith(null);
        expect(wrapper).toMatchSnapshot();
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

    it('should render a fulltext filter with current value', () => {
        const wrapper = shallow(
            <FullText
                label="Fulltext filter"
                placeholder="This is a textarea placeholder..."
                value="Current textarea value"
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
