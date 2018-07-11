import React from 'react';
import Orizzonte, { Group } from 'orizzonte';
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
                newGroups[i].selected = true;
                newGroups = ArrayMove(newGroups, i, newGroups.length - 1);

                store.set({
                    groups: newGroups
                });
            }}
            onGroupRemove={ (i) => {
                const newGroups = store.state.groups.slice(0);
                newGroups[i].selected = false;

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
                    />
                ))
            }
        </Orizzonte>
    );
};

stories.add('Default', withState({
    groups: [{
        selected: true,
        label: 'Language',
        selectedLabel: '%d languages'
    }, {
        selected: true,
        label: 'Size',
        selectedLabel: '%d sizes'
    }, {
        label: 'Full text'
    }, {
        selected: true,
        label: 'Dates'
    }, {
        label: 'Price'
    }, {
        label: 'More...'
    }]
})(
    withInfo()(component)
));
