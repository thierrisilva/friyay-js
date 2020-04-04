import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

class LinkWithGroups extends Component {

  render() {
    const { groupID, url, children, handleClick, className } = this.props;
    let linkUrl = url;

    // check for '/' at first char in url
    if (linkUrl.charAt(0) !== '/') {
      linkUrl = `/${linkUrl}`;
    }

    if (groupID) {
      linkUrl = `/groups/${groupID}${linkUrl}`;
    }

    if (handleClick) {
      return (
        <a href="javascript:void(0)" onClick={() => handleClick(linkUrl)} className="active">
          {children}
        </a>
      );
    }

    return (
      <NavLink to={linkUrl} activeClassName="active" className={className || ' '}>
        {children}
      </NavLink>
    );
  }
}

LinkWithGroups.propTypes = {
  groupID: PropTypes.string,
  url: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.string
  ]),
  handleClick: PropTypes.func,
  className: PropTypes.string
};

export default LinkWithGroups;
