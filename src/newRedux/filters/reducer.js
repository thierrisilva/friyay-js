import actionTypes from './actionEnum';
import { cardFilters } from 'Lib/config/filters/cards';
import { topicFilters } from 'Lib/config/filters/topics';

const defaultState = {
  assignedFilters: [],
  cardFilter: cardFilters.ALL.key,
  completedDateFilter: {
    startDate: null,
    endDate: null
  },
  createdDateFilter: {
    startDate: null,
    endDate: null
  },
  creatorFilters: [],
  dueDateFilter: {
    startDate: null,
    endDate: null
  },
  includeArchivedCards: false,
  includeSubtopicCards: true,
  includeNestedCards: true,
  includeCompletedCards: true,
  includeUnCompletedCards: true,
  includeUnCompletedSortedCards: false,
  labelFilters: [],
  priorityFilters: [],
  peopleFilters: ['ALL'],
  startDateFilter: {
    startDate: null,
    endDate: null
  },
  topicFilters: ['ALL']
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.setAssignedFilters:
      return { ...state, assignedFilters: action.payload };

    case actionTypes.setCardFilters:
      return { ...state, cardFilter: action.payload };

    case actionTypes.setCompletedDateFilter:
      return { ...state, completedDateFilter: action.payload };

    case actionTypes.setCreatedDateFilter:
      return { ...state, createdDateFilter: action.payload };

    case actionTypes.setCreatorFilters:
      return { ...state, creatorFilters: action.payload };

    case actionTypes.setDueDateFilter:
      return { ...state, dueDateFilter: action.payload };

    case actionTypes.setIncludeArchivedFilter:
      return { ...state, includeArchivedCards: action.payload };

    case actionTypes.setIncludeSubtopicCardsFilter:
      return { ...state, includeSubtopicCards: action.payload };

    case actionTypes.setIncludeNestedCardsFilter:
      return { ...state, includeNestedCards: action.payload };

    case actionTypes.setIncludeCompletedCardsFilter:
      return { ...state, includeCompletedCards: action.payload };

    case actionTypes.setIncludeUnCompletedCardsFilter:
      return { ...state, includeUnCompletedCards: action.payload };

    case actionTypes.setIncludeUnCompletedSortedCardsFilter:
      return { ...state, includeUnCompletedSortedCards: action.payload };

    case actionTypes.setLabelFilters:
      return { ...state, labelFilters: action.payload };

    case actionTypes.setPriorityLevelFilters:
      return { ...state, priorityFilters: action.payload };

    case actionTypes.setPeopleFilters:
      return { ...state, peopleFilters: action.payload };

    case actionTypes.setTopicFilters:
      return {
        ...state,
        topicFilters: action.payload.length > 0 ? action.payload : ['ALL']
      };

    case actionTypes.setStartDateFilter:
      return { ...state, startDateFilter: action.payload };

    default:
      return state;
  }
};

export default reducer;
