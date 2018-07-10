import React from 'react';
import Orizzonte, { Filter } from 'orizzonte';
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Orizzonte', module);
stories.add('Default', () => {
	const filters = [{
		name: 'Language',
		selectedLabel: '%d languages'
	}, {
		name: 'Size',
		selectedLabel: '%d sizes'
	}];

	return (<Orizzonte>
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
});
