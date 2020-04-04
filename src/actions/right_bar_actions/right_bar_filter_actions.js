import AppDispatcher from '../../dispatchers/app_dispatcher';

const RightBarFilterActions = {
  onTipFilterChange:(view) => {
    AppDispatcher.dispatch({
      actionType: 'TIP_FILTER_CHANGE',
      view
    });
  },
  onRightBarFilterChange:(view) => {
    AppDispatcher.dispatch({
      actionType: 'RIGHTBAR_FILTER_CHANGE',
      view
    });
  },
};

export default RightBarFilterActions;
