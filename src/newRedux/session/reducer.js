import actionTypes from './actionEnum';

const defaultState = {
  launchComplete: false,
  labelOrdersUserHasConfirmedNewOrChangeOrder: [],
  peopleOrdersUserHasConfirmedNewOrChangeOrder: [],
  topicsUserHasBeenInformedNoSelectedLabelOrder: [],
  topicsUserHasBeenInformedNoSelectedPeopleOrder: [],
  topicsUserHasConfirmedNewOrChangeOrder: [],
};

const reducer = (state = defaultState, action) => {

  switch (action.type) {

    case actionTypes.addLabelOrderIdToLabelOrderNewOrChangeConfirmed:
      return { ...state, labelOrdersUserHasConfirmedNewOrChangeOrder: [ ...state.labelOrdersUserHasConfirmedNewOrChangeOrder, action.payload ] };


    case actionTypes.addPeopleOrderIdToPeopleOrderNewOrChangeConfirmed:
      return { ...state, peopleOrdersUserHasConfirmedNewOrChangeOrder: [ ...state.peopleOrdersUserHasConfirmedNewOrChangeOrder, action.payload ] };


    case actionTypes.addTopicIdToNoSelectedLabelOrderInformed:
      return { ...state, topicsUserHasBeenInformedNoSelectedLabelOrder: [ ...state.topicsUserHasBeenInformedNoSelectedLabelOrder, action.payload ] };


    case actionTypes.addTopicIdToNoSelectedPeopleOrderInformed:
      return { ...state, topicsUserHasBeenInformedNoSelectedPeopleOrder: [ ...state.topicsUserHasBeenInformedNoSelectedPeopleOrder, action.payload ] };


    case actionTypes.addTopicIdToTopicOrderNewOrChangeConfirmed:
      return { ...state, topicsUserHasConfirmedNewOrChangeOrder: [ ...state.topicsUserHasConfirmedNewOrChangeOrder, action.payload ] };


    case actionTypes.setLaunchComplete:
      return { ...state, launchComplete: action.payload };

    default:
      return state;
  };
};

export default reducer;
