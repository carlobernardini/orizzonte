import React from 'react';
import PropTypes from 'prop-types';
import '../scss/List.scss';

const List = ({ items }) => (
    <ul
        className="orizzonte__list"
    >
        {
            items.map((item, i) => (
                <li
                    className="orizzonte__item"
                    key={ i }
                >
                    { item }
                </li>
            ))
        }
    </ul>
);

List.propTypes = {
    items: PropTypes.array.isRequired
};

export default List;
