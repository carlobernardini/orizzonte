import React from 'react';
import GroupBtn from '../src/components/GroupBtn';

describe('<GroupBtn />', () => {
    it('should render a default group button', () => {
        const onClick = jest.fn();
        const wrapper = shallow(
            <GroupBtn
                onClick={ onClick }
            />
        );

        expect(wrapper).toMatchSnapshot();
        wrapper.simulate('click');
        expect(onClick).toHaveBeenCalledTimes(1);
    });
    

    it('should render a hidden group button', () => {
        const wrapper = shallow(
            <GroupBtn
                hidden
            />
        );

        expect(wrapper).toMatchSnapshot();
    }); 
});
