import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../scss/List.scss';

const List = ({ isFilterGroup, items }) => {
    console.log (isFilterGroup);
    return <ul
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
    </ul>
};

List.propTypes = {
    isFilterGroup: PropTypes.bool,
    items: PropTypes.array.isRequired
};

List.defaultProps = {
    isFilterGroup: false
};

export default List;
