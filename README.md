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

## Examples

[Click here](https://carlobernardini.github.io/orizzonte/) for a live demo

### Storybook
Orizzonte comes with a [Storybook](https://storybook.js.org/) that you can run yourself

1. Make sure you have Storybook installed (globally):
    ```bash
    $ npm i -g @storybook/cli
    ```

2. Run `npm run storybook`

3. Go to `http://localhost:9001` to see all examples

Click on 'Show info' to see additional implementation details such as supported prop types and their definitions.

## Configuration

### Orizzonte

| Prop                          | Type             | Required | Description                                                                                                       |
|-------------------------------|------------------|----------|-------------------------------------------------------------------------------------------------------------------|
| `autoExpandOnGroupAdd`        | boolean          | no       | Makes a newly added group auto expand                                                                             |
| `autoHideControls`            | boolean          | no       | If true, add, clear and save buttons will hide automatically                                                      |
| `autoHideTimeout`             | number           | no       | Custom timeout interval for auto-hiding controls                                                                  |
| `className`                   | string           | no       | Custom additional class name for the top-level element                                                            |
| `clearAllLabel`               | string           | no       | Custom label for the button to clear all of the query. `onClear` prop needs to be defined for the button to show. |
| `clearedQuerySnapshot`        | object           | no       | Snapshot of initial query state. If set, this will be used to determine if the query diverged from blank-slate.   |
| `collapseGroupOnClickOutside` | boolean          | no       | Whether the group should collapse when the user clicks outside of it. Changes will not be applied to the query.   |
| `groupTopLabels`              | boolean          | no       | Whether the group label should be shown at the top if some of it's filters have selected values                   |
| `dispatchOnFilterChange`      | boolean          | no       |  If true, the query object will be updated right after any filter change                                          |
| `maxGroups`                   | number           | no       | Maximum number of groups to be added                                                                              |
| `onChange`                    | function         | yes      | Callback function that triggers when the final query object is updated                                            |
| `onClear`                     | function         | no       | Callback function for clearing all of the query                                                                   |
| `onGroupAdd`                  | function         | no       | Callback function for when a new filter group is added                                                            |
| `onGroupRemove`               | function         | no       | Callback function for when a filter group is removed                                                              |
| `onSave`                      | function         | no       | Callback function saving the current query object                                                                 |
| `orientation`                 | `left` or `right`| no       | Show the button for adding new filter groups on the left or right                                                 |
| `query`                       | object           | no       | The current query object                                                                                          |
| `saveLabel`                   | string           | no       | Custom label for the button to save the current query. `onSave` prop needs to be defined for the button to show.  |
| `style`                       | object           | no       | Custom inline styles for the top-level element                                                                    |

### Group
Groups contain one or more filters for which it make sense to be shown together. Each group has its own name and can be provided with a description.

| Prop                       | Type             | Required | Description                                                                                                                                                                     |
|----------------------------|------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `className`                | string           | no       | Custom additional class name for top-level component element                                                                                                                    |
| `mutuallyExclusiveFilters` | boolean or array | no       | When true, only one filter can be selected for this group. When you want only specific filters to be mutually exclusive,,you can provide an array of (two or more) field names. |
| `description`              | string           | no       | A description for this group of filters                                                                                                                                         |
| `hideRemove`               | boolean          | no       | Hides the button to remove this group                                                                                                                                           |
| `included`                 | boolean          | no       | If the group should be present in the bar                                                                                                                                       |
| `label`                    | string           | yes      | Label for this group                                                                                                                                                            |
| `orientation`              | `left` or `right`| no       | Default orientation of the group dropdown list                                                                                                                                  |
| `style`                    | object           | no       | Custom inline styles for top-level component elemen                                                                                                                                |

### Filters
A filter is responsible for controlling the value of a particular field in the query object. Orizzonte comes with the following filter types:

| Filter     | Description                                                                       |
|------------|-----------------------------------------------------------------------------------|
| `Choices`  | A series of inline checkboxes or radios                                           |
| `Dropdown` | A more advanced dropdown select with support for filtering options and select all |
| `FullText` | A single or multi line full text field                                            |
| `Select`   | A simple single-select filter (uses browser `<select />` element)                 |

#### Choices
A series of inline checkboxes (multiple selections) or radios (single selection)

| Prop                | Type    | Required | Description                                                                                   |
|---------------------|---------|----------|-----------------------------------------------------------------------------------------------|
| `fieldName`         | string  | yes      | Field name for this filter, to be used in composed query                                      |
| `information`       | string  | no       | Help text for this filter, to be shown on mouseover                                           |
| `multiple`          | boolean | no       | Whether to show checkboxes (`true`) or radios (`false`)                                       |
| `noPreferenceLabel` | string  | no       | Label to show if you want to include a 'no preference' option Only available for radio groups |

#### Dropdown
A more advanced dropdown select with support for filtering options and select all

| Prop                     | Type                    | Required | Description                                                                                                                                                                                                            |
|--------------------------|-------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `fieldName`              | string                  | yes      | Field name for this filter, to be used in composed query                                                                                                                                                               |
| `information`            | string                  | no       | Help text for this filter, to be shown on mouseover                                                                                                                                                                    |
| `disabled`               | boolean                 | no       | Disables the dropdown                                                                                                                                                                                                  |
| `filter`                 | object                  | no       | Filter dropdown options and highlight matches                                                                                                                                                                          |
| `filter.enabled`         | boolean                 | yes      | If filtering options should be enabled                                                                                                                                                                                 |
| `filter.matchCase`       | boolean                 | no       | If the dropdown filter is case sensitive                                                                                                                                                                               |
| `filter.matchDiacritics` | boolean                 | no       | If the dropdown filter should strictly match diacritics                                                                                                                                                                |
| `filter.matchPosition`   | `start` or `end`        | no       | Whether to match at any position in the string or from the start                                                                                                                                                       |
| `label`                  | string                  | yes      | Label for this filter                                                                                                                                                                                                  |
| `multiple`               | boolean                 | no       | Allows selecting multiple options                                                                                                                                                                                      |
| `notSetLabel`            | string                  | no       | Label to shown when no options are selected                                                                                                                                                                            |
| `options`                | array                   | yes      | Collection of selectable options (property `value` is required, `label` and `disabled` are optional). To create a group of options, use `value` for the group label and add an array of grouped options as `children`. |
| `remote`                 | object                  | no       | Remote API to fetch dropdown options from                                                                                                                                                                              |
| `remote.data`            | object                  | no       | Data object to use as request payload                                                                                                                                                                                  |
| `remote.endpoint`        | string                  | yes      | Remote endpoint URI                                                                                                                                                                                                    |
| `remote.loadingText`     | string                  | no       | Text to show while loading data                                                                                                                                                                                        |
| `remote.searchParam`     | string                  | yes      | Query parameter to apply the filter value to                                                                                                                                                                           |
| `remote.transformer`     | function                | no       | Function for transforming response data before consuming it                                                                                                                                                            |
| `remote.requestMethod`   | string                  | no       | Request method (GET by default)                                                                                                                                                                                           |
| `selectAll`              | boolean                 | no       | Whether to include a select all option on multiselects. This is not supported when remote source is configured.                                                                                                        |
| `selectAllLabel`         | string                  | no       | What label to show for the select all option                                                                                                                                                                           |
| `selectedLabel`          | string or function      | no       | Transforming function or placeholder for group label                                                                                                                                                                   |
| `value`                  | string, number or array | no       | Currently selected value(s)                                                                                                                                                                                            |

#### FullText
A single or multi line full text field

| Prop              | Type               | Required | Description                                                                  |
|-------------------|--------------------|----------|------------------------------------------------------------------------------|
| `disabled`        | boolean            | no       | Disables the input field                                                     |
| `dispatchTimeout` | number             | no       | Custom debounce timeout before dispatching the new value to the query object |
| `fieldName`       | string             | yes      | Field name for this filter, to be used in composed query                     |
| `information`     | string             | no       | Help text for this filter, to be shown on mouseover                          |
| `label`           | string             | yes      | Label for this filter section                                                |
| `maxHeight`       | number             | no       | Maximum textarea height (only applicable in `multiline` mode)                |
| `maxWidth`        | number             | no       | Maximum textarea width (only applicable in `multiline` mode)                 |
| `multiline`       | boolean            | no       | Whether to render a textarea (true) or input field (false)                   |
| `placeholder`     | string             | no       | Placeholder text for the input field                                         |
| `selectedLabel`   | string or function | no       | Transforming function or placeholder for group label                         |
| `value`           | string             | no       | Current value                                                                |

#### Select
A simple single-select filter (uses browser `<select />` element)

| Prop            | Type               | Required | Description                                                                                                                                                                                                            |
|-----------------|--------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `disabled`      | boolean            | no       | Disables the input field                                                                                                                                                                                               |
| `fieldName`     | string             | yes      | Field name for this filter, to be used in composed query                                                                                                                                                               |
| `information`   | string             | no       | Help text for this filter, to be shown on mouseover                                                                                                                                                                    |
| `label`         | string             | yes      | Label for this filter section                                                                                                                                                                                          |
| `notSetLabel`   | string             | no       | Which label the first (empty) option should have in case the select can be empty                                                                                                                                       |
| `options`       | array              | yes      | Collection of selectable options (property `value` is required, `label` and `disabled` are optional). To create a group of options, use `value` for the group label and add an array of grouped options as `children`. |
| `placeholder`   | string             | no       | Placeholder text for the input field                                                                                                                                                                                   |
| `selectedLabel` | string or function | no       | Transforming function or placeholder for group label                                                                                                                                                                   |
| `value`         | string or number   | no       | Currently selected value                                                                                                                                                                                               |

## Tests

* Run tests: `npm test`