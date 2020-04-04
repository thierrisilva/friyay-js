import AppDispatcher from '../../dispatchers/app_dispatcher';

const RightBarLabelsFilterActions = {
  onRightBarFilterViewClose:() => {
    AppDispatcher.dispatch({
      actionType: 'CLOSE_FILTER_TIP_BY_LABEL'
    });
  }
};

export default RightBarLabelsFilterActions;
