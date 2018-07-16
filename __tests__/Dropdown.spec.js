import React from 'react';
import Dropdown from '../src/components/Dropdown';

describe('<Dropdown />', () => {
    it('should render a default, collapsed dropdown without filtering and selected values', () => {
        const wrapper = shallow(
            <Dropdown
                fieldName="country"
                label="Country"
                selectedLabel={ (n) => (n.length === 1 ? 'One Country' : `${ n.length } Countries`) }
                options={[{
                    label: 'Austria',
                    value: 'at'
                }, {
                    label: 'Portugal',
                    value: 'pt'
                }, {
                    label: 'Ireland',
                    value: 'ie'
                }]}
            />
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render an expanded dropdown multiselect with filtering', () => {
        const wrapper = shallow(
            <Dropdown
                fieldName="country"
                label="Country"
                selectedLabel={ (n) => (n.length === 1 ? 'One Country' : `${ n.length } Countries`) }
                options={[{
                    label: 'Austria',
                    value: 'at'
                }, {
                    label: 'Portugal',
                    value: 'pt'
                }, {
                    label: 'Ireland',
                    value: 'ie'
                }]}
                multiple
                value={['at', 'ie']}
                filter={{
                    enabled: true,
                    placeholder: 'Search options...'
                }}
            />
        );

        wrapper.setState({
            expanded: true,
            filter: 'aus'
        });

        expect(wrapper).toMatchSnapshot();
    });
});
