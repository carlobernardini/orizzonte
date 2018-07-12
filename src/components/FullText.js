import React from 'react';
import PropTypes from 'prop-types';
import '../scss/Filter.scss';
import '../scss/FullText.scss';

const FullText = ({ label, onUpdate, placeholder }) => (
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
            onChange={ (e) => {
                const { value } = e.target;
                onUpdate(value);
            }}
            placeholder={ placeholder }
        />
    </div>
);

FullText.propTypes = {
    /** Label for this filter section */
    label: PropTypes.string.isRequired,
    /** Internal callback for filter update */
    onUpdate: PropTypes.func,
    /** Label for this filter section */
    placeholder: PropTypes.string
};

FullText.defaultProps = {
    onUpdate: () => {},
    placeholder: null
};

export default FullText;
