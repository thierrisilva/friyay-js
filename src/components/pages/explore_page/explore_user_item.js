import classNames from 'classnames';
import createClass from 'create-react-class';
import React from 'react';

var ExploreUserItem = createClass({
  render: function() {
    var user = this.props.user;

    var attributes    = user.attributes;
    var relationships = user.relationships;
    var profile       = relationships.user_profile.data;
    var tipsCount     = relationships.following_tips.data.length;
    var color_index   = Math.floor((Math.random() * 7) + 1);

    var tipCountText;
    if (tipsCount > 1) {
      tipCountText = tipsCount + ' Cards';
    }

    var userAvatarUrl = profile.avatar_url || window.DEFAULT_AVATAR_URL;

    var userClass = classNames('panel', 'panel-default', 'user', 'explore-item', 'user-item',
      'color-' + color_index);

    return (
      <div className={userClass} id={'user-item-' + user.id}>
        <div className="panel-body text-center">
          <div className="user-avatar">
            <img src={userAvatarUrl} className="img-circle" width="150" height="150" />
          </div>
          <h3>
            <a href="javascript:void(0)" className="user-link" data-user-id={user.id}
               onClick={this.props.handleUserClick}>
              {attributes.name}
            </a>
          </h3>
          <a href="javascript:void(0)" className="follow-link" data-user-id={user.id}
             onClick={this.props.handleFollowClick}>FOLLOW</a>
        </div>
      </div>
    );
  }
});

export default ExploreUserItem;
