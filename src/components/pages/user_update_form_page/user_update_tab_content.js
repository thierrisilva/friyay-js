import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import NotificationSettingSelect from './notification_setting_select';
import Auth from '../../../lib/auth';
import { connect } from 'react-redux';
import { updateUser, updateSettings } from 'Actions/appUser';
import { UPDATE_APP_USER } from 'AppConstants';
import store from '../../../store/store';
import tiphive from '../../../lib/tiphive';
import { setEditUserModalOpen } from 'Src/newRedux/interface/modals/actions';
import filter from 'lodash/filter';

class UserUpdateTabContent extends Component {
  static propTypes = {
    user: PropTypes.object,
    updateCurrentUser: PropTypes.func.isRequired,
    updateUserSettings: PropTypes.func.isRequired
  };

  state = {
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    currentPassword: '',
    avatar: window.DEFAULT_AVATAR_URL
  };

  componentDidMount() {
    const {
      props: { user, updateUserSettings }
    } = this;
    const {
      id,
      attributes: { email, first_name, last_name },
      relationships: { user_profile }
    } = user;

    this.setState(state => ({
      ...state,
      firstName: first_name,
      lastName: last_name,
      email: email,
      avatar: user_profile.data.attributes.avatar_url
    }));

    $('#avatar-upload').fileupload({
      autoUpload: true,
      url: `${window.API_URL}/users/${id}/user_profile`,
      dataType: 'json',
      headers: { Authorization: 'Bearer ' + Auth.getCookie('authToken') },
      formData: { include: 'user_profile' },
      paramName: 'data[attributes[avatar]]',
      done: (e, { jqXHR }) => {
        // file upload done
        if (jqXHR && jqXHR.responseJSON) {
          const updated = jqXHR.responseJSON.data;
          const [userProfile] = jqXHR.responseJSON.included;

          store.dispatch({
            type: UPDATE_APP_USER,
            payload: updated
          });

          const avatar = get(userProfile, 'attributes.avatar_url', '');
          this.setState(state => ({ ...state, avatar }));
        }
      },

      progressall: (e, data) => {
        const progress = parseInt((data.loaded / data.total) * 100, 10);
        $('#progress .progress-bar').css('width', `${progress}%`);
      }
    });

    $('.setting-selectize').selectize({
      onChange: function(value) {
        const $input = this.$input;
        const selectKey = $input.data('select-key');
        updateUserSettings({ id, setting: selectKey, value });
      }
    });
  }

  openAvatarUpload = e => {
    e.preventDefault();
    $('#avatar-upload').click();
  };

  onChange = ({ target: { name, value } }) =>
    this.setState(state => ({ ...state, [name]: value }));

  handleFormSubmit = async e => {
    e.preventDefault();
    const {
      state: {
        avatar,
        firstName,
        lastName,
        email,
        confirmPassword,
        newPassword,
        currentPassword
      },
      props: {
        user: { id },
        updateCurrentUser
      }
    } = this;

    try {
      await updateCurrentUser({
        id,
        avatar,
        email,
        firstName,
        lastName,
        currentPassword,
        newPassword,
        confirmPassword
      });

      this.props.setEditUserModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const {
      state: {
        firstName,
        lastName,
        email,
        confirmPassword,
        newPassword,
        currentPassword,
        avatar
      }
    } = this;

    let avatarImg = (
      <span className="avatar-letter-user-tab">
        {firstName.charAt(0).toUpperCase()}
      </span>
    );

    if (!!avatar) {
      avatarImg = (
        <img src={avatar} className="img-circle" width="150" height="150" />
      );
    }

    return (
      <div className="tab-pane active" role="tabpanel" id="user-pane">
        <form
          className="main-form"
          id="main-user-form"
          method="post"
          onSubmit={this.handleFormSubmit}
        >
          <input
            id="avatar-upload"
            type="file"
            name="user[avatar]"
            className="hide"
          />
          <div
            id="carousel-user-form"
            className="carousel"
            data-ride="carousel"
            data-interval="false"
          >
            <ul className="slide-indicators nav nav-pills main-form-content-nav">
              <li
                role="presentation"
                className="active"
                data-target="#carousel-user-form"
                data-slide-to="0"
              >
                <a>General settings</a>
              </li>
              <li
                role="presentation"
                data-target="#carousel-user-form"
                data-slide-to="1"
              >
                <a>Notifications</a>
              </li>
            </ul>

            <div className="carousel-inner" role="listbox">
              <div className="item active">
                <div className="panel-body">
                  <div className="row">
                    <div className="col-sm-4 text-center">
                      <div className="form-group">
                        <a onClick={this.openAvatarUpload}>{avatarImg}</a>
                      </div>

                      <div className="form-group">
                        <a onClick={this.openAvatarUpload}>Change</a>
                      </div>
                    </div>

                    <div className="col-sm-8">
                      <div className="form-group">
                        <input
                          type="text"
                          name="firstName"
                          className="form-control"
                          placeholder="First name"
                          value={firstName}
                          required
                          onChange={this.onChange}
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="text"
                          name="lastName"
                          className="form-control"
                          placeholder="Last name"
                          value={lastName}
                          required
                          onChange={this.onChange}
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="text"
                          name="email"
                          className="form-control"
                          placeholder="Email"
                          value={email}
                          required
                          onChange={this.onChange}
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="password"
                          name="newPassword"
                          className="form-control"
                          placeholder="New password"
                          value={newPassword}
                          onChange={this.onChange}
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={this.onChange}
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="password"
                          name="currentPassword"
                          className="form-control"
                          placeholder="Current password (if you want to update email or password)"
                          value={currentPassword}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="navbar navbar-inverse navbar-fixed-bottom">
                  <div className="container-fluid">
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-default navbar-btn"
                      value="UPDATE"
                      data-disable-with="Sending..."
                    />
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="panel-body">
                  <h4>When would you like to receive email notifications?</h4>

                  <NotificationSettingSelect
                    selectLabel="Someone joined a Workspace"
                    selectKey="someone_added_to_domain"
                  />

                  <NotificationSettingSelect
                    selectLabel="Someone shared a yay with you"
                    selectKey="someone_shared_topic_with_me"
                  />

                  <NotificationSettingSelect
                    selectLabel="Someone adds a Card to a yay you are following"
                    selectKey="someone_add_tip_to_topic"
                  />

                  <NotificationSettingSelect
                    selectLabel="Someone shared a Card with you"
                    selectKey="someone_shared_tip_with_me"
                  />

                  <NotificationSettingSelect
                    selectLabel="Someone commented on your Card"
                    selectKey="someone_comments_on_tip"
                  />

                  <NotificationSettingSelect
                    selectLabel="Someone liked your Card"
                    selectKey="someone_likes_tip"
                  />

                  <NotificationSettingSelect
                    selectLabel="Someone mentioned you on a comment"
                    selectKey="someone_mentioned_on_comment"
                  />

                  <NotificationSettingSelect
                    selectLabel="Someone followed you"
                    selectKey="someone_followed_you"
                  />

                  <NotificationSettingSelect
                    selectLabel="Someone commented on card you have commented on"
                    selectKey="someone_commented_on_tip_user_commented"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapState = (state, props) => ({
  user: state._newReduxTree.database.user
});

const mapDispatch = {
  updateCurrentUser: updateUser,
  updateUserSettings: updateSettings,
  setEditUserModalOpen: setEditUserModalOpen
};

export default connect(
  mapState,
  mapDispatch
)(UserUpdateTabContent);
