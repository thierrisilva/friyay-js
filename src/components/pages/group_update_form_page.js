/* global vex */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageModal from './page_modal';
import GroupUpdateTabContent from './group_update_form_page/group_update_tab_content';
import tiphive from 'Lib/tiphive';
import { connect } from 'react-redux';
import { removeGroup, updateGroup } from 'Src/newRedux/database/groups/thunks';


class GroupUpdateFormPage extends Component {
  static propTypes = {
    group: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
  };

  componentDidMount() {
    $('[data-submenu]').submenupicker();
  }

  handleGroupFormBack = e => {
    e.preventDefault();
    $('#carousel-group-form').carousel('prev');
  };

  handleGroupFormNext = e => {
    e.preventDefault();
    $('#carousel-group-form').carousel('next');
  };



  handleGroupUpdateFormSubmit = async e => {
    e.preventDefault();
    const { props: { group: { id }, update } } = this;

    const $mainGroupForm = $('#main-group-form');
    const title = $mainGroupForm.find('#group_title').val().trim();
    const description = $mainGroupForm.find('#group_description').val().trim();
    const userIds = $mainGroupForm.find('#group_sharing_item_ids').val();
    const tidyUserIds = userIds.map(userId => userId.replace('users-', ''));

    const attributes = { title, description };
    const relationships = { user_followers: { data: tidyUserIds } };

    await update({ id, attributes, relationships });
    tiphive.hidePrimaryModal();
  };


  handleGroupDelete = e => {
    e.preventDefault();
    const { group, remove } = this.props;
    remove( group.id );
  };

  render() {
    const { props: { onClose, group } } = this;

    return (
      <PageModal
        size="half"
        anim="slide"
        backdrop="static"
        keyboard={false}
        onClose={onClose}
      >
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <a
              className="btn btn-link btn-close-side-left"
              data-dismiss="modal"
            >
              <i className="material-icons">clear</i>
            </a>

            <ul className="nav navbar-nav" role="tablist">
              <li role="presentation" className="active">
                <a
                  href="#group-pane"
                  aria-controls="home"
                  role="tab"
                  data-toggle="tab"
                >
                  TEAM SETTINGS
                </a>
              </li>
            </ul>

            <div
              className="nav navbar-nav navbar-right"
              style={{ marginRight: 0 }}
            >
              <span>
                <a
                  className="btn btn-danger navbar-btn dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  onClick={this.handleGroupDelete}
                >
                  Delete
                </a>
              </span>
            </div>
          </div>
        </nav>

        <div className="tab-content" id="main-form-tab-content">
          <GroupUpdateTabContent
            group={group}
            handleGroupFormBack={this.handleGroupFormBack}
            handleGroupFormNext={this.handleGroupFormNext}
            handleGroupUpdateFormSubmit={this.handleGroupUpdateFormSubmit}
          />
        </div>
      </PageModal>
    );
  }
}

const mapDispatch = {
  remove: removeGroup,
  update: updateGroup,
};

export default connect(undefined, mapDispatch)(GroupUpdateFormPage);
