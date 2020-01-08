import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DEFAULT_STR_SAVE, DISPLAY_NAME_BTN_SAVE } from '../../constants';

const BtnSave = ({ saveLabel, disabled, onSave, position, shown }) => (
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
                onSave();
            }}
        >
            { saveLabel && saveLabel.length ? saveLabel : DEFAULT_STR_SAVE }
        </button>
    </div>
);

BtnSave.displayName = DISPLAY_NAME_BTN_SAVE;

BtnSave.propTypes = {
    saveLabel: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    position: PropTypes.string.isRequired,
    shown: PropTypes.bool.isRequired
};

BtnSave.defaultProps = {
    saveLabel: null
};

export default BtnSave;
