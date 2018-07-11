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
                    className="orizzonte__list-item"
                    key={ i }
                    onClick={ () => { item.callback(item.label); } }
                >
                    { item.label }
                </li>
            ))
        }
    </ul>
);

List.propTypes = {
    items: PropTypes.array.isRequired
};

export default List;
