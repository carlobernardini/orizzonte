import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DEFAULT_STR_DONE, DEFAULT_STR_REMOVE, DEFAULT_ORIENTATION, DISPLAY_NAME_LIST } from '../constants';

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fromRight: false,
        };

        this.list = React.createRef();
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    componentDidMount() {
        this.onWindowResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize.bind(this), false);
    }

    onWindowResize() {
        if (!this.list || !this.list.current) {
            return true;
        }

        const windowWidth = Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
        );

        const { right } = this.list.current.getBoundingClientRect();
        const { fromRight } = this.state;

        if (right >= windowWidth && !fromRight) {
            this.setState({
                fromRight: right
            });
        } else if (fromRight && fromRight < windowWidth) {
            this.setState({
                fromRight: false
            });
        }

        return true;
    }

    renderDoneBtn() {
        const {
            doneBtn, doneBtnLabel, isFilterGroup, onApply
        } = this.props;

        if (!isFilterGroup || !doneBtn) {
            return null;
        }

        return (
            <button
                type="button"
                className="orizzonte__list-control orizzonte__list-done"
                onClick={ onApply }
            >
                { doneBtnLabel || DEFAULT_STR_DONE }
            </button>
        );
    }

    renderRemoveBtn() {
        const {
            removeBtn, removeBtnLabel, isFilterGroup, onRemove
        } = this.props;

        if (!isFilterGroup || !removeBtn) {
            return null;
        }

        return (
            <button
                type="button"
                className="orizzonte__list-control orizzonte__list-remove"
                onClick={ onRemove }
            >
                { removeBtnLabel || DEFAULT_STR_REMOVE }
            </button>
        );
    }

    renderListControls() {
        const { removeBtn, doneBtn, mouseoverControls, isFilterGroup } = this.props;

        if (!isFilterGroup || (!removeBtn && !doneBtn)) {
            return null;
        }

        return (
            <li
                className={ classNames('orizzonte__list-controls', {
                    'orizzonte__list-controls--mouseover': mouseoverControls
                }) }
            >
                { this.renderRemoveBtn() }
                { this.renderDoneBtn() }
            </li>
        );
    }

    renderItems() {
        const {
            cache, values: groupValues, children, isFilterGroup, onUpdate, syncCacheToGroup
        } = this.props;

        if (isFilterGroup) {
            return React.Children.map(children, (item, i) => {
                const props = {};

                if (typeof item.type === typeof Function) {
                    props.value = groupValues[item.props.fieldName] || null;
                    props.onUpdate = (filterValue) => {
                        const { fieldName } = item.props;
                        onUpdate(fieldName, filterValue);
                    };

                    if (item.props.remote && item.props.fieldName in cache) {
                        props.cache = cache[item.props.fieldName];
                    }

                    if (item.props.remote) {
                        props.syncCache = (options) => {
                            const { fieldName } = item.props;
                            syncCacheToGroup(fieldName, options);
                        };
                    }
                }

                return (
                    <li
                        className={ classNames('orizzonte__item', {
                            'orizzonte__item--filters': isFilterGroup
                        }) }
                        key={ i }
                    >
                        { React.cloneElement(item, props) }
                    </li>
                );
            });
        }

        return React.Children.map(children, (item, i) => (
            <li
                className="orizzonte__item"
                key={ i }
            >
                { item }
            </li>
        ));
    }

    render() {
        const { orientation, minWidth } = this.props;
        const { fromRight } = this.state;

        return (
            <ul
                className={ classNames('orizzonte__list', {
                    'orizzonte__list--right': orientation === 'right' || fromRight
                }) }
                style={{
                    minWidth
                }}
                ref={ this.list }
            >
                { this.renderItems() }
                { this.renderListControls() }
            </ul>
        );
    }
}

List.displayName = DISPLAY_NAME_LIST;

List.propTypes = {
    cache: PropTypes.object,
    removeBtn: PropTypes.bool,
    removeBtnLabel: PropTypes.string,
    doneBtn: PropTypes.bool,
    doneBtnLabel: PropTypes.string,
    isFilterGroup: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(
            PropTypes.node
        )
    ]).isRequired,
    minWidth: PropTypes.number,
    mouseoverControls: PropTypes.bool,
    onApply: PropTypes.func,
    onRemove: PropTypes.func,
    onUpdate: PropTypes.func,
    orientation: PropTypes.oneOf([
        'left',
        'right'
    ]),
    syncCacheToGroup: PropTypes.func,
    values: PropTypes.object,
};

List.defaultProps = {
    cache: {},
    removeBtn: false,
    removeBtnLabel: null,
    doneBtn: true,
    doneBtnLabel: null,
    isFilterGroup: false,
    minWidth: null,
    mouseoverControls: false,
    onApply: () => {},
    onRemove: () => {},
    onUpdate: () => {},
    orientation: DEFAULT_ORIENTATION,
    syncCacheToGroup: () => {},
    values: {}
};

export default List;
