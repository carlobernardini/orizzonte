import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import mergeWith from 'lodash/mergeWith';
import reduce from 'lodash/reduce';
import unionBy from 'lodash/unionBy';
import values from 'lodash/values';

export const escapeRegExp = (string) => (
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
    string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
);

export const getFlattenedOptions = (nestedOptions) => ({
    flatOptions: flatMap(nestedOptions, (option) => {
        if (option.children) {
            return option.children;
        }
        return option;
    })
});

export const getSelectedOptionsDeep = (options, selectedValues) => {
    if (!selectedValues || !selectedValues.length) {
        return [];
    }

    const selectedOptions = reduce(options, (result, o) => {
        if ('children' in o && Array.isArray(o.children)) {
            const subset = filter(o.children, (c) => (selectedValues.indexOf(c.value) > -1));
            if (subset.length) {
                result.push({
                    value: o.value,
                    children: subset
                });
            }
        } else if (selectedValues.indexOf(o.value) > -1) {
            result.push(o);
        }
        return result;
    }, []);

    return { selectedOptions };
};

export const mergeOptionsDeep = (...options) => {
    const mergedOptions = values(
        mergeWith(
            ...map(options, (o) => (keyBy(o, 'value'))),
            // eslint-disable-next-line
            (a, b) => {
                if (a && a.children) {
                    return {
                        value: a.value,
                        children: unionBy(a.children, b.children, 'value')
                    };
                }
            }
        )
    );
    return { mergedOptions };
};

export const transformLabel = (selectedLabel, value, totalOptionCount) => {
    if (!selectedLabel) {
        return null;
    }
    if (isFunction(selectedLabel)) {
        return selectedLabel(value, totalOptionCount);
    }
    if (Array.isArray(value)) {
        return selectedLabel.replace('%d', value.length);
    }
    if (isNumber(value)) {
        return selectedLabel.replace('%d', value.toString());
    }
    return selectedLabel.replace('%s', value.label || value);
};
