import actionTypes from './actionEnum';
import mergeWith from 'lodash/mergeWith';
import omit from 'lodash/omit';
import isArray from 'lodash/isArray';

const defaultState = {};

const addTopicDesign = (state, { data }) => {
  const designTopic = state[data.attributes.topic_id];
  designTopic.attributes.topic_designs = [
    ...designTopic.attributes.topic_designs,
    { id: data.id, ...data.attributes }
  ];
  return designTopic;
};

const updateTopicDesign = (state, payload) => {
  const designTopic = state[payload.topic_id];
  const index = designTopic.attributes.topic_designs.findIndex(
    d => Number(d.id) === Number(payload.id)
  );
  designTopic.attributes.topic_designs[index] = payload;
  return designTopic;
};

const deleteTopicDesign = (state, payload) => {
  const designTopic = state[payload.topic_id];
  const index = designTopic.attributes.topic_designs.findIndex(
    d => Number(d.id) === Number(payload.id)
  );
  designTopic.attributes.topic_designs.splice(index, 1);
  return designTopic;
};

const activateTopicDesign = (state, payload) => {
  const designTopic = state[payload.data.relationships.topic.data.id];
  designTopic.attributes.topic_design_id_for_current_user =
    payload.data.attributes.topic_design_id;
  return designTopic;
};

const setDefaultDesign = (state, payload) => {
  const designTopic = state[payload.topic_id];
  designTopic.attributes.default_design_id = payload.design_id;
  return designTopic;
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.add:
      // using merge as records come without attributes from index route
      // adding mergewith as arrays got merged when should be replaced
      // eg. when reducing the number of users shared with.
      return {
        ...mergeWith(
          { ...state },
          action.payload,
          (stateValue, actionValue) => {
            if (isArray(actionValue)) {
              return actionValue;
            }
          }
        )
      };

    case actionTypes.change:
    case actionTypes.changeMany:
      return { ...state, ...action.payload };

    case actionTypes.delete:
      return omit(state, [action.payload]);

    case actionTypes.replace:
      return {
        ...omit(state, [action.payload.replaceId]),
        ...action.payload.replacement
      };

    case actionTypes.addDesign:
      return {
        ...state,
        [action.payload.data.attributes.topic_id]: addTopicDesign(
          state,
          action.payload
        )
      };

    case actionTypes.updateDesign:
      return {
        ...state,
        [action.payload.topic_id]: updateTopicDesign(state, action.payload)
      };

    case actionTypes.deleteDesign:
      return {
        ...state,
        [action.payload.topic_id]: deleteTopicDesign(state, action.payload)
      };

    case actionTypes.activateDesign:
      return {
        ...state,
        [action.payload.data.relationships.topic.data.id]: activateTopicDesign(
          state,
          action.payload
        )
      };

    case actionTypes.setDefaultDesign:
      return {
        ...state,
        [action.payload.topic_id]: setDefaultDesign(state, action.payload)
      };

    default:
      return state;
  }
};

export default reducer;
