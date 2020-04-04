import React from 'react';
import PropTypes from 'prop-types';
import PageModal from './page_modal';

import TipTabContent from './main_form_page/tip_tab_content';

const ItemUpdateFormPage = props => {
  const { item, activeTab } = props;

  return (
    <PageModal size="half" anim="slide" location="secondary" backdrop="static" keyboard={false}>
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <a href="javascript:void(0)" className="btn btn-link btn-close-side-left" data-dismiss="modal">
            <i className="fa fa-times"></i>
          </a>

          <ul className="nav navbar-nav" role="tablist">
            <li role="presentation" className="active">
              <a href="#item-pane" aria-controls="home" role="tab" data-toggle="tab">UPDATE</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="tab-content" id="main-form-tab-content">
        <TipTabContent tip={item} activeTab={activeTab} />
      </div>
    </PageModal>
  );
};

ItemUpdateFormPage.propTypes = {
  item: PropTypes.object,
  activeTab: PropTypes.string,
};

export default ItemUpdateFormPage;
