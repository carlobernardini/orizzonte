import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../scss/List.scss';

class List extends Component {
    renderDoneBtn() {
        const {
            doneBtn, doneBtnLabel, isFilterGroup, onApply
        } = this.props;

        if (!isFilterGroup || !doneBtn) {
            return null;
        }

        return (
            <li>
                <button
                    type="button"
                    className="orizzonte__list-done"
                    onClick={ onApply }
                >
                    { doneBtnLabel || 'Done' }
                </button>
            </li>
        );
    }

    renderItems() {
        const {
            values, items, isFilterGroup, onUpdate
        } = this.props;

        if (isFilterGroup) {
            return React.Children.map(items, (item, i) => (
                <li
                    className={ classNames('orizzonte__item', {
                        'orizzonte__item--filters': isFilterGroup
                    }) }
                    key={ i }
                >
                    { React.cloneElement(item, {
                        value: ((v, fn) => {
                            if (!(fn in v)) {
                                return null;
                            }
                            return v[fn];
                        })(values, item.props.fieldName),
                        onUpdate: (filterValue) => {
                            const { fieldName } = item.props;
                            onUpdate(fieldName, filterValue);
                        }
                    }) }
                </li>
            ));
        }

        return items.map((item, i) => (
            <li
                className={ classNames('orizzonte__item', {
                    'orizzonte__item--filters': isFilterGroup
                }) }
                key={ i }
            >
                { item }
            </li>
        ));
    }

    render() {
        const { orientation } = this.props;

        return (
            <ul
                className={ classNames('orizzonte__list', {
                    'orizzonte__list--right': orientation === 'right'
                }) }
            >
                { this.renderItems() }
                { this.renderDoneBtn() }
            </ul>
        );
    }
}

List.propTypes = {
    doneBtn: PropTypes.bool,
    doneBtnLabel: PropTypes.string,
    values: PropTypes.object,
    isFilterGroup: PropTypes.bool,
    items: PropTypes.array.isRequired,
    onApply: PropTypes.func,
    onUpdate: PropTypes.func,
    orientation: PropTypes.oneOf([
        'left',
        'right'
    ])
};

List.defaultProps = {
    doneBtn: true,
    doneBtnLabel: null,
    values: {},
    isFilterGroup: false,
    onApply: () => {},
    onUpdate: () => {},
    orientation: 'left'
};

export default List;
