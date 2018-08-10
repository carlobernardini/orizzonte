import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    assign, identity, isFunction, omit, pick, pickBy
} from 'lodash';
import classNames from 'classnames';
import BtnAdd from './BtnAdd';
import BtnClearAll from './BtnClearAll';
import BtnSave from './BtnSave';
import '../scss/Orizzonte.scss';

class Orizzonte extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeGroup: null,
            showControls: false
        };
        this.orizzonte = React.createRef();
        this.toggleGroup = this.toggleGroup.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.onGroupUpdate = this.onGroupUpdate.bind(this);
        this.timer = null;
        document.addEventListener('click', this.onClickOutside.bind(this), false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClickOutside.bind(this), false);
    }

    onClickOutside(e) {
        const { collapseGroupOnClickOutside } = this.props;

        if (!collapseGroupOnClickOutside) {
            return false;
        }

        if (!e.target.contains(this.orizzonte.current)) {
            return false;
        }

        return this.toggleGroup(null);
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

    toggleControls(show) {
        const { showControls } = this.state;
        const { autoHideTimeout, children } = this.props;

        if (show) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            if (showControls) {
                return false;
            }

            this.setState({
                showControls: true
            });
            return true;            
        }

        const included = React.Children.map(children, (child) => {
            if (!child.props.included) {
                return null;
            }
            return child;
        });

        if (!showControls || !included.length) {
            return false;
        }

        this.timer = setTimeout(() => {
            this.setState({
                showControls: false
            });
        }, autoHideTimeout);
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
            autoHideControls, orientation, children, maxGroups
        } = this.props;
        const { showControls } = this.state;

        if (orientation === position) {
            return null;
        }

        if (
            maxGroups
            && maxGroups === React.Children.count(children)
            && !autoHideControls
        ) {
            return null;
        }

        const includedCount = React.Children.map(children, (child) => {
            if (child.type.displayName !== 'OrizzonteGroup' || !child.props.included) {
                return null;
            }
            return child;
        }).length;

        return (
            <BtnAdd
                shown={ !includedCount || showControls || !autoHideControls }
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

    renderClearBtn(position) {
        const { autoHideControls, clearAllLabel, onClearAll, orientation, query } = this.props;
        const { showControls } = this.state;

        if (orientation === position) {
            return null;
        }

        if (!onClearAll || !isFunction(onClearAll)) {
            return null;
        }

        return (
            <BtnClearAll
                disabled={ !Object.keys(query).length }
                shown={ showControls || !autoHideControls }
                clearAllLabel={ clearAllLabel }
                onClearAll={ () => {
                    this.toggleGroup(null);
                    onClearAll();
                }}
                position={ orientation === 'right' ? 'left' : 'right' }
            />
        );
    }

    renderSaveBtn(position) {
        const { autoHideControls, saveLabel, onSave, orientation, query } = this.props;
        const { showControls } = this.state;

        if (orientation === position) {
            return null;
        }

        if (!onSave || !isFunction(onSave)) {
            return null;
        }

        return (
            <BtnSave
                disabled={ !Object.keys(query).length }
                shown={ showControls || !autoHideControls }
                saveLabel={ saveLabel }
                onSave={ () => {
                    this.toggleGroup(null);
                    onSave(query);
                }}
                position={ orientation === 'right' ? 'left' : 'right' }
            />
        );
    }

    render() {
        const {
            children, className, collapseGroupOnClickOutside,
            groupTopLabels, dispatchOnFilterChange, onGroupRemove, orientation
        } = this.props;
        const { activeGroup } = this.state;

        return (
            <div
                className={ classNames('orizzonte__container orizzonte__clearfix', {
                    'orizzonte__container--top-labels': groupTopLabels,
                    [className]: className
                }) }
                onFocus={ () => {
                    this.toggleControls(true);
                }}
                onMouseOver={ () => {
                    this.toggleControls(true);
                }}
                onBlur={ (e) => {
                    this.toggleControls(!e.target.contains(this.orizzonte.current));
                }}
                onMouseOut={ () => {
                    this.toggleControls(false);
                }}
                ref={ this.orizzonte }
            >
                { this.renderSaveBtn('left') }
                { this.renderClearBtn('left') }
                { this.renderAddBtn('left') }
                { React.Children.map(children, (child, i) => {
                    if (child.type.displayName !== 'OrizzonteGroup' || !child.props.included) {
                        return null;
                    }

                    return React.cloneElement(child, {
                        activeGroup,
                        collapseGroupOnClickOutside,
                        groupTopLabels,
                        i,
                        dispatchOnFilterChange,
                        onGroupRemove,
                        onGroupToggle: this.toggleGroup,
                        onUpdate: this.onGroupUpdate,
                        orientation,
                        queryPart: this.extractQueryPart()
                    });
                }) }
                { this.renderAddBtn('right') }
                { this.renderClearBtn('right') }
                { this.renderSaveBtn('right') }
            </div>
        );
    }
}

Orizzonte.displayName = 'Orizzonte';

Orizzonte.propTypes = {
    /** Indicates if a newly added group should auto expand */
    autoExpandOnGroupAdd: PropTypes.bool,
    /** If true, add, clear and save buttons will hide automatically */
    autoHideControls: PropTypes.bool,
    /** Custom timeout interval for auto-hiding controls */
    autoHideTimeout: PropTypes.number,
    /** List of filter groups */
    children: PropTypes.array,
    /** Custom additional class name for the top-level element */
    className: PropTypes.string,
    /** Custom label for the button to clear all of the query
        onClear prop needs to be defined for the button to show */
    clearAllLabel: PropTypes.string,
    /** Whether the group should collapse when the user clicks outside of it
        Changes will not be applied to the query */
    collapseGroupOnClickOutside: PropTypes.bool,
    /** Whether the group label should be shown at the top if some of its
        filters have selected values */
    groupTopLabels: PropTypes.bool,
    /** If true, the query object will be updated right after any filter change */
    dispatchOnFilterChange: PropTypes.bool,
    /** Maximum number of groups to be added */
    maxGroups: PropTypes.number,
    /** Callback function that triggers when the final query object is updated */
    onChange: PropTypes.func,
    /** Callback function for clearing all of the query */
    onClearAll: PropTypes.func,
    /** Callback function for when a new filter group is added */
    onGroupAdd: PropTypes.func,
    /** Callback function for when a filter group is removed */
    onGroupRemove: PropTypes.func,
    /** Callback function saving the current query object */
    onSave: PropTypes.func,
    /** Show the button for adding new filter groups on the left or right */
    orientation: PropTypes.oneOf([
        'left',
        'right'
    ]),
    /** The current query object */
    query: PropTypes.object,
    /** Custom label for the button to save the current query
        onSave prop needs to be defined for the button to show */
    saveLabel: PropTypes.string
};

Orizzonte.defaultProps = {
    autoExpandOnGroupAdd: true,
    autoHideControls: false,
    autoHideTimeout: 750,
    children: [],
    className: null,
    clearAllLabel: null,
    collapseGroupOnClickOutside: false,
    groupTopLabels: false,
    dispatchOnFilterChange: false,
    maxGroups: null,
    onChange: () => {},
    onClearAll: null,
    onGroupAdd: () => {},
    onGroupRemove: () => {},
    onSave: null,
    orientation: 'left',
    query: {},
    saveLabel: null
};

export default Orizzonte;
