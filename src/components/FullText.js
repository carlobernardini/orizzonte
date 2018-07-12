import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../scss/Filter.scss';
import '../scss/FullText.scss';

const FullText = ({ disabled, label, onUpdate, placeholder }) => (
    <div
        className="orizzonte__filter"
    >
        <div
            className="orizzonte__filter-caption"
        >
            { label }
        </div>
        <textarea
            className={ classNames('orizzonte__filter-fulltext', {
                'orizzonte__filter-fulltext--disabled': disabled
            }) }
            disabled={ disabled }
            onChange={ (e) => {
                const { value } = e.target;
                onUpdate(value);
            }}
            placeholder={ placeholder }
        />
    </div>
);

FullText.propTypes = {
    /** If the textarea should be disabled */
    disabled: PropTypes.bool,
    /** Label for this filter section */
    label: PropTypes.string.isRequired,
    /** Internal callback for filter update */
    onUpdate: PropTypes.func,
    /** Label for this filter section */
    placeholder: PropTypes.string
};

FullText.defaultProps = {
    disabled: false,
    onUpdate: () => {},
    placeholder: null
};

export default FullText;
