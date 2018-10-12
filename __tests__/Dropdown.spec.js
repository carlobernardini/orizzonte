import React from 'react';
import Dropdown from '../src/components/Dropdown';
import CheckBox from '../src/components/CheckBox';

const labelTransformerFunction = (value) => (
    value.length === 1 ? value[0].label : `${ value.length } Countries`
);

describe('<Dropdown />', () => {
    jest.useFakeTimers();

    it('should render a default dropdown without filtering and selected values', () => {
        const onUpdate = jest.fn();

        const wrapper = shallow(
            <Dropdown
                fieldName="country"
                label="Country"
                selectedLabel={ labelTransformerFunction }
                onUpdate={ onUpdate }
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

        wrapper.find('.orizzonte__dropdown-button').simulate('click');
        expect(wrapper.state().expanded).toBe(true);
        expect(wrapper).toMatchSnapshot();

        // Browse using arrow key up
        wrapper.find('.orizzonte__dropdown-item').first().simulate('keydown', {
            preventDefault: () => {},
            keyCode: 40
        });
        expect(wrapper.state().cursor).toBe(0);        

        // Browse using arrow key up
        wrapper.find('.orizzonte__dropdown-item').first().simulate('keydown', {
            preventDefault: () => {},
            keyCode: 38
        });
        expect(wrapper.state().cursor).toBe(2);

        // Select option with enter key
        wrapper.find('.orizzonte__dropdown-item').first().simulate('keydown', {
            preventDefault: () => {},
            keyCode: 13
        });
        expect(onUpdate).toHaveBeenCalledWith('at');
        expect(wrapper.state().expanded).toBe(false);
    });

    it('should render an expanded dropdown multiselect with filtering', () => {
        const wrapper = shallow(
            <Dropdown
                fieldName="country"
                label="Country"
                information="This is some information for this filter"
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
            expanded: true
        });

        wrapper.find('.orizzonte__dropdown-filter').simulate('change', {
            target: {
                value: 'aus'
            }
        });

        expect(wrapper.state().filter).toBe('aus');
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a dropdown with custom matching requirements on the filter', () => {
        const wrapper = shallow(
            <Dropdown
                fieldName="country"
                label="Country"
                information="This is some information for this filter"
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
                    label: 'Cöúntry',
                    value: 'un'
                }]}
                multiple
                value={['at', 'ie']}
                filter={{
                    enabled: true,
                    placeholder: 'Search options...',
                    matchCase: true,
                    matchDiacritics: true,
                    matchPosition: 'start'
                }}
            />
        );

        wrapper.setState({
            expanded: true
        });
        expect(wrapper.find(CheckBox)).toHaveLength(4);

        // Verify matching position
        wrapper.find('.orizzonte__dropdown-filter').simulate('change', {
            target: {
                value: 'tria'
            }
        });
        expect(wrapper.find(CheckBox)).toHaveLength(0);

        // Verify case matching
        wrapper.find('.orizzonte__dropdown-filter').simulate('change', {
            target: {
                value: 'aus'
            }
        });
        expect(wrapper.find(CheckBox)).toHaveLength(0);

        // Verify diacritics matching
        wrapper.find('.orizzonte__dropdown-filter').simulate('change', {
            target: {
                value: 'Cöúntry'
            }
        });
        expect(wrapper.find(CheckBox)).toHaveLength(1);
        wrapper.find('.orizzonte__dropdown-filter').simulate('change', {
            target: {
                value: 'Country'
            }
        });
        expect(wrapper.find(CheckBox)).toHaveLength(0);
        wrapper.find('.orizzonte__dropdown-filter').simulate('change', {
            target: {
                value: 'Austrià'
            }
        });
        expect(wrapper.find(CheckBox)).toHaveLength(0);
    });

    it('should render an expanded, grouped dropdown with a few checked options and select-all', () => {
        const syncCache = jest.fn();
        const onUpdate = jest.fn();

        const wrapper = shallow(
            <Dropdown
                fieldName="country"
                label="Country"
                selectedLabel={ labelTransformerFunction }
                syncCache={ syncCache }
                onUpdate={ onUpdate }
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
                selectAll
                selectAllLabel="Select all options"
                value={['us']}
            />
        );

        wrapper.setState({
            expanded: true
        });

        expect(wrapper).toMatchSnapshot();

        wrapper.find(CheckBox).at(5).prop('onChange')(true);
        expect(onUpdate).toHaveBeenCalledWith(['us', 'ca']);

        wrapper.find(CheckBox).first().prop('onChange')(true);
        expect(onUpdate).toHaveBeenCalledWith(['at', 'pt', 'ie', 'us', 'ca']);
    });
});
