import React from 'react';
import Choices from '../src/components/Choices';
import Dropdown from '../src/components/Dropdown';
import List from '../src/components/List';
import Select from '../src/components/Select';

describe('<List />', () => {
    it('should render a list of filters', () => {
        const fieldName = 'myAPIField';
        const onApply = jest.fn();
        const onUpdate = jest.fn();
        const wrapper = shallow(
            <List
                isFilterGroup
                onApply={ onApply }
                onUpdate={ onUpdate }
            >
                <Select
                    fieldName={ fieldName }
                    label="Test select"
                    options={ [{
                        label: 'Test value 1',
                        value: 1
                    }, {
                        label: 'Test value 2',
                        value: 2
                    }, {
                        label: 'Test value 3',
                        value: 3
                    }]}
                    notSetLabel="None"
                />
                <Choices
                    fieldName="myAPIField"
                    label="Test multiple choices"
                    options={ [{
                        label: 'Test value 1',
                        value: 1,
                        disabled: true
                    }, {
                        label: 'Test value 2',
                        value: 2
                    }, {
                        label: 'Test value 3',
                        value: 3,
                        disabled: true
                    }]}
                    multiple
                />
            </List>
        );

        expect(wrapper).toMatchSnapshot();

        wrapper.find(Select).props().onUpdate(1);
        expect(onUpdate).toHaveBeenCalledWith(fieldName, 1);

        wrapper.find('.orizzonte__list-done').simulate('click');
        expect(onApply).toHaveBeenCalled();
    });

    it('should render a list of filters without done button', () => {
        const wrapper = shallow(
            <List
                isFilterGroup
                doneBtn={ false }
            >
                <Select
                    label="Test select"
                    options={ [{
                        label: 'Test value 1',
                        value: 1
                    }, {
                        label: 'Test value 2',
                        value: 2
                    }, {
                        label: 'Test value 3',
                        value: 3
                    }]}
                    onUpdate={() => {}}
                />
                <Choices
                    fieldName="myAPIField"
                    label="Test multiple choices"
                    options={ [{
                        label: 'Test value 1',
                        value: 1,
                        disabled: true
                    }, {
                        label: 'Test value 2',
                        value: 2
                    }, {
                        label: 'Test value 3',
                        value: 3,
                        disabled: true
                    }]}
                    onUpdate={() => {}}
                    multiple
                />
            </List>
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should render a list of filters with remove button, custom done button and custom orientation', () => {
        const onRemove = jest.fn();

        const wrapper = shallow(
            <List
                isFilterGroup
                removeBtn
                doneBtnLabel="Apply"
                orientation="right"
                onRemove={ onRemove }
            >
                <Select
                    label="Test select"
                    options={ [{
                        label: 'Test value 1',
                        value: 1
                    }, {
                        label: 'Test value 2',
                        value: 2
                    }, {
                        label: 'Test value 3',
                        value: 3
                    }]}
                    onUpdate={() => {}}
                />
                <Choices
                    fieldName="myAPIField"
                    label="Test multiple choices"
                    options={ [{
                        label: 'Test value 1',
                        value: 1,
                        disabled: true
                    }, {
                        label: 'Test value 2',
                        value: 2
                    }, {
                        label: 'Test value 3',
                        value: 3,
                        disabled: true
                    }]}
                    onUpdate={() => {}}
                    multiple
                />
            </List>
        );

        expect(wrapper).toMatchSnapshot();

        wrapper.find('.orizzonte__list-remove').simulate('click');
        expect(onRemove).toHaveBeenCalled();
    });

    it('should render a list of clickable items', () => {
        const items = [{
            label: 'Filter 1'
        }, {
            label: 'Filter 2'
        }];

        const wrapper = shallow(
            <List>
                { items.map((item) => (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        href="#"
                        key={ item.label.replace(' ', '') }
                        className="orizzonte__item-clickable"
                        onClick={ jest.fn() }
                    >
                        { item.label }
                    </a>
                )) }
            </List>
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should add a syncCache callback for remote dropdown filters', () => {
        const syncCacheToGroup = jest.fn();

        const remoteOptions = [{
            value: 1,
            label: 'test'
        }];

        const wrapper = shallow(
            <List
                cache={{
                    country: remoteOptions
                }}
                syncCacheToGroup={ syncCacheToGroup }
                isFilterGroup
            >
                <Dropdown
                    fieldName="country"
                    label="Country"
                    selectedLabel={ (value) => {
                        if (value.length === 1) {
                            return value[0].label;
                        }
                        return `${ value.length } Countries`;
                    }}
                    filter={{
                        enabled: true,
                        matchPosition: 'start',
                        placeholder: 'Search options...'
                    }}
                    remote={{
                        endpoint: 'https://orizzonte.io/suggestions',
                        searchParam: 'q',
                        params: {
                            some: 'additional data'
                        },
                        transformer: (response) => (response.options)
                    }}
                    multiple
                />
            </List>
        );

        expect(wrapper.find(Dropdown).prop('cache')).toEqual(remoteOptions);

        wrapper.find(Dropdown).prop('syncCache')(remoteOptions);

        expect(syncCacheToGroup).toHaveBeenCalledWith('country', remoteOptions);
    });

    it('should test changes to the viewport dimensions', () => {
        const component = mount(
            <List>
                { Array(5).fill().map((_, i) => (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        href="#"
                        key={ i }
                        className="orizzonte__item-clickable"
                    >
                        { `Some sample list item number ${ i + 1 }` }
                    </a>
                )) }
            </List>
        );

        component.instance().list.current.getBoundingClientRect = () => ({
            right: 1024
        });

        global.innerWidth = 1000;
        global.dispatchEvent(new Event('resize'));

        expect(component.state().fromRight).toBe(1024);

        global.innerWidth = 1280;
        global.dispatchEvent(new Event('resize'));

        expect(component.state().fromRight).toBe(false);


    });
});
