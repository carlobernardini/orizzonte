import React from 'react';
import PropTypes from 'prop-types';
import { DISPLAY_NAME_GROUP_BTN } from '../constants';

const GroupBtn = ({ hidden, onClick }) => {
    if (hidden) {
        return null;
    }

    return (
        <button
            type="button"
            className="orizzonte__group-btn"
            onClick={ onClick }
        >
            &nbsp;
        </button>
    );
};

GroupBtn.displayName = DISPLAY_NAME_GROUP_BTN;

GroupBtn.propTypes = {
    hidden: PropTypes.bool,
    onClick: PropTypes.func
};

GroupBtn.defaultProps = {
    hidden: false,
    onClick: () => {}
};

export default GroupBtn;
