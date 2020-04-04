import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';
import IconButton from 'Components/shared/buttons/IconButton';
import Icon from 'Components/shared/Icon';
import { stateMappings } from 'Src/newRedux/stateMappings';

import {
  Purpose,
  Structure,
  Content,
  Views,
  Share,
  Priorities,
  Timelines,
  Assignees,
  Label
  // Design
} from './tabs';
import './qs_modal.scss';
import './tabs/tabs.scss';

const Tabs = [
  { title: 'Purpose', component: Purpose },
  { title: 'Structure', component: Structure },
  { title: 'Content', component: Content },
  { title: 'Views', component: Views },
  { title: 'Share', component: Share },
  { title: 'Priorities', component: Priorities },
  { title: 'Timelines', component: Timelines },
  { title: 'Assignees', component: Assignees },
  { title: 'Label', component: Label }
  // { title: 'Design', component: Design }
];

const QSModal = ({ toggleModal, currentTopic }) => {
  const [step, setStep] = useState(0);
  const currentTab = Tabs[step];
  return (
    <ReactModal
      onRequestClose={toggleModal}
      isOpen={true}
      className="qs-content"
      overlayClassName="qs-overlay"
    >
      <IconButton
        icon="close"
        additionalClasses="qs-close-icon dark-grey-icon-button"
        onClick={toggleModal}
      />
      {currentTopic ? (
        <Fragment>
          <div className="header">
            <span className="header-title">Quick Setup</span>
            <div className="tabs-list">
              {Tabs.map((tab, idx) => (
                <a
                  key={tab.title}
                  className={`tab-item ${currentTab.title === tab.title &&
                    'selected'}`}
                  onClick={() => setStep(idx)}
                >
                  {tab.title}
                </a>
              ))}
            </div>
          </div>
          <div className="body">
            <currentTab.component
              parentTopic={currentTopic}
              tab={currentTab.title}
            />
          </div>
          <div
            className="prev footer-icon"
            onClick={() => setStep(step < 1 ? 0 : step - 1)}
          >
            <Icon additionalClasses="footer-icon-arrow" icon="arrow_back" />
          </div>
          <div
            className="next footer-icon"
            onClick={() => setStep(step < Tabs.length - 1 ? step + 1 : step)}
          >
            <Icon additionalClasses="footer-icon-arrow" icon="arrow_forward" />
          </div>
        </Fragment>
      ) : (
        <div className="no-quick-setup">
          Quick setup can only be run inside yays.
        </div>
      )}
    </ReactModal>
  );
};

QSModal.propTypes = {
  toggleModal: PropTypes.func,
  currentTopic: PropTypes.object,
  topic: PropTypes.object
};

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const topics = sm.topics;
  return {
    currentTopic:
      props.topic || (sm.page.topicId ? topics[sm.page.topicId] : null)
  };
};
export default connect(
  mapState,
  {}
)(QSModal);
