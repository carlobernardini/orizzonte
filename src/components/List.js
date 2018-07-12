import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../scss/List.scss';

class List extends Component {
    renderDoneBtn() {
        const { doneBtn, doneBtnLabel, isFilterGroup } = this.props;

        if (!isFilterGroup || !doneBtn) {
            return null;
        }
        return (
            <li>
                <button
                    type="button"
                    className="orizzonte__list-done"
                >
                    { doneBtnLabel || 'Done' }
                </button>
            </li>
        );
    }

    render() {
        const { isFilterGroup, items, orientation } = this.props;

        console.log (orientation);

        return (
            <ul
                className={ classNames('orizzonte__list', {
                    'orizzonte__list--right': orientation === 'right'
                }) }
            >
                {
                    items.map((item, i) => (
                        <li
                            className={ classNames('orizzonte__item', {
                                'orizzonte__item--filters': isFilterGroup
                            }) }
                            key={ i }
                        >
                            { item }
                        </li>
                    ))
                }
                { this.renderDoneBtn() }
            </ul>
        );
    }
}

List.propTypes = {
    doneBtn: PropTypes.bool,
    doneBtnLabel: PropTypes.string,
    isFilterGroup: PropTypes.bool,
    items: PropTypes.array.isRequired,
    orientation: PropTypes.oneOf([
        'left',
        'right'
    ])
};

List.defaultProps = {
    doneBtn: true,
    doneBtnLabel: null,
    isFilterGroup: false,
    orientation: 'left'
};

export default List;
