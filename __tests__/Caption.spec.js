import React from 'react';
import Caption from '../src/components/Caption';

describe('<Caption />', () => {
    it('should render a filter caption', () => {
        const wrapper = shallow(
            <Caption>
                This is a filter caption
            </Caption>
        );

        expect(wrapper).toMatchSnapshot();
    });
    it('should not render an empty caption', () => {
        const wrapper = shallow(
            <Caption />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
