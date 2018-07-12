import React from 'react';
import PropTypes from 'prop-types';
import '../scss/Filter.scss';
import '../scss/FullText.scss';

const FullText = ({ label, placeholder }) => (
    <div
        className="orizzonte__filter"
    >
        <div
            className="orizzonte__filter-caption"
        >
            { label }
        </div>
        <textarea
            className="orizzonte__filter-fulltext"
            placeholder={ placeholder }
        />
    </div>
);

FullText.propTypes = {
    /** Label for this filter section */
    label: PropTypes.string.isRequired,
    /** Label for this filter section */
    placeholder: PropTypes.string
};

FullText.defaultProps = {
    placeholder: null
};

export default FullText;
