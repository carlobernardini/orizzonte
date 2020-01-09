import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const GroupTopLabel = React.forwardRef(({ children, shown }, ref) => (
    <span
        className={ classNames('orizzonte__group-label--top', {
            'orizzonte__group-label--top-shown': shown
        }) }
        ref={ ref }
    >
        { children }
    </span>
));

GroupTopLabel.propTypes = {
    children: PropTypes.string,
    shown: PropTypes.bool
};

GroupTopLabel.defaultProps = {
    children: null,
    shown: false
};

export default GroupTopLabel;
