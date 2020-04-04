import AppDispatcher from '../dispatchers/app_dispatcher';

const SubTopicsNavActions = {
	toggle(value, topic) {
    AppDispatcher.dispatch({
			actionType: 'TOGGLE_SUBTOPICS_NAV',
      value,
      topic
    });
  },
};

export default SubTopicsNavActions;
