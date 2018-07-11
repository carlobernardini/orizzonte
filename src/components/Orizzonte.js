import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BtnAdd from './BtnAdd';
import '../scss/Orizzonte.scss';

class Orizzonte extends Component {
    renderAddBtn(position) {
        const {
            btnAddAlwaysShown, btnAddPosition, children, maxGroups, onGroupAdd
        } = this.props;

        if (btnAddPosition !== position) {
            return null;
        }

        if (maxGroups && maxGroups === React.Children.count(children)) {
            return null;
        }

        return (
            <BtnAdd
                shown={ btnAddAlwaysShown }
                position={ btnAddPosition }
                onFilterAdd={ onGroupAdd }
                available={ React.Children.map(children, (child, i) => {
                    if (child.props.selected) {
                        return null;
                    }
                    return {
                        i,
                        label: child.props.label
                    };
                }) }
            />
        );
    }

    render() {
        const { children, onGroupRemove } = this.props;

        return (
            <div
                className="orizzonte__container"
            >
                { this.renderAddBtn('left') }
                { React.Children.map(children, (child, i) => {
                    if (child.type.name !== 'Group' || !child.props.selected) {
                        return null;
                    }

                    return React.cloneElement(child, {
                        i,
                        onGroupRemove
                    });
                }) }
                { this.renderAddBtn('right') }
            </div>
        );
    }
}

Orizzonte.propTypes = {
    /** Show the button for adding new filter groups on the left or right */
    btnAddPosition: PropTypes.oneOf([
        'left',
        'right'
    ]),
    /** If the button for adding new filter groups should always be visible */
    btnAddAlwaysShown: PropTypes.bool,
    /** List of filter groups */
    children: PropTypes.array,
    /** Disable any interaction */
    disabled: PropTypes.bool,
    /** Maximum number of filters to be added */
    maxGroups: PropTypes.number,
    /** Callback function for when a new filter group is added */
    onGroupAdd: PropTypes.func,
    /** Callback function for when a filter group is removed */
    onGroupRemove: PropTypes.func
};

Orizzonte.defaultProps = {
    btnAddPosition: 'right',
    btnAddAlwaysShown: false,
    children: [],
    disabled: false,
    maxGroups: null,
    onGroupAdd: () => {},
    onGroupRemove: () => {}
};

export default Orizzonte;
