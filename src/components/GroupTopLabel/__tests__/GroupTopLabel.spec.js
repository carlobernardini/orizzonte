import React from 'react';
import GroupTopLabel from '../GroupTopLabel';

describe('<GroupTopLabel />', () => {
    it('should render a hidden group top label', () => {
        const wrapper = shallow(
            <GroupTopLabel>
                Test
            </GroupTopLabel>
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a shown group top label', () => {
        const wrapper = shallow(
            <GroupTopLabel
                shown
            >
                Test
            </GroupTopLabel>
        );

        expect(wrapper).toMatchSnapshot();
    });
});
