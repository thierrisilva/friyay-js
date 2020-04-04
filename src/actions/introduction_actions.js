import AppDispatcher from '../dispatchers/app_dispatcher';

var IntroductionActions = {
  findOrCreate: function(title) {
    AppDispatcher.dispatch({
      actionType: 'INTRODUCTION_TOPIC_FIND_OR_CREATE',
      title: title
    });
  }
};

export default IntroductionActions;
