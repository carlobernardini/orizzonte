# Orizzonte
React components for a horizontal, filtered search UI

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/carlobernardini/orizzonte/blob/master/LICENSE)

## Usage

The organization of Orizzonte is simple: first you have the encapsulating Orizzonte component, then there are groups and every group holds one or more filters of its own.
Groups can be in- or excluded from the Orizzonte bar, so users can include only what is relevant to them. Whenever field values change, Orizzonte will compute a new query
object with all new values from all groups that are currently visible. Here is a basic example.

```js
import Orizzonte, { Choices, FullText, Group, Select } from 'orizzonte';

<Orizzonte
	query={{
		language: 'fr',
		waistSize: 32,
		shirtSize: 'm'
	}}
	onChange={(query) => {}}
	onGroupAdd={(i) => {}}
	onGroupRemove={(i) => {}}
	groupTopLabels
>
	<Group
		label="Sizes"
		included
	>
		<Select
			fieldName="shirtSize"
			label="Shirt Size"
			selectedLabel={(value, label) => (`Shirt Size (${ label })`)}
			options={[
				{label: 'Extra Small',value: 'xs'},
				{label: 'Small',value: 's'},
				{label: 'Medium',value: 'm'},
				…
			]}
		/>
		<Choices
			fieldName="waistSize"
			label="Waist Size"
			selectedLabel={(value) => (`Waist Size (${ value })`)}
			options={[
			    {label: 'Extra Small (28)',value: 28},
			    {label: 'Small (30)',value: 30},
			    {label: 'Medium (32)',value: 32},
			    …
			]}
		/>
	</Group>
	<Group
		label="Keywords"
	>
		<FullText
			fieldName="keywords"
			label="Keywords"
			selectedLabel={(value) => (truncate(value, {
                length: 20
            }))}
			placeholder="Enter some keywords..."
		/>
		<FullText
			disabled
			fieldName="disabledTextField"
			label="Another field"
			placeholder="This one is disabled..."
		/>
	</Group>
</Orizzonte>
```

## Examples

### Storybook
Orizzonte comes with a [Storybook](https://storybook.js.org/)

1. Make sure you have Storybook installed (globally):
    ```bash
    $ npm i -g @storybook/cli
    ```

2. Run `npm run storybook`

3. Go to `http://localhost:9001` to see all examples

Click on 'Show info' to see additional implementation details such as supported prop types and their definitions.

## Tests

* Run tests: `npm test`