import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toggleFollowUser, viewPerson } from 'Src/newRedux/database/people/thunks';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import { stateMappings } from 'Src/newRedux/stateMappings';
import IconButton from 'Components/shared/buttons/IconButton';


class PersonCard extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    groupId: PropTypes.string,
  };

  static defaultProps = {
    groupId: null
  };

  state = {
    showUserInfo: false
  };


  handleToggleUserInfo = () => {
    this.setState(state => ({
      showUserInfo: !state.showUserInfo
    }));
  };

  render() {
    const {
      props: { user, groupId, toggleFollowUser, userFollowsPerson, viewPerson },
      state: { showUserInfo }
    } = this;
    const { attributes, relationships } = user;
    const { name, counters = {} } = attributes;
    const { total_tips = 0, total_likes_received = 0, total_user_followers = 0 } = counters;

    return (
      <div className='person-card'>
        <div className='person-card_content'>
        { showUserInfo ? (
          <Fragment>
            <div className="person-card_info-row">
              <span>{total_tips} Cards</span>
            </div>
            <div className="person-card_info-row">
              <span>{total_likes_received} likes received</span>
            </div>
            <div className="person-card_info-row">
              <span>{total_user_followers} followers</span>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className='mt5 mb5'>
              <UserAvatar
                user={ user }
                margin={ 0 }
                readonly
                size={100}
                style={{
                  borderRadius: 50,
                  fontSize: 70
                }}
              />
            </div>
            <a className='person-card_link' onClick={ () => viewPerson( user.id ) }>
              { name }
            </a>
          </Fragment>
        )}
        </div>
        <div className='person-card_footer'>
          <a className="person-card_link" onClick={() => toggleFollowUser( user.id, !userFollowsPerson )} >
            { userFollowsPerson ? 'UNFOLLOW' : 'FOLLOW' }
          </a>
          <div className='person-card_button-container'>
            <IconButton icon='more_vert' onClick={ this.handleToggleUserInfo } />
          </div>
        </div>
      </div>
    );
  }
}


const mapState = ( state, props ) => {
  const sm = stateMappings( state );
  return {
    groupId: sm.page.groupId,
    userFollowsPerson: state._newReduxTree.database.user.relationships.following_users.data.includes( props.user.id )
  }
}

const mapDispatch = {
  toggleFollowUser,
  viewPerson
};

export default connect( mapState, mapDispatch )(PersonCard);
