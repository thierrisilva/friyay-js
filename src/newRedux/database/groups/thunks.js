/* global vex */
import { deNormalizeGroup, normalizeGroup, normalizeGroups } from './schema';
import { addGroups, changeGroup, deleteGroup, mergeFollows, replaceGroup } from './actions';
import api from './apiCalls';
import { success, failure } from 'Utils/toast';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { idFromSlug } from 'Lib/utilities';



export const createGroup = ( group ) => async(dispatch, getState) => {

  try {
    const newGroup = await api.postGroup( deNormalizeGroup( group ));
    dispatch( addGroups( normalizeGroup( newGroup ).groups ));
    dispatch( selectGroup( newGroup.data.data.attributes.slug ) );
    return newGroup;

  } catch (error) {
    failure(' Unable to save new group');
    return null;
  }
}


export const getGroups = () => async(dispatch, getState) => {
  try {
    const groupsData = await api.fetchGroups();
    dispatch( addGroups( normalizeGroups( groupsData ).groups ) );
    return groupsData;

  } catch (error) {
    failure('Unable to load groups');
    return null;
  }
};


export const getGroupFollows = ( groupId ) => async(dispatch, getState) => {
  const groupFollowsData = await api.fetchGroupFollows( groupId );
  dispatch( mergeFollows( groupId, groupFollowsData.data.data.relationships ) );
}


export const removeGroup = ( groupId ) => async(dispatch, getState) => {

  vex.dialog.confirm({
    message: 'Are you sure you want to delete this team?',
    callback: async value => {
      if (value) {
        const thisGroup = getState()._newReduxTree.database.groups[ groupId ];
        const routerHistory = stateMappings( getState() ).routing.routerHistory;
        routerHistory.push( '/' );
        dispatch( deleteGroup( groupId ));
        try {
          await api.deleteGroup( groupId );
          success( 'Team removed ');
        } catch (error) {
          failure('Unable to remove team');
          dispatch( addGroups({ [thisGroup.id]: thisGroup } ));
        }
      }
    }
  });
};


export const selectGroup = ( groupSlug ) => async(dispatch, getState) => {
  try {
    const routerHistory = stateMappings( getState() ).routing.routerHistory;
    routerHistory.push( `/groups/${ groupSlug }` );
    dispatch( getGroupFollows( idFromSlug( groupSlug) ));

  } catch (error) {
    failure('Unable to load group following data');
    return null;
  }
}


export const updateGroup = ({ attributes = {}, id, relationships = {} }) => async( dispatch, getState ) => {

  const prevVersion = { ...getState()._newReduxTree.database.groups[ id ] };

  const newVersion = { ...prevVersion, attributes: { ...prevVersion.attributes, ...attributes }, relationships: { ...prevVersion.relationships, ...relationships } }
  dispatch( changeGroup( newVersion ));
  try {
    const updatedGroup = await api.patchGroup( deNormalizeGroup( newVersion ) );
    return updatedGroup;
  } catch (error) {
    failure('Unable to save changes');
    dispatch( changeGroup( prevVersion ));
    return null;
  }
};
