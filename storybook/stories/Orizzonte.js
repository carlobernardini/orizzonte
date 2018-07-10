import React from 'react';
import Orizzonte, { Filter } from 'orizzonte';
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Orizzonte', module);
stories.add('Default', () => (
	<Orizzonte>
		<Filter
			name="Language"
			selectedLabel="%d languages"
		/>
		<Filter
			name="Size"
			selectedLabel="%d sizes"
		/>
	</Orizzonte>
));
