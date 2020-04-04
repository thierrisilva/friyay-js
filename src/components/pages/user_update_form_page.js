import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PageModal from './page_modal';
import UserUpdateTabContent from './user_update_form_page/user_update_tab_content';
import { setEditUserModalOpen } from 'Src/newRedux/interface/modals/actions';

class UserUpdateFormPage extends PureComponent {

  render() {
    return (
      <PageModal size="half" anim="slide" onClose={() => this.props.setEditUserModalOpen( false )}>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <a
              className="btn btn-link btn-close-side-left"
              data-dismiss="modal"
              onClick={() => this.props.setEditUserModalOpen( false )}
            >
              <i className="fa fa-times" />
            </a>

            <ul className="nav navbar-nav" role="tablist">
              <li role="presentation" className="active">
                <a
                  href="#user-pane"
                  aria-controls="home"
                  role="tab"
                  data-toggle="tab"
                >
                  SETTINGS
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="tab-content" id="main-form-tab-content">
          <UserUpdateTabContent />
        </div>
      </PageModal>
    );
  }
}

const mapDispatch = {
  setEditUserModalOpen,
}

export default connect( undefined, mapDispatch )( UserUpdateFormPage );
