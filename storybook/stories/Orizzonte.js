import React from 'react';
import Orizzonte, {
    Choices, Dropdown, FullText, Group, Select
} from 'orizzonte';
import { truncate } from 'lodash';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import MockAdapter from 'axios-mock-adapter';
// eslint-disable-next-line import/no-extraneous-dependencies
import ArrayMove from 'array-move';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withInfo } from '@storybook/addon-info';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withState } from '@dump247/storybook-state';

const stories = storiesOf('Orizzonte', module);

const mockAPI = new MockAdapter(axios, {
    delayResponse: 1000
});
const apiRequest = 'https://orizzonte.io/suggestions';
const remoteOptions = [{
    label: 'United Kingdom',
    value: 'uk'
}, {
    label: 'France',
    value: 'fr'
}, {
    label: 'Germany',
    value: 'de'
}, {
    label: 'The Netherlands',
    value: 'nl'
}, {
    label: 'Spain',
    value: 'es'
}, {
    label: 'Italy',
    value: 'it'
}, {
    label: 'Belgium',
    value: 'be'
}, {
    label: 'Austria',
    value: 'at'
}, {
    label: 'Portugal',
    value: 'pt'
}, {
    label: 'Ireland',
    value: 'IE'
}];

// eslint-disable-next-line react/prop-types
const component = ({ store }) => {
    const { groups, query } = store.state;

    mockAPI.onGet(apiRequest).reply((config) => {
        let filter = null

        try {
            filter = new RegExp(`(${ JSON.parse(config.data).q })`, 'gi');
        } catch(e) {}

        return [200, {
            options: filter ? remoteOptions.filter((option) => ((option.label || option.value).match(filter))) : remoteOptions
        }];
    });

    return (
        <Orizzonte
            query={ query }
            groupTopLabels
            onChange={ (queryObject) => {
                console.log(queryObject);
                store.set({
                    query: queryObject
                });
            }}
            onGroupAdd={ (i) => {
                let newGroups = store.state.groups.slice(0);
                newGroups[i].included = true;
                newGroups = ArrayMove(newGroups, i, newGroups.length - 1);

                store.set({
                    groups: newGroups
                });
            }}
            onGroupRemove={ (i) => {
                const newGroups = store.state.groups.slice(0);
                newGroups[i].included = false;

                store.set({
                    groups: newGroups
                });
            }}
        >
            {
                groups.map((group, i) => {
                    const { filters, ...rest } = group;

                    return (
                        <Group
                            key={ `${ group.name }-${ i }` }
                            { ...rest }
                        >
                            { filters }
                        </Group>
                    );
                })
            }
        </Orizzonte>
    );
};

stories.add('Default', withState({
    query: {
        language: 'fr',
        calendarPeriod: ['3m', '1y']
    },
    groups: [{
        included: true,
        label: 'Locale',
        selectedLabel: '%d languages',
        filters: [
            <Select
                key="language"
                fieldName="language"
                label="Language"
                selectedLabel="%s (Primary)"
                options={ [{
                    label: 'English',
                    value: 'en'
                }, {
                    label: 'French',
                    value: 'fr'
                }, {
                    label: 'German',
                    value: 'de'
                }, {
                    label: 'Dutch',
                    value: 'nl'
                }] }
            />,
            <Dropdown
                key="country"
                fieldName="country"
                label="Country"
                selectedLabel={ (n) => (n.length === 1 ? 'One Country' : `${ n.length } Countries`) }
                options={[]}
                multiple
                filter
                filterPlaceholder="Search options..."
                remote={{
                    endpoint: 'https://orizzonte.io/suggestions',
                    searchParam: 'q',
                    data: {
                        some: 'additional data'
                    },
                    transformer: (response) => (response.options)
                }}
            />,
            <Select
                disabled
                key="secondary-language"
                fieldName="secondLanguage"
                label="Secondary Language"
                options={ [{
                    label: 'English',
                    value: 'en'
                }, {
                    label: 'French',
                    value: 'fr'
                }, {
                    label: 'German',
                    value: 'de'
                }, {
                    label: 'Dutch',
                    value: 'nl'
                }] }
                notSetLabel="None"
            />
        ]
    }, {
        included: true,
        label: 'Sizes',
        selectedLabel: '%d sizes',
        filters: [
            <Select
                key="shirt-size"
                fieldName="shirtSize"
                label="Shirt Size"
                selectedLabel={ (value, label) => (`Shirt Size (${ label })`) }
                options={ [{
                    label: 'Extra Small',
                    value: 'xs'
                }, {
                    label: 'Small',
                    value: 's'
                }, {
                    label: 'Medium',
                    value: 'm'
                }, {
                    label: 'Large',
                    value: 'l'
                }, {
                    label: 'Extra Large',
                    value: 'xl'
                }] }
                notSetLabel="None"
            />,
            <Choices
                key="waist-size"
                fieldName="waistSize"
                label="Waist Size"
                selectedLabel={ (value) => (`Waist Size (${ value })`) }
                options={ [{
                    label: 'Extra Small (28)',
                    value: 28
                }, {
                    label: 'Small (30)',
                    value: 30
                }, {
                    label: 'Medium (32)',
                    value: 32
                }, {
                    label: 'Large (34)',
                    value: 34,
                    disabled: true
                }, {
                    label: 'Extra Large (36)',
                    value: 36,
                    disabled: true
                }] }
            />
        ]
    }, {
        label: 'Keywords',
        filters: [
            <FullText
                key="keywords"
                fieldName="keywords"
                label="Keywords"
                selectedLabel={ (value) => (truncate(value.trim(), {
                    length: 20
                }))}
                placeholder="Enter some keywords..."
            />,
            <FullText
                key="disabled"
                disabled
                fieldName="disabledTextField"
                label="Another field"
                placeholder="This one is disabled..."
            />
        ]
    }, {
        included: true,
        label: 'Dates',
        filters: [
            <Choices
                multiple
                key="period"
                fieldName="calendarPeriod"
                label="Calendar Period"
                selectedLabel="Calendar Period (%d)"
                options={ [{
                    label: 'Last Month',
                    value: '1m',
                    disabled: true
                }, {
                    label: 'Last 2 Months',
                    value: '2m',
                    disabled: true
                }, {
                    label: 'Last 3 Months',
                    value: '3m'
                }, {
                    label: 'Last 6 Months',
                    value: '6m'
                }, {
                    label: 'Last Year',
                    value: '1y'
                }] }
            />
        ]
    }, {
        label: 'Price'
    }, {
        label: 'More...'
    }]
})(
    withInfo()(component)
));
