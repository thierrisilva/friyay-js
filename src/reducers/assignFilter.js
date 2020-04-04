import { SET_ASSIGN_FILTER } from 'AppConstants';

const RECENT_ASSIGNEES_KEY = 'recentAssignees';
const RECENT_ASSIGNEES_MAX = 10;

const initialState = {
  assignedTo: null,
  recentAssignees: JSON.parse(localStorage.getItem(RECENT_ASSIGNEES_KEY)) || []
};

export default function assignFilter(state = initialState, { type, payload }) {
  switch (type) {
    case SET_ASSIGN_FILTER:
      return setAssignFilter(state, payload);
    default:
      return state;
  }
}

function setAssignFilter(state, assignedTo) {
  let recentAssignees = state.recentAssignees;

  if (assignedTo) {
    recentAssignees = [
      assignedTo,
      ...recentAssignees.filter(id => id !== assignedTo)
    ].slice(0, RECENT_ASSIGNEES_MAX);

    localStorage.setItem(RECENT_ASSIGNEES_KEY, JSON.stringify(recentAssignees));
  }

  return {
    ...state,
    assignedTo,
    recentAssignees
  };
}
