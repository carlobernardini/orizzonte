import React from 'react';
import FilterInfo from '../FilterInfo';

describe('<FilterInfo />', () => {
    it('should render a default filter info tooltip', () => {
        const wrapper = shallow(
            <FilterInfo
                information="Some filter information"
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should not render anything if prop is empty', () => {
        const wrapper = shallow(
            <FilterInfo />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
