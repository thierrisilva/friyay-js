import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import toSafeInteger from 'lodash/toSafeInteger';

export default class LeftMenuUserItem extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    params: PropTypes.object
  };

  static defaultProps = {

  }

  render() {
    const {
      props: {
        user,
        params: {
          group_id,
          user_id
        } = {
          group_id: null,
          user_id: null
        }
      }
    } = this;

    const { attributes: { name }, id } = user;

    const listClassName = classnames({
      'left-menu-list-item': true,
      active: toSafeInteger(user_id) === toSafeInteger(id)
    });

    let userLink = <Link to={`/users/${id}`}>{name}</Link>;

    if (group_id !== null) {
      userLink = (
        <Link to={`/groups/${group_id}/users/${user.id}`}>{name}</Link>
      );
    }

    return (
      <li className={listClassName} id={`menu-user-${user.id}`} key={user.id}>
        {userLink}
      </li>
    );
  }
}
