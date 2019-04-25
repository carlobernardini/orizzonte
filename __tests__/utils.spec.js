import { getFlattenedOptions, getSelectedOptionsDeep, mergeOptionsDeep, transformLabel } from '../src/utils';

const nestedOptions = [{
    value: '1',
    label: 'Option 1'
}, {
    value: 'Group 1',
    children: [{
        value: '2.1',
        label: 'Option 2.1'
    }, {
        value: '2.2',
        label: 'Option 2.2'
    }]
}, {
    value: '3',
    label: 'Option 3'
}];

describe('getFlattenedOptions', () => {
    it('should return a flattened list of options', () => {
        expect(getFlattenedOptions(nestedOptions)).toEqual({
            flatOptions: [{
                value: '1',
                label: 'Option 1'
            }, {
                value: '2.1',
                label: 'Option 2.1'
            }, {
                value: '2.2',
                label: 'Option 2.2'
            }, {
                value: '3',
                label: 'Option 3'
            }]
        });
    });
});

describe('getSelectedOptionsDeep', () => {
    it('should return a subset of all selected options while maintaining the nested structure', () => {
        expect(getSelectedOptionsDeep(nestedOptions, ['1', '2.2'])).toEqual({
            selectedOptions: [{
                value: '1',
                label: 'Option 1'
            }, {
                value: 'Group 1',
                children: [{
                    value: '2.2',
                    label: 'Option 2.2'
                }]
            }]
        });
    });

    it('should return an empty array if no selected values are provided', () => {
        expect(getSelectedOptionsDeep(nestedOptions, [])).toEqual([]);
    });
});

describe('mergeOptionsDeep', () => {
    const additionalOptions = [{
        value: 'Group 1',
        children: [{
            value: '2.1',
            label: 'Option 2.1'
        }, {
            value: '2.3',
            label: 'Option 2.3'
        }]
    }];

    it('should return a collection of multiple lists of options merged into one', () => {
        expect(mergeOptionsDeep(nestedOptions, additionalOptions)).toEqual({
            mergedOptions: [{
                value: '1',
                label: 'Option 1'
            }, {
                value: '3',
                label: 'Option 3'
            }, {
                value: 'Group 1',
                children: [{
                    value: '2.1',
                    label: 'Option 2.1'
                }, {
                    value: '2.2',
                    label: 'Option 2.2'
                }, {
                    value: '2.3',
                    label: 'Option 2.3'
                }]
            }]
        });
    });
});

describe('transformLabel', () => {
    it('should return nothing', () => {
        expect(transformLabel(undefined)).toBeNull();
    });

    it('should parse a label using the provided transform function', () => {
        const transformer = (value, totalCount) => (
            `${ value.length } / ${ totalCount } selected`
        );
        expect(
            transformLabel(transformer, [1, 2, 3], 4)
        ).toBe('3 / 4 selected');
    });

    it('should replace a placeholder in the label template with selected options length', () => {
        expect(
            transformLabel('%d selected', [1, 2, 3])
        ).toBe('3 selected');
    });

    it('should replace a placeholder in the label template with selected number', () => {
        expect(
            transformLabel('Selected value is %d', 5)
        ).toBe('Selected value is 5');
    });

    it('should replace a placeholder in the label template with selected option label', () => {
        expect(
            transformLabel('%s', 'Selected option')
        ).toBe('Selected option');
    });
});
