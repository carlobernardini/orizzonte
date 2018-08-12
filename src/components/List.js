import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compact, values } from 'lodash-es';
import '../scss/List.scss';

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
                { doneBtnLabel || 'Done' }
            </button>
        );
    }

    renderClearBtn() {
        const {
            clearBtn, clearBtnLabel, isFilterGroup, onClear, values: groupValues = {}
        } = this.props;

        if (!isFilterGroup || !clearBtn) {
            return null;
        }

        return (
            <button
                type="button"
                className={ classNames('orizzonte__list-control orizzonte__list-clear', {
                    'orizzonte__list-clear--disabled': !compact(values(groupValues)).length
                }) }
                onClick={ onClear }
            >
                { clearBtnLabel || 'Clear' }
            </button>
        );
    }

    renderListControls() {
        const { clearBtn, doneBtn, isFilterGroup } = this.props;

        if (!isFilterGroup || (!clearBtn && !doneBtn)) {
            return null;
        }

        return (
            <li
                className="orizzonte__list-controls"
            >
                { this.renderClearBtn() }
                { this.renderDoneBtn() }
            </li>
        );
    }

    renderItems() {
        const {
            cache, values: groupValues, items, isFilterGroup, onUpdate, syncCacheToGroup
        } = this.props;

        if (isFilterGroup) {
            return React.Children.map(items, (item, i) => {
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

        return items.map((item, i) => (
            <li
                className={ classNames('orizzonte__item', {
                    'orizzonte__item--filters': isFilterGroup
                }) }
                key={ i }
            >
                { item }
            </li>
        ));
    }

    render() {
        const { orientation } = this.props;
        const { fromRight } = this.state;

        return (
            <ul
                className={ classNames('orizzonte__list', {
                    'orizzonte__list--right': orientation === 'right' || fromRight
                }) }
                ref={ this.list }
            >
                { this.renderItems() }
                { this.renderListControls() }
            </ul>
        );
    }
}

List.displayName = 'OrizzonteList';

List.propTypes = {
    cache: PropTypes.object,
    clearBtn: PropTypes.bool,
    clearBtnLabel: PropTypes.string,
    doneBtn: PropTypes.bool,
    doneBtnLabel: PropTypes.string,
    values: PropTypes.object,
    isFilterGroup: PropTypes.bool,
    items: PropTypes.array.isRequired,
    onApply: PropTypes.func,
    onClear: PropTypes.func,
    onUpdate: PropTypes.func,
    orientation: PropTypes.oneOf([
        'left',
        'right'
    ]),
    syncCacheToGroup: PropTypes.func
};

List.defaultProps = {
    cache: {},
    clearBtn: false,
    clearBtnLabel: null,
    doneBtn: true,
    doneBtnLabel: null,
    values: {},
    isFilterGroup: false,
    onApply: () => {},
    onClear: () => {},
    onUpdate: () => {},
    orientation: 'left',
    syncCacheToGroup: () => {}
};

export default List;
