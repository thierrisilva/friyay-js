import {
  fetchUser,
  fetchUserFollows,
  postOrderChange,
  postUserProfile
} from './apiCalls';
import { stateMappings } from 'Src/newRedux/stateMappings';
import get from 'lodash/get';
import set from 'lodash/set';
import { normalizeUser } from './schema';
import {
  reduceArrayToObjectWithKeyAndValuePair,
  mapRelationship
} from 'Lib/utilities';
import { success, failure } from 'Utils/toast';
import { addUser, changeUser } from './actions';
import {
  setLeftMenuOpen,
  setUnprioritizedPanel
} from 'Src/newRedux/interface/menus/actions';
import { logRollBarError, setRollbarUser } from 'Lib/rollbar';
import { getTopicOrdersByTopic } from 'Src/newRedux/database/topicOrders/selectors';
import { addPeople } from 'Src/newRedux/database/people/actions';
import { setDockContents } from 'Src/newRedux/interface/dock/actions';
import {
  togglePeopleFilter,
  toggleTopicFilter
} from 'Src/newRedux/filters/thunks';
import {
  setPeopleFilters,
  setTopicFilters
} from 'Src/newRedux/filters/actions';
import { topicFilters } from 'Lib/config/filters/topics';
import { peopleFilters } from 'Lib/config/filters/people';
import { batchActions } from 'redux-batch-enhancer';
import { idFromSlug } from 'Lib/utilities';

const mapRelationships = user => {
  let mappedData = user;
  for (let relation of ['user_topic_people_order', 'user_topic_label_order']) {
    mappedData.data.data.relationships[relation].data = mapRelationship(
      mappedData.data.data,
      mappedData.data.included,
      relation
    );
  }
  const user_profile = mappedData.data.data.relationships.user_profile.data;
  mappedData.data.data.relationships.user_profile.data = mappedData.data.included.find(
    includedRelation =>
      includedRelation.id === user_profile.id &&
      includedRelation.type === 'user_profiles'
  );
  return mappedData;
};

export const getUser = () => async (dispatch, getState) => {
  try {
    const userData = await fetchUser();
    const userFollows = await fetchUserFollows(userData.data.data.id);
    const normalizedUserWithProfile = normalizeUser(mapRelationships(userData));
    setRollbarUser(userData.data.data);

    const normalizedUser =
      normalizedUserWithProfile.user[
        Object.keys(normalizedUserWithProfile.user)[0]
      ];
    normalizedUser.relationships = {
      ...normalizedUser.relationships,
      ...get(userFollows, 'data.data.relationships')
    };
    normalizedUser.attributes.notification_settings = reduceArrayToObjectWithKeyAndValuePair(
      normalizedUser.attributes.notification_settings,
      'key',
      'value'
    );
    normalizedUser.attributes.ui_settings = reduceArrayToObjectWithKeyAndValuePair(
      normalizedUser.attributes.ui_settings,
      'key',
      'value'
    );
    normalizedUser.attributes.counters =
      normalizedUser.relationships.user_profile.data.attributes.counters;

    const actions = [
      addUser(normalizedUser),
      addPeople(normalizedUserWithProfile.user),
      setLeftMenuOpen(normalizedUser.attributes.ui_settings.left_menu_open),
      setDockContents(normalizedUser.attributes.ui_settings.minimize_dock),
      setUnprioritizedPanel(
        normalizedUser.attributes.ui_settings.unprioritizedPanelClosed
      )
    ];

    const topicFilter =
      normalizedUser.attributes.ui_settings.left_menu_topics_filter;
    const peopleFilter =
      normalizedUser.attributes.ui_settings.left_menu_people_filter;

    Object.keys(topicFilters).includes(topicFilter) &&
      actions.push(setTopicFilters([topicFilter]));
    Object.keys(peopleFilters).includes(peopleFilter) &&
      actions.push(setPeopleFilters([peopleFilter]));

    dispatch(batchActions(actions));
  } catch (error) {
    failure('Unable to load user details');
    // logRollBarError( error, 'error', 'Unable to load user details' );
  }
};

export const updateUserDefaultOrder = ({ orderType, orderValue }) => async (
  dispatch,
  getState
) => {
  const sm = stateMappings(getState());
  const userId = sm.user.id;
  const reduxUpdate = { [orderType]: { data: orderValue } };
  const serverUpdate = {
    id: orderValue,
    type: orderType == 'topic_orders' ? orderType : `${orderType}s`
  };

  try {
    dispatch(changeUser({ relationships: reduxUpdate }));
    await postOrderChange(userId, serverUpdate);
  } catch (error) {
    console.log('Error posting order change', error);
    logRollBarError(error, 'warning', 'Error posting order change');
  }
};

export const updateUserDefaultOrderForTopic = ({ order, update }) => async (
  dispatch,
  getState
) => {
  const sm = stateMappings(getState());
  const userId = sm.user.id;

  const currentOrders = sm.user.relationships[order].data;
  const reduxUpdate = [
    ...currentOrders.filter(order => order.topic_id !== update.topic_id),
    update
  ];
  const relationships = {};
  set(relationships, `${order}.data`, reduxUpdate);

  try {
    dispatch(changeUser({ relationships }));
    await postOrderChange(userId, update);
  } catch (error) {
    console.log('Error posting order change', error);
    logRollBarError(error, 'warning', 'Error posting order change');
  }
};

export const updateSelectedCard = selectedCardId => async (
  dispatch,
  getState
) => {
  if (selectedCardId.includes('-')) {
    selectedCardId = idFromSlug(selectedCardId);
  }

  const user = stateMappings(getState()).user;

  return dispatch(
    changeUser({
      attributes: {
        ui_settings: { ...user.attributes.ui_settings, selectedCardId }
      }
    })
  );
};

export const updateUserUiSettings = ({ newSettings }) => async (
  dispatch,
  getState
) => {
  const user = stateMappings(getState()).user;
  const userId = user.attributes.id;
  const userProfileId = user.attributes.user_profile_id;
  const newUiSettings = {
    ui_settings: newSettings
  };

  dispatch(
    changeUser({
      attributes: {
        ui_settings: { ...user.attributes.ui_settings, ...newSettings }
      }
    })
  );

  const userUiSettingsPost = util_UserProfilePostContent({
    userId,
    userProfileId,
    updatedContent: newUiSettings
  });
  try {
    await postUserProfile(userId, userUiSettingsPost);
  } catch (error) {
    failure('There was a problem saving your changes');
    logRollBarError(error, 'warning', 'Error in updateUserUiSettings');
  }
};

const util_UserProfilePostContent = ({
  userId,
  userProfileId,
  updatedContent
}) => ({
  id: userProfileId,
  user_id: userId,
  data: {
    attributes: {
      user_attributes: {
        id: userId
      }
    },
    ...updatedContent
  }
});
