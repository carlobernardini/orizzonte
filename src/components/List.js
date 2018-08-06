import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compact, values } from 'lodash';
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
            <button
                type="button"
                className="orizzonte__list-control orizzonte__list-done"
                onClick={ onApply }
            >
                { doneBtnLabel || 'Done' }
            </button>
        );
    }

    renderClearBtn() {
        const {
            clearBtn, clearBtnLabel, isFilterGroup, onClear, values: groupValues
        } = this.props;

        if (!isFilterGroup || !clearBtn) {
            return null;
        }

        return (
            <button
                type="button"
                className={ classNames('orizzonte__list-control orizzonte__list-clear', {
                    'orizzonte__list-clear--disabled': !compact(values(groupValues || {})).length
                }) }
                onClick={ onClear }
            >
                { clearBtnLabel || 'Clear' }
            </button>
        );
    }

    renderListControls() {
        const { clearBtn, doneBtn } = this.props;

        if (!clearBtn && !doneBtn) {
            return null;
        }

        return (
            <li
                className="orizzonte__list-controls"
            >
                { this.renderClearBtn() }
                { this.renderDoneBtn() }
            </li>
        );
    }

    renderItems() {
        const {
            values: groupValues, items, isFilterGroup, onUpdate
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
                        })(groupValues, item.props.fieldName),
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
                { this.renderListControls() }
            </ul>
        );
    }
}

List.displayName = 'OrizzonteList';

List.propTypes = {
    clearBtn: PropTypes.bool,
    clearBtnLabel: PropTypes.string,
    doneBtn: PropTypes.bool,
    doneBtnLabel: PropTypes.string,
    values: PropTypes.object,
    isFilterGroup: PropTypes.bool,
    items: PropTypes.array.isRequired,
    onApply: PropTypes.func,
    onClear: PropTypes.func,
    onUpdate: PropTypes.func,
    orientation: PropTypes.oneOf([
        'left',
        'right'
    ])
};

List.defaultProps = {
    clearBtn: false,
    clearBtnLabel: null,
    doneBtn: true,
    doneBtnLabel: null,
    values: {},
    isFilterGroup: false,
    onApply: () => {},
    onClear: () => {},
    onUpdate: () => {},
    orientation: 'left'
};

export default List;
