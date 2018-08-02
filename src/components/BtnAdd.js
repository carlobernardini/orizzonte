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
        if (!this.btnAdd || !this.btnAdd.current || this.btnAdd.current.contains(e.target)) {
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
        const { available, onGroupAdd, position, shown } = this.props;

        if (!shown || !active) {
            return null;
        }

        return (
            <List
                orientation={ position === 'right' ? 'left' : 'right' }
                items={ available.map((filter) => (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        href="#"
                        className="orizzonte__item-clickable"
                        onClick={ (e) => {
                            e.preventDefault();
                            onGroupAdd(filter.i, filter.label);
                            this.toggleButton();
                        }}
                    >
                        { filter.label }
                    </a>
                )) }
            />
        );
    }

    render() { 
        const {
            available, disabled, position, shown
        } = this.props;

        return (
            <div
                className={ classNames('orizzonte__btn-add-wrapper', {
                    'orizzonte__btn-add-wrapper--left': position === 'left',
                }) }
                ref={ this.btnAdd }
            >
                <button
                    className={ classNames('orizzonte__btn-add', {
                        'orizzonte__btn-add--shown': shown,
                        'orizzonte__btn-add--disabled': disabled || !available.length
                    }) }
                    disabled={ !available.length }
                    onClick={ this.toggleButton }
                    type="button"
                >
                    &nbsp;
                </button>
                { this.renderList() }
            </div>
        );
    }
}

BtnAdd.displayName = 'OrizzonteBtnAdd';

BtnAdd.propTypes = {
    available: PropTypes.array,
    disabled: PropTypes.bool,
    onGroupAdd: PropTypes.func,
    position: PropTypes.string,
    shown: PropTypes.bool
};

BtnAdd.defaultProps = {
    available: [],
    disabled: false,
    onGroupAdd: () => {},
    position: null,
    shown: false
};

export default BtnAdd;
