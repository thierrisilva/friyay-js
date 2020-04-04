import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import PurposeDetail from './purpose_detail';
import { Views, cardSample } from './card_idea';
import './purpose.scss';

const Purpose = ({ parentTopic }) => {
  const [currentView, setCurrentView] = useState(Views.GeneralPurpose);
  const [sampleCard, setSampleCard] = useState(
    cardSample[Views.GeneralPurpose]
  );
  return (
    <Fragment>
      <div className="info-text">
        What will you be using this yay for? <a>Learn More</a>
      </div>
      <div className="purpose-body">
        <div className="views-list">
          {Object.keys(Views).map(view => (
            <div
              key={view}
              className={`view-item ${currentView === Views[view] &&
                'selected'}`}
              onClick={() => {
                setSampleCard(cardSample[Views[view]]);
                setCurrentView(Views[view]);
              }}
            >
              {Views[view]}
            </div>
          ))}
        </div>
        <PurposeDetail
          cardSample={sampleCard}
          selectedView={currentView}
          parentTopic={parentTopic}
        />
      </div>
    </Fragment>
  );
};

Purpose.propTypes = {
  parentTopic: PropTypes.object
};

export default Purpose;
