import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PageContainer from './page_container';
import AppStore from '../../stores/app_store';
import analytics from '../../lib/analytics';
import UserCard from './users_page/user_card';
import Masonry from 'react-masonry-component';
import { Helmet } from 'react-helmet';
import tiphive from '../../lib/tiphive';
import UsersInvitationPage from './users_invitation_page';
// import MainFormPage from './main_form_page';
import { PEOPLE_FILTER } from 'Enums';
import classnames from 'classnames';

import MainFormPage from 'Components/pages/MainFormPage';
import PersonCard from './PeoplePage/PersonCard';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { toggleFollowUser } from 'Src/newRedux/database/people/thunks';
import { getFilteredPeople } from 'Src/newRedux/database/people/selectors';
import {
  setEditCardModalOpen,
  setUserInvitationModalOpen
} from 'Src/newRedux/interface/modals/actions';
import { togglePeopleFilter } from 'Src/newRedux/filters/thunks';
import { peopleFilters } from 'Lib/config/filters/people';
const peopleFilterArray = Object.values(peopleFilters);

const masonryOptions = { isFitWidth: true, columnWidth: 200, gutter: 15 };

class PeoplePage extends Component {
  static propTypes = {
    people: PropTypes.array,
    isLoading: PropTypes.bool,
    followingUsers: PropTypes.arrayOf(PropTypes.string),
    togglePeopleFilter: PropTypes.func.isRequired,
    toggleFollowUser: PropTypes.func.isRequired
  };

  state = {
    isUserInviteOpen: false,
    isMainFormOpen: false
  };

  changeFilter = filter => {
    this.props.togglePeopleFilter(filter.key);
  };

  closeMainForm = () => {
    this.setState(state => ({ ...state, isMainFormOpen: false }));
  };

  closeUserInvite = () =>
    this.setState(state => ({ ...state, isUserInviteOpen: false }));

  handleUserInvitationClick = e => {
    this.props.setUserInvitationModalOpen(true);
  };

  handleCreateGroupClick = e => {
    e.preventDefault();
    this.setState(state => ({ ...state, isMainFormOpen: true }));
  };

  render() {
    const {
      props: {
        people,
        followingUsers,
        groupId,
        selectedPeopleFilters,
        togglePeopleFilter
      },
      state: { isUserInviteOpen, isMainFormOpen }
    } = this;

    const baseStyle = {
      textAlign: 'center'
    };

    const activeFilter =
      peopleFilters[selectedPeopleFilters[0]] || peopleFilters['ALL'];

    return (
      <Fragment>
        <Helmet>
          <title>Friyay - People</title>
        </Helmet>
        <div className="users-page">
          <div className="flex-r-center users-page-header pt15 pb50">
            {!tiphive.userIsGuest() && (
              <div className="users-page_left-button-container">
                <a
                  className="users-page_button"
                  onClick={this.handleUserInvitationClick}
                >
                  <i className="glyphicon glyphicon-plus" />
                  <span> Invite People</span>
                </a>
                <a
                  onClick={this.handleCreateGroupClick}
                  className="users-page_button"
                >
                  <span> Create Team</span>
                </a>
              </div>
            )}
            <div className="users-page_title-container" style={baseStyle}>
              <div className="dropdown navbar-right">
                <a
                  to="/"
                  className="dropdown-label users-page-title"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {activeFilter.name} <i className="caret" />
                </a>
                <ul className="dropdown-menu">
                  {peopleFilterArray.map(filter => (
                    <li key={filter.key}>
                      <a onClick={() => togglePeopleFilter(filter.key)}>
                        {filter.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {!tiphive.userIsGuest() && (
              <div className="users-page_left-button-container" />
            )}
          </div>
          <div className="users-card flex-r-center-center">
            <Masonry
              className="users-container"
              id="users-container"
              elementType="div"
              options={masonryOptions}
            >
              {people.map(person => (
                <PersonCard key={person.id} user={person} />
              ))}
              <div className="clearfix" />
            </Masonry>
          </div>

          {people.length === 0 && (
            <p className="text-center">There are no users.</p>
          )}
        </div>
        {isMainFormOpen && (
          <MainFormPage selectedTab="group-pane" onClose={this.closeMainForm} />
        )}
      </Fragment>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    followingUsers: sm.user.relationships.following_users.data,
    groupId: sm.page.groupId,
    people: getFilteredPeople(state),
    rootUrl: sm.page.rootUrl,
    selectedPeopleFilters: sm.filters.peopleFilters
  };
};

const mapDispatch = {
  setEditCardModalOpen,
  setUserInvitationModalOpen,
  toggleFollowUser,
  togglePeopleFilter
};

export default connect(
  mapState,
  mapDispatch
)(PeoplePage);
