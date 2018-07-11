import React from 'react';
import Orizzonte, { Filter } from 'orizzonte';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withState } from '@dump247/storybook-state';

const stories = storiesOf('Orizzonte', module);

const component = ({ store }) => {
    const { filters } = store.state;

    return (
        <Orizzonte
            btnAddAlwaysShown
            onFilterRemove={ (i) => {
                const newFilters = store.state.filters.slice(0);
                newFilters.splice(i, 1);

                store.set({
                    filters: newFilters
                });
            }}
        >
            {
                filters.map((filter, i) => (
                    <Filter
                        key={ `${ filter.name }-${ i }` }
                        name={ filter.name }
                        selectedLabel={ filter.selectedLabel }
                    />
                ))
            }
        </Orizzonte>
    );
};

stories.add('Default', withState({
    filters: [{
        name: 'Language',
        selectedLabel: '%d languages'
    }, {
        name: 'Size',
        selectedLabel: '%d sizes'
    }, {
        name: 'Full text'
    }, {
        name: 'Dates'
    }, {
        name: 'Price'
    }, {
        name: 'More...'
    }]
})(
    withInfo()(component)
));
