import AppDispatcher from '../../dispatchers/app_dispatcher';

const RightBarViewActions = {
  onTipViewChange: view => {
    AppDispatcher.dispatch({
      actionType: 'TIP_VIEW_CHANGE',
      view
    });
    
    view !== 'menu' && localStorage.setItem('view', view);
  }
};

export default RightBarViewActions;
