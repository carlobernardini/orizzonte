import React from 'react';
import PropTypes from 'prop-types';
import { DISPLAY_NAME_FILTER_INFO } from '../constants';
import '../scss/FilterInfo.scss';

const FilterInfo = (({ information }) => (
    information
        ? (
            <div
                className="orizzonte__info-icon"
            >
                ?
                <div
                    className="orizzonte__info-content"
                >
                    { information }
                </div>
            </div>
        )
        : null
));

FilterInfo.displayName = DISPLAY_NAME_FILTER_INFO;

FilterInfo.propTypes = {
    information: PropTypes.string
};

FilterInfo.defaultProps = {
    information: null
};

export default FilterInfo;
