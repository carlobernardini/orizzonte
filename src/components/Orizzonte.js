import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BtnAdd from './BtnAdd';
import '../scss/Orizzonte.scss';

class Orizzonte extends Component {
    renderAddBtn(position) {
        const { btnAddPosition, children, maxFilters } = this.props;

        if (btnAddPosition !== position) {
            return null;
        }

        if (maxFilters && maxFilters === React.Children.count(children)) {
            return null;
        }

        return (
            <BtnAdd
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
                    if (child.type.name !== 'Filter') {
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
    btnAddPosition: PropTypes.oneOf([
        'left',
        'right'
    ]),
    children: PropTypes.array,
    disabled: PropTypes.bool,
    maxFilters: PropTypes.number,
    onFilterAdd: PropTypes.func,
    onFilterRemove: PropTypes.func
};

Orizzonte.defaultProps = {
    btnAddPosition: 'right',
    children: [],
    disabled: false,
    maxFilters: null,
    onFilterAdd: () => {},
    onFilterRemove: () => {}
};

export default Orizzonte;
