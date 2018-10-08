import React from 'react';
import PropTypes from 'prop-types';

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

Caption.displayName = 'OrizzonteFilterCaption';

Caption.propTypes = {
    children: PropTypes.string
};

Caption.defaultProps = {
    children: null
};

export default Caption;
