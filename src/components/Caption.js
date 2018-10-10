import React from 'react';
import PropTypes from 'prop-types';
import { DISPLAY_NAME_CAPTION } from '../constants';

const Caption = ({ children }) => {
    if (!children) {
        return null;
    }

    return (
        <div
            className="orizzonte__filter-caption"
        >
            { children }
        </div>
    );
};

Caption.displayName = DISPLAY_NAME_CAPTION;

Caption.propTypes = {
    children: PropTypes.string
};

Caption.defaultProps = {
    children: null
};

export default Caption;
