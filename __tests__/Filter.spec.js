import React from 'react';
import Filter from '../src/components/Filter';

describe('<Filter />', () => {
    it('should render a simple filter', () => {
        const wrapper = shallow(
            <Filter
                label="Language"
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
