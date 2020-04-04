import React from 'react';
import PropTypes from 'prop-types';
import TipTabContent from './main_form_page/tip_tab_content';
import PageModal from './page_modal';

const TopicTipFormPage = ({ group, topic, onClose }) => (
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
          href="javascript:void(0)"
          className="btn btn-link btn-close-side-left"
          data-dismiss="modal"
        >
          <i className="fa fa-times" />
        </a>

        <ul className="nav navbar-nav" role="tablist">
          <li role="presentation" className="active">
            <a
              href="#tip-pane"
              aria-controls="home"
              role="tab"
              data-toggle="tab"
            >
              ADD CARD
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <div className="tab-content" id="main-form-tab-content">
      <TipTabContent group={group} topic={topic} />
    </div>
  </PageModal>
);

TopicTipFormPage.propTypes = {
  topic: PropTypes.object.isRequired,
  group: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default TopicTipFormPage;
