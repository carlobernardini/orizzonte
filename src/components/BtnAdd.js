import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const BtnAdd = ({ disabled, position, shown }) => (
    <button
        type="button"
        className={ classNames('orizzonte__btn-add', {
            'orizzonte__btn-add--shown': shown,
            'orizzonte__btn-add--left': position === 'left',
            'orizzonte__btn-add--disabled': disabled
        }) }
    >
        +
    </button>
);

BtnAdd.propTypes = {
    disabled: PropTypes.bool,
    position: PropTypes.string,
    shown: PropTypes.bool
};

BtnAdd.defaultProps = {
    disabled: false,
    position: null,
    shown: false
};

export default BtnAdd;
