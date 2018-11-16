import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DISPLAY_NAME_BTN_ADD } from '../constants';
import List from './List';
import '../scss/Button.scss';

class BtnAdd extends PureComponent {
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
            >
                { available.map((filter, i) => (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        key={ `orizzonte-add-${ i }` }
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
            </List>
        );
    }

    render() { 
        const {
            available, disabled, label, position, shown
        } = this.props;

        return (
            <div
                className={ classNames('orizzonte__btn-wrapper', {
                    'orizzonte__btn-wrapper--left': position === 'left'
                }) }
                ref={ this.btnAdd }
            >
                <button
                    className={ classNames('orizzonte__btn orizzonte__btn-add', {
                        'orizzonte__btn--shown': shown,
                        'orizzonte__btn--disabled': disabled || !available.length,
                        'orizzonte__btn--labeled': label && label.trim().length
                    }) }
                    disabled={ !available.length }
                    onClick={ this.toggleButton }
                    type="button"
                >
                    { label || String.fromCharCode(160) }
                </button>
                { this.renderList() }
            </div>
        );
    }
}

BtnAdd.displayName = DISPLAY_NAME_BTN_ADD;

BtnAdd.propTypes = {
    available: PropTypes.array,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    onGroupAdd: PropTypes.func,
    position: PropTypes.string,
    shown: PropTypes.bool
};

BtnAdd.defaultProps = {
    available: [],
    disabled: false,
    label: null,
    onGroupAdd: () => {},
    position: null,
    shown: false
};

export default BtnAdd;
