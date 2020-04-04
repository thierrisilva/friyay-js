import actionTypes from './actionEnum';
import { reNormalizeArrayOfRecords } from 'Lib/utilities';


export const addCards = ( normalizedCards ) => ({
  type: actionTypes.add,
  payload: normalizedCards
});


export const deleteCard = ( cardId ) => ({
  type: actionTypes.delete,
  payload: cardId
});



export const changeCard = ( card ) => ({
  type: actionTypes.change,
  payload: {
    [ card.id ]: card
  }
});

export const changeCards = ( cards ) => ({
  type: actionTypes.change,
  payload: reNormalizeArrayOfRecords( cards )
});


export const replaceCard = ( replaceCardId, replacementCard ) => ({
  type: actionTypes.replace,
  payload: {
    replaceId: replaceCardId,
    replacement: {
      [ replacementCard.id ]: replacementCard
    }
  }
});
