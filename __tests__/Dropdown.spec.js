import React from 'react';
import Dropdown from '../src/components/Dropdown';

const labelTransformerFunction = (value) => (
    value.length === 1 ? value[0].label : `${ value.length } Countries`
);

describe('<Dropdown />', () => {
    it('should render a default, collapsed dropdown without filtering and selected values', () => {
        const wrapper = shallow(
            <Dropdown
                fieldName="country"
                label="Country"
                selectedLabel={ labelTransformerFunction }
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
                selectedLabel={ labelTransformerFunction }
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

    it('should render an expanded, grouped dropdown with a few checked options', () => {
        const wrapper = shallow(
            <Dropdown
                fieldName="country"
                label="Country"
                selectedLabel={ labelTransformerFunction }
                options={[{
                    label: 'Austria',
                    value: 'at'
                }, {
                    label: 'Portugal',
                    value: 'pt'
                }, {
                    label: 'Ireland',
                    value: 'ie'
                }, {
                    value: 'North-America',
                    children: [{
                        label: 'United States',
                        value: 'us'
                    }, {
                        label: 'Canada',
                        value: 'ca'
                    }]
                }]}
                multiple
                value={['us']}
            />
        );

        wrapper.setState({
            expanded: true
        });

        expect(wrapper).toMatchSnapshot();
    });
});
