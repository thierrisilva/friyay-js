import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ability from '../../../../lib/ability';

const menuOptions = {
  owner: ['Plan', 'Label', 'Share', 'Organize', 'Edit', 'Print', 'Archive'],
  user: ['Print']
};

class ItemMoreOptions extends Component {
  handleClick = option => {
    if (option === 'Print') {
      this.props.handlePrintClick();
    } else if (option === 'Archive') {
      this.props.handleItemArchiveClick();
    } else {
      this.props.handleOptionClick(option);
    }
  };

  render() {
    const options = Ability.can('update', 'self', this.props.item)
      ? menuOptions.owner
      : menuOptions.user;

    return (
      <div className="dropdown">
        <a data-toggle="dropdown">
          <i className="material-icons">more_vert</i>
        </a>

        <ul className="dropdown-menu dropdown-menu-right">
          {options.map(option => (
            <li key={option}>
              <a onClick={() => this.handleClick(option)}>{option}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

ItemMoreOptions.propTypes = {
  item: PropTypes.object.isRequired,
  handlePrintClick: PropTypes.func.isRequired,
  handleItemArchiveClick: PropTypes.func.isRequired,
  handleOptionClick: PropTypes.func.isRequired
};

export default ItemMoreOptions;
