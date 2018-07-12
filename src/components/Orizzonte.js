import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BtnAdd from './BtnAdd';
import '../scss/Orizzonte.scss';

class Orizzonte extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeGroup: null,
            showAddBtn: false
        };
        this.toggleGroup = this.toggleGroup.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.timer = null;
    }

    addGroup(groupIndex) {
        const { autoExpandOnGroupAdd, children, onGroupAdd } = this.props;

        onGroupAdd(groupIndex);

        if (!autoExpandOnGroupAdd) {
            return false;
        }

        const newIndex = React.Children.map(children, (child) => (child.props.included)).length - 1;

        this.toggleGroup(newIndex);
        return true;
    }

    toggleAddBtn(show) {
        const { showAddBtn } = this.state;

        if (show) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            if (showAddBtn) {
                return false;
            }

            this.setState({
                showAddBtn: true
            });
            return true;            
        }

        if (!showAddBtn) {
            return false;
        }

        this.timer = setTimeout(() => {
            this.setState({
                showAddBtn: false
            });
        }, 750);
        return true;
    }

    toggleGroup(groupIndex) {
        const { activeGroup } = this.state;

        if (groupIndex === false && activeGroup === null) {
            return false;
        }

        if (groupIndex && groupIndex === activeGroup) {
            return false;
        }

        this.setState({
            activeGroup: groupIndex
        });
        return true;
    }

    renderAddBtn(position) {
        const {
            btnAddAlwaysShown, orientation, children, maxGroups
        } = this.props;
        const { showAddBtn } = this.state;

        if (orientation === position) {
            return null;
        }

        if (maxGroups && maxGroups === React.Children.count(children)) {
            return null;
        }

        return (
            <BtnAdd
                shown={ showAddBtn || btnAddAlwaysShown }
                position={ orientation === 'right' ? 'left' : 'right' }
                onGroupAdd={ this.addGroup }
                available={ React.Children.map(children, (child, i) => {
                    if (child.props.included) {
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
        const { children, onGroupRemove, orientation } = this.props;
        const { activeGroup } = this.state;

        return (
            <div
                className="orizzonte__container orizzonte__clearfix"
                onFocus={ () => { this.toggleAddBtn(true); }}
                onMouseOver={ () => { this.toggleAddBtn(true); }}
                onBlur={ () => { this.toggleAddBtn(false); }}
                onMouseOut={ () => { this.toggleAddBtn(false); }}
            >
                { this.renderAddBtn('left') }
                { React.Children.map(children, (child, i) => {
                    if (child.type.name !== 'Group' || !child.props.included) {
                        return null;
                    }

                    return React.cloneElement(child, {
                        activeGroup,
                        i,
                        onGroupRemove,
                        onGroupToggle: this.toggleGroup,
                        orientation
                    });
                }) }
                { this.renderAddBtn('right') }
            </div>
        );
    }
}

Orizzonte.propTypes = {
    /** Indicates if a newly added group should auto expand */
    autoExpandOnGroupAdd: PropTypes.bool,
    /** Show the button for adding new filter groups on the left or right */
    orientation: PropTypes.oneOf([
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
    autoExpandOnGroupAdd: true,
    orientation: 'left',
    btnAddAlwaysShown: false,
    children: [],
    disabled: false,
    maxGroups: null,
    onGroupAdd: () => {},
    onGroupRemove: () => {}
};

export default Orizzonte;
