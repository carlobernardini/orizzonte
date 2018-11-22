import React from 'react';
import Orizzonte, {
    Choices, Dropdown, FullText, Group, Select, Toggle
} from 'orizzonte';
import { truncate } from 'lodash-es';
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
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, text, boolean, object, select } from '@storybook/addon-knobs/react';

const stories = storiesOf('Orizzonte', module);
stories.addDecorator(withKnobs);

const mockAPI = new MockAdapter(axios, {
    delayResponse: 750
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
    value: 'Benelux',
    children: [{
        label: 'The Netherlands',
        value: 'nl',
    }, {
        label: 'Belgium',
        value: 'be'
    }, {
        label: 'Luxembourg',
        value: 'lu'
    }]
}, {
    label: 'Spain',
    value: 'es'
}, {
    label: 'Italy',
    value: 'it'
}];

// eslint-disable-next-line react/prop-types
const component = ({ store }) => {
    const { groups, query } = store.state;

    mockAPI.onAny(apiRequest).reply((config) => {
        let filter = null;

        try {
            filter = new RegExp(`(${ JSON.parse(config.data).q })`, 'gi');
        // eslint-disable-next-line no-empty
        } catch (e) {}

        return [200, {
            options: filter
                ? remoteOptions.filter((option) => ((option.label || option.value).match(filter)))
                : remoteOptions
        }];
    });

    return (
        <Orizzonte
            addBtnLabel={ text('Add button label', '') }
            autoHideControls={ boolean('Auto-hide controls (add, clear, save)', true) }
            query={ object('Query', query) }
            collapseGroupOnClickOutside={ boolean('Collapse groups on click outside', true) }
            clearAllLabel={ text('Label for Clear All button', '') }
            clearedQuerySnapshot={{
                language: 'fr',
                calendarPeriod: ['3m', '1y']
            }}
            saveLabel={ text('Label for Save button', '') }
            groupTopLabels={ boolean('Labels on top of groups', true) }
            hideAddOnAllGroupsIncluded={ boolean('Hide add-button when no more groups available', true) }
            dispatchOnFilterChange={ boolean('Dispatch query on filter change', true) }
            orientation={ select('Orientation', ['ltr', 'rtl'], 'ltr') }
            onChange={ (queryObject) => {
                console.log(queryObject);
                store.set({
                    query: queryObject
                });
            }}
            onClearAll={ (clearedQuerySnapshot) => {
                store.set({
                    query: clearedQuerySnapshot
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
            onSave={ (queryObject) => {
                console.log('Save query', queryObject);
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
        calendarPeriod: ['3m', '1y'],
        toggle: 'on'
    },
    groups: [{
        included: true,
        label: 'Locale',
        doneBtnLabel: 'OK',
        removeBtnLabel: 'Remove me',
        filters: [
            <Select
                key="language"
                fieldName="language"
                label="Language"
                selectedLabel="%s (Primary)"
                options={ [{
                    value: 'English',
                    children: [{
                        label: 'UK English',
                        value: 'en-gb'
                    }, {
                        label: 'US English',
                        value: 'en-us'
                    }]
                }, {
                    label: 'French',
                    value: 'fr'
                }, {
                    label: 'German',
                    value: 'de',
                    disabled: true
                }, {
                    label: 'Dutch',
                    value: 'nl'
                }] }
            />,
            <Toggle
                key="mytoggle"
                fieldName="toggle"
                option={{
                    label: 'Toggle me on or off',
                    value: 'on'
                }}
                selectedLabel="Toggle is on"
                toggleStateLabel={{
                    on: 'Active',
                    off: 'Inactive'
                }}
            />,
            <Dropdown
                key="country"
                information="Choose one or more countries (optional)"
                fieldName="country"
                label="Country"
                selectedLabel={ (value) => {
                    if (value.length === 1) {
                        return value[0].label;
                    }
                    return `${ value.length } Countries`;
                }}
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
                filter={{
                    enabled: true,
                    matchPosition: 'start',
                    placeholder: 'Search options...'
                }}
                remote={{
                    endpoint: 'https://orizzonte.io/suggestions',
                    searchParam: 'q',
                    params: {
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
        filters: [
            <Dropdown
                key="shirt-size"
                fieldName="shirtSize"
                label="Shirt Size"
                selectedLabel={ (value, totalCount) => {
                    if (value.length <= 2) {
                        return `Shirt Size (${ value.map((v) => v.label).join(' & ') })`;
                    }
                    if (value.length === totalCount) {
                        return 'Any shirt size';
                    }
                    return `Shirt Size (${ value.length } selected)`;
                }}
                options={ [{
                    value: 'Small sizes',
                    children: [{
                        label: 'Extra Small',
                        value: 'xs',
                        disabled: true,
                        facetCount: 0
                    }, {
                        label: 'Small',
                        value: 's',
                        facetCount: 129
                    }]
                }, {
                    label: 'Medium',
                    value: 'm',
                    facetCount: 213
                }, {
                    value: 'Large sizes',
                    children: [{
                        label: 'Large',
                        value: 'l',
                        facetCount: 1982
                    }, {
                        label: 'Extra Large',
                        value: 'xl',
                        facetCount: 94
                    }]
                }] }
                notSetLabel="None"
                multiple
                selectAll
                selectAllCount
            />,
            <Choices
                key="waist-size"
                fieldName="waistSize"
                label="Waist Size"
                selectedLabel={ (value) => (`${ value.selectedLabel || value.label } waist size`) }
                noPreferenceLabel="No preference"
                options={ [{
                    label: 'Extra Small (28)',
                    selectedLabel: 'Extra Small',
                    value: 28,
                    facetCount: 345
                }, {
                    label: 'Small (30)',
                    selectedLabel: 'Small',
                    value: 30,
                    facetCount: 12
                }, {
                    label: 'Medium (32)',
                    selectedLabel: 'Medium',
                    value: 32,
                    facetCount: 228
                }, {
                    label: 'Large (34)',
                    selectedLabel: 'Large',
                    value: 34,
                    facetCount: 192,
                    disabled: true
                }, {
                    label: 'Extra Large (36)',
                    selectedLabel: 'Extra Large',
                    value: 36,
                    facetCount: 73,
                    disabled: true
                }] }
            />
        ]
    }, {
        label: 'Keywords',
        hideDone: true,
        listMinWidth: 400,
        filters: [
            <FullText
                key="keywords"
                fieldName="keywords"
                label="Keywords"
                selectedLabel={ (value) => (truncate(value.trim(), {
                    length: 20
                }))}
                placeholder="Enter some keywords, but no numbers..."
                validateInput={ (value) => (
                    !(/[0-9]/g.test(value))
                )}
                autoFocus
                multiline
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
        hideClear: true,
        description: 'You can narrow your search to any of the time spans listed below',
        filters: [
            <Choices
                multiple
                key="period"
                fieldName="calendarPeriod"
                selectedLabel={ (value) => {
                    if (value.length === 1) {
                        return value[0].label;
                    }
                    return `Calendar Period (${ value.length } selected)`;
                }}
                options={ [{
                    label: 'Last Month',
                    value: '1m',
                    facetCount: 23,
                    disabled: true
                }, {
                    label: 'Last 2 Months',
                    value: '2m',
                    facetCount: 543,
                    disabled: true
                }, {
                    label: 'Last 3 Months',
                    value: '3m',
                    facetCount: 1228
                }, {
                    label: 'Last 6 Months',
                    value: '6m',
                    facetCount: 1830
                }, {
                    label: 'Last Year',
                    value: '1y',
                    facetCount: 3247
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
