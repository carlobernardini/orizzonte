import React from 'react';
import FullText from '../src/components/FullText';

describe('<FullText />', () => {
    it('should render a fulltext filter', () => {
        const wrapper = shallow(
            <FullText
                label="Fulltext filter"
                placeholder="This is a textarea placeholder..."
                onUpdate={ () => {} }
            />
        );

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
