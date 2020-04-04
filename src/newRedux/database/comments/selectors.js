import { createSelector } from 'reselect';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { reduceArrayToMappedObjectForAttribute } from 'Lib/utilities';

//note: not sorting comments as their IDs should be a natural chrono sort
const getComments = (state) => state._newReduxTree.database.comments;

export const getCommentArray = createSelector(
  ( state ) => getComments( state ),
  ( comments ) => Object.values( comments )
)

export const getCommentsByCardId = createSelector(
  ( state ) => getCommentArray( state ),
  ( comments ) => reduceArrayToMappedObjectForAttribute( comments, 'attributes.commentable_id' )
)
