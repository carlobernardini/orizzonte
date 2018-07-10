import React from 'react';
import Orizzonte, { Filter } from 'orizzonte';
import { storiesOf } from '@storybook/react';
import { withState } from '@dump247/storybook-state';

const stories = storiesOf('Orizzonte', module);
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
})(({ store }) => {
	const { filters } = store.state;

	return (<Orizzonte
		onFilterRemove={ (i) => {
			const filters = store.state.filters.slice(0);
			filters.splice(i, 1);

			store.set({
				filters
			});
		}}
	>
		{
			filters.map((filter, i) => (
				<Filter
					key={ i }
					name={ filter.name }
					selectedLabel={ filter.selectedLabel }
				/>
			))
		}
	</Orizzonte>)
}));
