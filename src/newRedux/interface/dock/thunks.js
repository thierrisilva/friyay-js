import { stateMappings } from 'Src/newRedux/stateMappings';
import { setDockContents, setDockOpen } from './actions';
import { updateUserUiSettings } from 'Src/newRedux/database/user/thunks';
import { batchActions } from 'redux-batch-enhancer'


export const addCardToDock = ( cardId ) => async(dispatch, getState) => {

  const newDockContents = [ ...stateMappings( getState() ).dock.cardsInDock.filter( id => id != cardId ), cardId ];
  const batchedActions = [
    setDockContents( newDockContents ),
    updateUserUiSettings({ newSettings: { minimize_dock: newDockContents }})
  ];
  if ( newDockContents.length == 1 ) {
    batchedActions.push( setDockOpen() );
  }
  dispatch( batchActions( batchedActions ));
};


export const removeCardFromDock = ( cardId ) => async(dispatch, getState) => {
  const dockContents = stateMappings( getState() ).dock.cardsInDock;
  if ( dockContents.includes( cardId ) ) {
    const newDockContents = dockContents.filter( id => id != cardId );
    dispatch( batchActions([
      setDockContents( newDockContents ),
      updateUserUiSettings({ newSettings:{ minimize_dock: newDockContents }})
    ]));
  }

};
