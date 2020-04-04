import React, { PureComponent, Fragment } from 'react';
import { array, string, object } from 'prop-types';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { getSortedFilteredCardsByTopicWithoutNestedCards } from 'Src/newRedux/database/cards/selectors';
import { getSortedFilteredTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';
import { buildCardRequirements } from 'Lib/utilities';

import { Helmet } from 'react-helmet';
import ViewContainer from 'Components/views/ViewContainer';
import { getRelevantViewForPage } from 'Src/newRedux/interface/views/selectors';

class CardsPage extends PureComponent {
  static propTypes = {
    allCards: array.isRequired,
    currentUser: object.isRequired,
    cardView: string
  };

  render() {
    const {
      allCards,
      allTopics,
      cardRequirements,
      cardView,
      topicView,
      cardsHidden,
      displayTopics
    } = this.props;

    return (
      <Fragment>
        <Helmet>
          <title>Friyay - Cards</title>
        </Helmet>
        <ViewContainer
          cards={allCards}
          cardRequirements={cardRequirements}
          displayCards
          subtopics={allTopics}
          displayTopics={true}
          cardView={cardView}
          topicView={topicView}
          cardsHidden={cardsHidden}
        />
      </Fragment>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const { user } = sm;
  const domains = sm.domains;
  const page = sm.page;
  const uiSettings = user.attributes.ui_settings;
  const cardRequirements = buildCardRequirements({}, state);
  const viewKey = getRelevantViewForPage(state);
  let cardView =
    uiSettings.tips_view ||
    window.currentDomain.attributes.default_view_id ||
    'TOPIC_TILES';
  if (!cardView.startsWith) {
    cardView = 'TOPIC_TILES';
  }
  return {
    allCards: getSortedFilteredCardsByTopicWithoutNestedCards(state)['0'] || [],
    allTopics: getSortedFilteredTopicsByParentTopic(state)['0'] || [],
    cardRequirements,
    currentUser: user,
    cardView,
    topicView:
      uiSettings.subtopics_panel_view === 'SMALL_HEX'
        ? 'HEX'
        : uiSettings.subtopics_panel_view,
    cardsHidden: cardView.startsWith('TOPIC_')
      ? true
      : uiSettings.cards_hidden_in_workspace,
    displayTopics: uiSettings.topics_panel_visible
  };
};

export default connect(mapState)(CardsPage);
