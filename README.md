# Orizzonte
> React components for a horizontal, filtered search UI

[![npm version](https://img.shields.io/npm/v/orizzonte.svg)](https://www.npmjs.com/package/orizzonte)
[![Build Status](https://travis-ci.org/carlobernardini/orizzonte.svg?branch=master)](https://travis-ci.org/carlobernardini/orizzonte)
![gzip size](http://img.badgesize.io/https://npmcdn.com/orizzonte/dist/orizzonte.min.js?compression=gzip)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/carlobernardini/orizzonte/blob/master/LICENSE)

## Usage

The organization of Orizzonte is simple: first you have the encapsulating Orizzonte component, then there are groups and every group holds one or more filters of its own.
Groups can be in- or excluded from the Orizzonte bar, so users can include only what is relevant to them. Whenever field values change, Orizzonte will compute a new query
object with all new values from all groups that are currently visible. Here is a basic example.

```js
import Orizzonte, { Choices, Dropdown, FullText, Group, Select } from 'orizzonte';

<Orizzonte
  query={{
    language: 'fr',
    waistSize: 32,
    shirtSize: ['m', 'xl']
  }}
  onChange={(query) => {}}
  onGroupAdd={(groupIndex) => {}}
  onGroupRemove={(groupIndex) => {}}
  groupTopLabels
>
  <Group
    description="Choose your shirt and waist sizes"
    label="Sizes"
    included
  >
    <Dropdown
      fieldName="shirtSize"
      label="Shirt Size"
      selectedLabel={ (value, totalCount) => {
        if (value.length <= 2) {
          return `Size (${ value.map((v) => v.label).join(' & ') })`;
        }
        if (value.length === totalCount) {
          return 'Any shirt size';
        }
        return `Size (${ value.length } selected)`;
      }}
      options={[
        {
          value: 'Small sizes',
          children: [
            {label: 'Extra Small',value: 'xs',disabled: true},
            {label: 'Small',value: 's'}
          ]
        },
        {label: 'Medium',value: 'm'},
        …
      ]}
      multiple
      selectAll
    />
    <Choices
      fieldName="waistSize"
      label="Waist Size"
      selectedLabel={ (value) => (`${ value.selectedLabel || value.label } waist size`) }
      options={[
        {label: 'Extra Small (28)',selectedLabel: 'Extra Small',value: 28},
        {label: 'Small (30)',selectedLabel: 'Small',value: 30},
        {label: 'Medium (32)',selectedLabel: 'Medium',value: 32},
        …
      ]}
      multiple
    />
  </Group>
  <Group
    label="Locale"
    included
  >
    <Select
      fieldName="language"
      label="Language"
      selectedLabel="%s (Primary)"
      options={[
        {label: 'English',value: 'en'},
        {label: 'French',value: 'fr'},
        {label: 'German',value: 'de'},
        …
      ]}
    />
    <Dropdown
      fieldName="country"
      label="Country"
      selectedLabel={selectedLabel}
      options={[
        {label: 'United Kingdom',value: 'uk'},
        {label: 'France',value: 'fr'},
        {label: 'Germany',value: 'de'},
        …
      ]}
      filter={{
        enabled: true,
        placeholder: 'Search options...'
      }}
    />
  </Group>
  <Group
    label="Keywords"
  >
    <FullText
      fieldName="keywords"
      label="Keywords"
      selectedLabel={(value) => (truncate(value.trim(), {
        length: 20
      }))}
      placeholder="Enter some keywords..."
      multiline
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
### Groups
Groups contain one or more filters for which it make sense to be shown together. Each group has its own name and can be provided with a description.

### Filters
A filter is responsible for controlling the value of a particular field in the query object. Orizzonte comes with the following filter types:

| Filter     | Description                                                                       |
|------------|-----------------------------------------------------------------------------------|
| `Choices`  | A series of inline checkboxes or radios                                           |
| `Dropdown` | A more advanced dropdown select with support for filtering options and select all |
| `FullText` | A single or multi line full text field                                            |
| `Select`   | A simple single-select filter (uses browser `<select />` element)                 |

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