import React from 'react';
import PageModal from './page_modal';

const ActivityPage = () => (
  <PageModal size="large">
    <div className="modal-header">
      <button
        type="button"
        className="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 className="modal-title" id="myModalLabel">
        Activity
      </h4>
    </div>
    <div className="modal-body">Activity content</div>
  </PageModal>
);

export default ActivityPage;
