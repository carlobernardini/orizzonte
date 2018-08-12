import { filter, flatMap, indexOf, keyBy, map, mergeWith, reduce, unionBy, values } from 'lodash-es';

export default {
    getFlattenedOptions: (nestedOptions) => ({
        flatOptions: flatMap(nestedOptions, (option) => {
            if (option.children) {
                return option.children;
            }
            return option;
        })
    }),
    getSelectedOptionsDeep: (options, selectedValues) => {
        if (!selectedValues || !selectedValues.length) {
            return [];
        }

        const selectedOptions = reduce(options, (result, o) => {
            if ('children' in o && Array.isArray(o.children)) {
                const subset = filter(o.children, (c) => (indexOf(selectedValues, c.value) > -1));
                if (subset.length) {
                    result.push({
                        value: o.value,
                        children: subset
                    });
                }
            } else if (indexOf(selectedValues, o.value) > -1) {
                result.push(o);
            }
            return result;
        }, []);

        return { selectedOptions };
    },
    mergeOptionsDeep: (...options) => {
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
    }
};
