import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    assign, identity, omit, pick, pickBy
} from 'lodash';
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
        this.onGroupUpdate = this.onGroupUpdate.bind(this);
        this.timer = null;
    }

    onGroupUpdate(group) {
        const { onChange, query } = this.props;

        onChange(((q) => {
            // If 'group' is an array of fieldNames it is assumed
            // you want those to be removed from the query
            if (Array.isArray(group)) {
                return omit(q, group);
            }
            // Merge group into query while excluding fields with falsey values
            return pickBy(assign({}, q, group), identity);
        })(query));
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
        const { children } = this.props;

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

        const included = React.Children.map(children, (child) => {
            if (!child.props.included) {
                return null;
            }
            return child;
        });

        if (!showAddBtn || !included.length) {
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

    extractQueryPart() {
        const { children, query } = this.props;

        const fieldNames = React.Children.map(children, (group) => (
            React.Children.map(group.props.children, (filter) => (filter.props.fieldName))
        ));

        return pick(query, fieldNames);
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
        const {
            children, groupTopLabels, onGroupRemove, orientation
        } = this.props;
        const { activeGroup } = this.state;

        return (
            <div
                className={ classNames('orizzonte__container orizzonte__clearfix', {
                    'orizzonte__container--top-labels': groupTopLabels
                }) }
                onFocus={ () => { this.toggleAddBtn(true); }}
                onMouseOver={ () => { this.toggleAddBtn(true); }}
                onBlur={ () => { this.toggleAddBtn(false); }}
                onMouseOut={ () => { this.toggleAddBtn(false); }}
            >
                { this.renderAddBtn('left') }
                { React.Children.map(children, (child, i) => {
                    if (child.type.displayName !== 'OrizzonteGroup' || !child.props.included) {
                        return null;
                    }

                    return React.cloneElement(child, {
                        activeGroup,
                        groupTopLabels,
                        i,
                        onGroupRemove,
                        onGroupToggle: this.toggleGroup,
                        onUpdate: this.onGroupUpdate,
                        orientation,
                        queryPart: this.extractQueryPart()
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
    /** Callback function that triggers when the final query object is updated */
    onChange: PropTypes.func,
    /** Show the button for adding new filter groups on the left or right */
    orientation: PropTypes.oneOf([
        'left',
        'right'
    ]),
    /** If the button for adding new filter groups should always be visible */
    btnAddAlwaysShown: PropTypes.bool,
    /** List of filter groups */
    children: PropTypes.array,
    /** Whether the group label should be shown at the top if some of its
        filters have selected values */
    groupTopLabels: PropTypes.bool,
    /** Maximum number of filters to be added */
    maxGroups: PropTypes.number,
    /** Callback function for when a new filter group is added */
    onGroupAdd: PropTypes.func,
    /** Callback function for when a filter group is removed */
    onGroupRemove: PropTypes.func,
    /** The current query object */
    query: PropTypes.object
};

Orizzonte.defaultProps = {
    autoExpandOnGroupAdd: true,
    onChange: () => {},
    orientation: 'left',
    btnAddAlwaysShown: false,
    children: [],
    groupTopLabels: false,
    maxGroups: null,
    onGroupAdd: () => {},
    onGroupRemove: () => {},
    query: {}
};

export default Orizzonte;
