import { createSelector } from 'reselect';
import { stateMappings } from 'Src/newRedux/stateMappings';
import get from 'lodash/get';

export const getRelevantViewForPage = createSelector(
  state => stateMappings(state).page,
  state => stateMappings(state).page.domainId,
  state => stateMappings(state).domains,
  state => stateMappings(state).page.topicId,
  state => stateMappings(state).topics,
  state => stateMappings(state).user.attributes.ui_settings,
  (page, domainId, domains, topicId, topics, userUiSettings) => {
    let relevantViewKey;
    switch (page.page) {
      case 'user':
      case 'home':
        relevantViewKey =
          userUiSettings.tips_view ||
          get(domains, `${domainId}.attributes.default_view_id`) ||
          'GRID';
        break;
      case 'topics':
        relevantViewKey =
          userUiSettings.all_topics_view &&
          userUiSettings.all_topics_view.length > 0
            ? userUiSettings.all_topics_view
            : 'HEX';
        break;
      case 'topic':
        const currentTopicView = userUiSettings.my_topics_view.find(
          view => view.id === topicId
        );
        relevantViewKey = currentTopicView && currentTopicView.view;
        // NOTE: commented code kept here because this change will affect very broad aspect of the app.
        // relevantViewKey = ( userUiSettings.my_topics_view.find( view => view.id == topicId ) && userUiSettings.my_topics_view.find( view => view.id == topicId ).view )
        //   || get( topics, `${ topicId }.attributes.default_view_id` )
        //   || null;
        // || get( domains, `${ domainId }.attributes.default_view_id` )
        // || 'GRID';
        break;
      default:
        relevantViewKey =
          get(domains, `${domainId}.attributes.default_view_id`) || 'GRID';
    }

    return isNaN(relevantViewKey)
      ? relevantViewKey
      : oldViewEnumInOrderOfIndex[relevantViewKey];
  }
);

export const oldViewEnumInOrderOfIndex = [
  'MENU',
  'GRID',
  'SMALL_GRID',
  'LIST',
  'SHEET',
  'TASK',
  'WIKI',
  'KANBAN',
  'CARD',
  'TODO',
  'DOCUMENTS'
];
