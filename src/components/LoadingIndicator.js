import React from 'react';
import PropTypes from 'prop-types';
import {
    DISPLAY_NAME_LOADING, LOADING_SVG_VIEWBOX, LOADING_SVG_CENTER,
    LOADING_SVG_STROKE_WIDTH, LOADING_SVG_RADIUS
} from '../constants';

const LoadingIndicator = ({ size }) => (
    <svg
        className="orizzonte__loading"
        viewBox={ LOADING_SVG_VIEWBOX }
        style={ ((s) => {
            if (!s) {
                return null;
            }
            return {
                width: `${ s }px`,
                height: `${ s }px`
            };
        })(size) }
    >
        <circle
            className="orizzonte__loading-path"
            cx={ LOADING_SVG_CENTER }
            cy={ LOADING_SVG_CENTER }
            r={ LOADING_SVG_RADIUS }
            fill="none"
            strokeWidth={ LOADING_SVG_STROKE_WIDTH }
        />
    </svg>
);

LoadingIndicator.displayName = DISPLAY_NAME_LOADING;

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
