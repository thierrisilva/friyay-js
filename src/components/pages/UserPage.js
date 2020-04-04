import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';
import { stateMappings } from 'Src/newRedux/stateMappings';
import ViewContainer from 'Components/views/ViewContainer';
import { buildCardRequirements } from 'Lib/utilities';
import { getSortedFilteredCardsByTopicWithoutNestedCards } from 'Src/newRedux/database/cards/selectors';
import { getSortedTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';

const UserPage = ({
  allTopics,
  cardRequirements,
  personId,
  thisUsersCards,
  cardView
}) => {
  return (
    <Fragment>
      <Helmet>
        <title>Friyay</title>
      </Helmet>
      <ViewContainer
        cards={thisUsersCards}
        cardRequirements={cardRequirements}
        displayCards
        displayHeader
        headerView="USER"
        subtopics={allTopics}
        additionalCssClasses="extra-top"
        cardView={cardView}
      />
    </Fragment>
  );
};

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const { domains, page, user } = sm;
  const personId = page.personId;
  const cardRequirements = buildCardRequirements({ personId: personId }, state);
  const uiSettings = user.attributes.ui_settings;

  return {
    allTopics: getSortedTopicsByParentTopic(state)['0'] || [],
    cardRequirements: cardRequirements,
    personId: personId,
    thisUsersCards:
      getSortedFilteredCardsByTopicWithoutNestedCards(state)['0'] || [], //this selector now filters by personId when on the person page
    cardView:
      uiSettings.tips_view ||
      get(domains, `${page.domainId}.attributes.default_view_id`) ||
      'GRID'
  };
};

export default connect(mapState)(UserPage);
