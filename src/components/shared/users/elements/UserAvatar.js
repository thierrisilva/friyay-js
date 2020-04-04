import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import { stateMappings } from 'Src/newRedux/stateMappings';
import ErrorBoundary from 'Components/shared/errors/ErrorBoundary';
import get from 'lodash/get';
import isNil from 'lodash/isNil';

const deepAvatarUrlOrNull = pathOr(null, [
  'relationships',
  'user_profile',
  'data',
  'avatar_url'
]);
const deepNameOrNull = pathOr(null, ['attributes', 'name']);

export class UserAvatar extends Component {
  handleClick = () => {
    const { canClick, rootUrl, routerHistory, user } = this.props;
    const baseUrl = rootUrl == '/' ? rootUrl : rootUrl + '/';
    if (canClick) {
      routerHistory.push(`${baseUrl}users/${user.id}`);
    }
  };

  render() {
    const {
      canClick,
      margin,
      people,
      showName,
      size,
      style,
      userId,
      tooltipText
    } = this.props;

    let user = this.props.user || people[userId] || {};
    const name = (user.attributes && user.attributes.name) || user.name || '-';
    const avatar_url = get(
      user,
      'relationships.user_profile.data.attributes.avatar_url',
      (!isNil(user) && user.avatar_url) ||
        (!isNil(user.attributes) && user.attributes.avatar_url)
    );

    const baseStyle = { width: size, height: size, lineHeight: `${size}px` };
    const tooltipToShow =
      tooltipText === false
        ? tooltipText
        : tooltipText || (name == '-' ? '' : name);

    let circle = (
      <span className="avatar-letter mr5" style={{ ...baseStyle, ...style }}>
        {name.charAt(0).toUpperCase()}
      </span>
    );

    if (!!avatar_url) {
      circle = (
        <img
          style={style}
          src={avatar_url}
          className="user-avatar_image"
          width={size}
          height={size}
        />
      );
    }

    return (
      <ErrorBoundary>
        <div className={`mr${margin} ml10 link-tooltip-container`}>
          {!!canClick ? (
            <a onClick={this.handleClick} className="user-avatar_link">
              {circle}
              {tooltipToShow && (
                <div className="card-due-date-label__tooltip link-tooltip">
                  {tooltipToShow}
                </div>
              )}
              {showName && <span className="pl10">{name}</span>}
            </a>
          ) : (
            <div className="user-avatar_link">
              {circle}
              {tooltipToShow && (
                <div className="card-due-date-label__tooltip link-tooltip">
                  {tooltipToShow}
                </div>
              )}
              {showName && <span className="pl10">{name}</span>}
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}

UserAvatar.propTypes = {
  user: PropTypes.object,
  // userId: PropTypes.string,
  size: PropTypes.number,
  showName: PropTypes.bool,
  onClick: PropTypes.func,
  readonly: PropTypes.bool,
  style: PropTypes.object,
  margin: PropTypes.number,
  showTooltip: PropTypes.bool
};

UserAvatar.defaultProps = {
  user: null,
  size: 25,
  showName: false,
  style: {},
  margin: 10
};

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    rootUrl: sm.page.rootUrl,
    routerHistory: sm.routing.routerHistory,
    people: sm.people
  };
};

export default connect(mapState)(UserAvatar);
