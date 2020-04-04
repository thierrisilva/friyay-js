import actionTypes from './actionEnum';

const defaultState = {
  any_assignee_cards_weekly_status: {
    card_complete_weekly: [],
    card_overdue_weekly: [],
    card_unstarted_weekly: [],
  },
  card_clean_up_status: {},
  current_day_tip_status: {
    card_at_risk_today: [],
    card_overdue_today: [],
    card_complete_today: [],
    card_started: [],
  },
  topic_based_cards_status: [],
  weekly_tip_status: [],
  workspace_card_weekly_status: {},
  topics: [],
  users: [],
  commandsResponse: [],
};

const filterCurrentDayStatus = (currentArray, payload) => {
  const filteredArray = Array.isArray(currentArray)
    ? currentArray.filter(item => item.id != payload.id) : [];
  return payload.id ? [ ...filteredArray, payload] : filteredArray;
};

const reducer = (state = defaultState, action) => {

  switch (action.type) {

    case actionTypes.get:
      return {
        ...state,
        ...action.payload,
        showBadge: false
      };

    case actionTypes.post:
      return { ...state, ...action.payload };

    case actionTypes.setCommandResponse:
      return {
        ...state,
        commandsResponse: [ ...state.commandsResponse, action.payload ]
      };

    case actionTypes.setLiveNotification: {
      const { card_at_risk, card_overdue, card_complete, card_started } = action.payload;

      return {
        ...state,
        showBadge: true,
        current_day_tip_status: {
          card_at_risk_today: filterCurrentDayStatus(state.current_day_tip_status.card_at_risk_today, card_at_risk),
          card_overdue_today: filterCurrentDayStatus(state.current_day_tip_status.card_overdue_today, card_overdue),
          card_complete_today: filterCurrentDayStatus(state.current_day_tip_status.card_complete_today, card_complete),
          card_started: filterCurrentDayStatus(state.current_day_tip_status.card_started, card_started),
        }
      };
    }

    case actionTypes.getUsersAndTopics:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export default reducer;
