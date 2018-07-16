import React from 'react';
import LoadingIndicator from '../src/components/LoadingIndicator';

describe('<LoadingIndicator />', () => {
    it('should render a default loading indicator', () => {
        const wrapper = shallow(
            <LoadingIndicator />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a custom loading indicator', () => {
        const wrapper = shallow(
            <LoadingIndicator
                size="12"
            />
        );

        expect(wrapper).toMatchSnapshot();
    });
});
