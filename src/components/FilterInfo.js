import React from 'react';
import PropTypes from 'prop-types';
import '../scss/FilterInfo.scss';

const FilterDescription = (({ information }) => (
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

FilterDescription.propTypes = {
    information: PropTypes.string
};

FilterDescription.defaultProps = {
    information: null
};

export default FilterDescription;
