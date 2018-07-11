import React from 'react';
import Orizzonte, { Group, Select } from 'orizzonte';
import ArrayMove from 'array-move';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withState } from '@dump247/storybook-state';

const stories = storiesOf('Orizzonte', module);

const component = ({ store }) => {
    const { groups } = store.state;

    return (
        <Orizzonte
            btnAddAlwaysShown
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
                key="something-else"
                label="Something else"
                options={ [{
                    label: 'Bla bla this is an option',
                    value: 'en'
                }, {
                    label: 'Hello I\'m another option',
                    value: 'fr'
                }, {
                    label: 'There we go again',
                    value: 'de'
                }, {
                    label: 'Testing multiple filters in a group',
                    value: 'nl'
                }] }
            />
        ]
    }, {
        included: true,
        label: 'Size',
        selectedLabel: '%d sizes'
    }, {
        label: 'Keywords'
    }, {
        included: true,
        label: 'Dates'
    }, {
        label: 'Price'
    }, {
        label: 'More...'
    }]
})(
    withInfo()(component)
));
