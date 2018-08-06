import React from 'react';
import PropTypes from 'prop-types';
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

FilterInfo.displayName = 'OrizzonteFilterInfo';

FilterInfo.propTypes = {
    information: PropTypes.string
};

FilterInfo.defaultProps = {
    information: null
};

export default FilterInfo;
