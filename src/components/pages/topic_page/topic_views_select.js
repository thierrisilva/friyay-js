import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toPairs, sortBy, prop, compose, identity } from 'ramda';
import toSafeInteger from 'lodash/toSafeInteger';
const comingSoonViews = ['sheet', 'kanban', 'magazine'];
const cardReorder = {
  grid: 0,
  list: 1,
  card: 2,
  task: 3,
  wiki: 4,
  sheet: 5,
  kanban: 6,
  magazine: 7
};

const cardsPageViewsReorder = {
  grid: 0,
  list: 1,
  card: 2
};

const getSorted = compose(
  sortBy(prop(1)),
  toPairs
);

const TopicViewsSelect = ({
  handleTopicViewSelect,
  views = [],
  isCardViews
}) => {
  let updatedViews = null;
  if (isCardViews) {
    updatedViews = getSorted(cardsPageViewsReorder)
      .map(([key]) => views.find(({ attributes: { name } }) => name === key))
      .filter(identity);
  } else {
    updatedViews = getSorted(cardReorder)
      .map(([key]) => views.find(({ attributes: { name } }) => name === key))
      .filter(identity);
  }
  const customViews = updatedViews.map(view => {
    const name = view.attributes.name;
    const data = {
      id: view.id,
      name,
      imageUrl: `/images/views/${name}.png`
    };
    switch (name) {
      case 'grid':
        data.details = `For quick notes, link sharing and information gathering.`;
        break;
      case 'list':
        data.details = `Easy list to scan and reorder. All Cards in yays are
                        also shown on parent yay.`;
        break;
      case 'card':
        data.details = `For documenting and writing.`;
        break;
      case 'wiki':
        data.details = `For a knowledge base.`;
        break;
      case 'sheet':
        data.details = `Quickly create Cards as rows and yays as headers. Great for 
                          planning or a database.`;
        break;
      case 'kanban':
        data.details =
          'Lanes with Labels to show status of Cards in a workflow.';
        break;
      case 'task':
        data.details = `Card list organized with yays as headers that 
                          you can expand/collapse.`;
        break;
      case 'calendar':
        data.details = `View your Cards in a calendar bassed 
                          on due dates.`;
        break;
      case 'magazine':
        data.details = 'Layout for heavy reading.';
        break;
    }
    return data;
  });

  const viewsList = [
    ...customViews.map(view => {
      const isComingSoon = comingSoonViews.includes(view.name);
      return (
        <div
          key={`topic-view${view.id}`}
          className={classNames({
            'topic-view': true,
            'view-coming-soon': isComingSoon
          })}
          onClick={() =>
            !isComingSoon && handleTopicViewSelect(toSafeInteger(view.id))
          }
        >
          <h4 className="text-center mb15">{view.name}</h4>
          <div className="flex-r-center-center">
            <img src={view.imageUrl} className="view-placeholder-image" />
          </div>
          <p className="mt15 ml15 mr15">{view.details}</p>
          {isComingSoon && (
            <div className="comingsoon-placeholder">
              <h4>Coming soon</h4>
            </div>
          )}
        </div>
      );
    }),
    <div key="empty-topic-view-1" className="empty-topic-view" />,
    <div key="empty-topic-view-2" className="empty-topic-view" />
  ];

  let header = null;
  if (isCardViews) {
    header = <h4 className="text-center">Select Home View</h4>;
  } else {
    header = <h4 className="text-center">Select yay View</h4>;
  }

  return (
    <div className="topic-views-select pb50">
      <div className="pb20 pt20">
        {header}
        <p className="text-center">
          You can change views any time in the right menu bar
        </p>
      </div>
      <div className="topic-views">{viewsList}</div>
    </div>
  );
};

TopicViewsSelect.propTypes = {
  views: PropTypes.array,
  handleTopicViewSelect: PropTypes.func,
  isCardViews: PropTypes.bool
};

const mapState = ({ tipsView: { views, allTopics } }) => ({ views, allTopics });

export default connect(mapState)(TopicViewsSelect);
