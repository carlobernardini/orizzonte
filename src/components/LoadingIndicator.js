import React from 'react';
import PropTypes from 'prop-types';
import '../scss/LoadingIndicator.scss';

const LoadingIndicator = ({ size, strokeWidth }) => (
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
	    	strokeWidth={ strokeWidth || 4 }
	    />
	</svg>
);

LoadingIndicator.propTypes = {
	size: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    strokeWidth: PropTypes.number
};

LoadingIndicator.defaultProps = {
	size: null,
    strokeWidth: null
};

export default LoadingIndicator;
