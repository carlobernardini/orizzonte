import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const BtnClearAll = ({ clearAllLabel, disabled, onClearAll, position, shown }) => (
    <div
        className={ classNames('orizzonte__btn-wrapper', {
            'orizzonte__btn-wrapper--left': position === 'left',
        }) }
    >
        <button
            className={ classNames('orizzonte__btn orizzonte__btn-text', {
                'orizzonte__btn--shown': shown,
                'orizzonte__btn--disabled': disabled
            }) }
            disabled={ disabled }
            type="button"
            onClick={ () => {
                onClearAll();
            }}
        >
            { clearAllLabel && clearAllLabel.length ? clearAllLabel : 'Clear all' }
        </button>
    </div>
);

BtnClearAll.propTypes = {
    clearAllLabel: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    onClearAll: PropTypes.func.isRequired,
    position: PropTypes.string.isRequired,
    shown: PropTypes.bool.isRequired
};

BtnClearAll.defaultProps = {
    clearAllLabel: null
};

export default BtnClearAll;
