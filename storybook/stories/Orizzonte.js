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
                groups.map((group, i) => (
                    <Group
                        key={ `${ group.name }-${ i }` }
                        { ...group }
                    >
                        { group.filters }
                    </Group>
                ))
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
                key="secondary-language"
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
        label: 'Size',
        selectedLabel: '%d sizes',
        filters: [
            <Select
                key="shirt-size"
                label="Shirt Size"
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
            />,
            <Choices
                key="waist-size"
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
                    value: 34
                }, {
                    label: 'Extra Large (36)',
                    value: 36
                }] }
            />
        ]
    }, {
        label: 'Keywords',
        filters: [
            <FullText
                key="keywords"
                label="Keywords"
                placeholder="Enter some keywords..."
            />
        ]
    }, {
        included: true,
        label: 'Dates',
        filters: [
            <Choices
                multiple
                key="period"
                label="Calendar Period"
                options={ [{
                    label: 'Last Month',
                    value: '1m'
                }, {
                    label: 'Last 2 Months',
                    value: '2m'
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
