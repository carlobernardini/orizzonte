import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import List from './List';

class BtnAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false
        };
        this.btnAdd = React.createRef();
        this.toggleButton = this.toggleButton.bind(this);
        document.addEventListener('click', this.onBodyClick.bind(this), false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onBodyClick.bind(this), false);
    }

    onBodyClick(e) {
        if (!this.btnAdd || this.btnAdd.current.contains(e.target)) {
            return false;
        }

        this.setState({
            active: false
        });

        return true;
    }

    toggleButton() {
        const { active } = this.state;

        this.setState({
            active: !active
        });
    }

    renderList() {
        const { active } = this.state;
        const { available, onFilterAdd } = this.props;

        if (!active) {
            return null;
        }

        return (
            <List
                items={ available.map((filter) => ({
                    label: filter.label,
                    callback: () => {
                        onFilterAdd(filter.i, filter.label);
                    }
                })) }
            />
        );
    }

    render() { 
        const { available, disabled, position, shown } = this.props;

        return (
            <div
                className="orizzonte__btn-add-wrapper"
                ref={ this.btnAdd }
            >
                <button
                    className={ classNames('orizzonte__btn-add', {
                        'orizzonte__btn-add--shown': shown,
                        'orizzonte__btn-add--left': position === 'left',
                        'orizzonte__btn-add--disabled': disabled || !available.length
                    }) }
                    disabled={ !available.length }
                    onClick={ this.toggleButton }
                    type="button"
                >
                    +
                </button>
                { this.renderList() }
            </div>
        );
    }
}

BtnAdd.propTypes = {
    available: PropTypes.array,
    disabled: PropTypes.bool,
    onFilterAdd: PropTypes.func,
    position: PropTypes.string,
    shown: PropTypes.bool
};

BtnAdd.defaultProps = {
    available: [],
    disabled: false,
    onFilterAdd: () => {},
    position: null,
    shown: false
};

export default BtnAdd;
