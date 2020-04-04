import { stateMappings } from 'Src/newRedux/stateMappings';
import Ability from 'Lib/ability';
import { toggleItemInclusionInArray } from 'Lib/utilities';
import { success, failure } from 'Utils/toast';
import set from 'lodash/set';
import { changeCard } from 'Src/newRedux/database/cards/actions';
import { returnRecordWithNewAttributes } from 'Lib/utilities';
import { addComments, changeComment, deleteComment } from './actions';
import api from './apiCalls';
import { deNormalizeComment, normalizeComment, normalizeComments } from './schema';




export const createCommentForCard = ({ newComment, cardId }) => async(dispatch, getState) => {
  try {
    const card = stateMappings( getState() ).cards[ cardId ];
    const cardUpdate = returnRecordWithNewAttributes({
      record: card,
      attributes: [ 'attributes.comments_count' ],
      values: [ card.attributes.comments_count + 1 ]
    });

    const newServerComment = await api.postCommentOnCard( newComment, cardId );
    dispatch( changeCard( cardUpdate ) );
    dispatch( addComments( normalizeComment( newServerComment ).comments ));
    success('New comment created!');
    return newServerComment;

  } catch (error) {
    failure('Unable to save new comment');
    return null;
  }
}


export const getComment = ( commentId ) => async(dispatch, getState) => {

  try {
    const commentData = await api.fetchComment( commentId );
    dispatch( addComments( normalizeComment( commentData ).comments ));
    return commentData;

  } catch (error) {
    failure('Unable to load comment');
    return null;
  }
};



export const getCommentsForCardId = ({ cardId }) => async(dispatch, getState) => {

  try {
    const commentsData = await api.fetchComments( cardId );
    dispatch( addComments( normalizeComments( commentsData ).comments ));
    return commentsData;

  } catch (error) {
    failure('Unable to load comments');
    return null;
  }
};


export const removeComment = ( commentId ) => async(dispatch, getState) => {

  const thisComment = stateMappings( getState() ).comments[ commentId ];
  dispatch( deleteComment( commentId ));

  try {
    await api.deleteComment( commentId );

  } catch (error) {
    failure('Unable to remove comment');
    dispatch( addComments({ [thisComment.id]: thisComment } ));
  }
};



export const updateComment = ({ attributes, id, relationships }) => async( dispatch, getState ) => {

  const prevVersion = { ...getState()._newReduxTree.database.comments[ id ] };

  const newVersion = { ...prevVersion, attributes: { ...prevVersion.attributes, ...attributes }, relationships: { ...prevVersion.relationships, ...relationships } }
  dispatch( changeComment( newVersion ));

  try {
    await api.patchComment( deNormalizeComment( newVersion ) );

  } catch (error) {
    failure('Unable to save comment changes');
    dispatch( changeComment( prevVersion ));
  }
};
