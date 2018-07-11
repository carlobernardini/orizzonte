import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const BtnAdd = ({ position }) => (
    <button
        type="button"
        className={ classNames('orizzonte__btn-add', {
            'orizzonte__btn-add--left': position === 'left'
        }) }
    >
        +
    </button>
);

BtnAdd.propTypes = {
    position: PropTypes.string
};

BtnAdd.defaultProps = {
    position: null
};

export default BtnAdd;
