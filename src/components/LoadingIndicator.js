import React from 'react';
import PropTypes from 'prop-types';
import '../scss/LoadingIndicator.scss';

const LoadingIndicator = ({ size }) => (
    <svg
        className="orizzonte__loading"
        viewBox={ [0, 0, 44, 44] }
        style={{
            width: size,
            height: size
        }}
    >
        <circle
            className="orizzonte__loading-path"
            cx="22"
            cy="22"
            r="20"
            fill="none"
            strokeWidth="4"
        />
    </svg>
);

LoadingIndicator.displayName = 'OrizzonteLoadingIndicator';

LoadingIndicator.propTypes = {
    size: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

LoadingIndicator.defaultProps = {
    size: null
};

export default LoadingIndicator;
