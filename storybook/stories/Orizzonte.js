import React from 'react';
import Orizzonte, {
    Choices, FullText, Group, Select
} from 'orizzonte';
import ArrayMove from 'array-move';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withState } from '@dump247/storybook-state';

const stories = storiesOf('Orizzonte', module);

const component = ({ store }) => {
    const { groups } = store.state;

    return (
        <Orizzonte
            onChange={ (queryObject) => {
                console.log(queryObject);
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
                    const { filters, ...rest} = group;

                    return <Group
                        key={ `${ group.name }-${ i }` }
                        { ...rest }
                    >
                        { filters }
                    </Group>
                })
            }
        </Orizzonte>
    );
};

stories.add('Default', withState({
    groups: [{
        included: true,
        label: 'Language',
        selectedLabel: '%d languages',
        filters: [
            <Select
                key="language"
                fieldName="language"
                label="Language"
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
                options={ [{
                    label: 'Extra Small (XS)',
                    value: 'xs'
                }, {
                    label: 'Small (S)',
                    value: 's'
                }, {
                    label: 'Medium (M)',
                    value: 'm'
                }, {
                    label: 'Large (L)',
                    value: 'l'
                }, {
                    label: 'Extra Large (XL)',
                    value: 'xl'
                }] }
            />,
            <Choices
                key="waist-size"
                fieldName="waistSize"
                label="Waist Size"
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
