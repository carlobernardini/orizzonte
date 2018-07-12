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
        const { isFilterGroup, items } = this.props;

        return (
            <ul
                className="orizzonte__list"
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
    items: PropTypes.array.isRequired
};

List.defaultProps = {
    doneBtn: true,
    doneBtnLabel: null,
    isFilterGroup: false
};

export default List;
