import React from 'react';
import Orizzonte from '../src/components/Orizzonte';

describe('<Orizzonte />', () => {
    it('should render an empty filter container', () => {
        const wrapper = shallow(
            <Orizzonte />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
