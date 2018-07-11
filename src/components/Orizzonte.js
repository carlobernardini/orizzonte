import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BtnAdd from './BtnAdd';
import '../scss/Orizzonte.scss';

class Orizzonte extends Component {
    renderAddBtn(position) {
        const {
            btnAddAlwaysShown, btnAddPosition, children, maxFilters
        } = this.props;

        if (btnAddPosition !== position) {
            return null;
        }

        if (maxFilters && maxFilters === React.Children.count(children)) {
            return null;
        }

        return (
            <BtnAdd
                shown={ btnAddAlwaysShown }
                position={ btnAddPosition }
            />
        );
    }

    render() {
        const { children, onFilterRemove } = this.props;

        return (
            <div
                className="orizzonte__container"
            >
                { this.renderAddBtn('left') }
                { React.Children.map(children, (child, i) => {
                    if (child.type.name !== 'Filter' || !child.props.selected) {
                        return null;
                    }

                    return React.cloneElement(child, {
                        i,
                        onFilterRemove
                    });
                }) }
                { this.renderAddBtn('right') }
            </div>
        );
    }
}

Orizzonte.propTypes = {
    /** Show the button for adding new filters on the left or right */
    btnAddPosition: PropTypes.oneOf([
        'left',
        'right'
    ]),
    /** If the button for adding new filters should always be visible */
    btnAddAlwaysShown: PropTypes.bool,
    /** List of filters */
    children: PropTypes.array,
    /** Disable any interaction */
    disabled: PropTypes.bool,
    /** Maximum number of filters to be added */
    maxFilters: PropTypes.number,
    /** Callback function for when a new filter is added */
    onFilterAdd: PropTypes.func,
    /** Callback function for when a filter is removed */
    onFilterRemove: PropTypes.func
};

Orizzonte.defaultProps = {
    btnAddPosition: 'right',
    btnAddAlwaysShown: false,
    children: [],
    disabled: false,
    maxFilters: null,
    onFilterAdd: () => {},
    onFilterRemove: () => {}
};

export default Orizzonte;
