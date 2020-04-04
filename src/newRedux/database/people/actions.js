import actionTypes from './actionEnum';

export const addPeople = ( normalizedPeople ) => ({
  type: actionTypes.add,
  payload: normalizedPeople
});


export const changePerson = ( person ) => ({
  type: actionTypes.change,
  payload: {
    [ person.id ]: person
  }
});


export const deletePerson = ( personId ) => ({
  type: actionTypes.delete,
  payload: personId
});


export const mergeProfiles = ( normalizedUserProfilesWithUserIdasId ) => ({
  type: actionTypes.merge,
  payload: normalizedUserProfilesWithUserIdasId
});


export const replacePerson = ( replacePersonId, replacementPerson ) => ({
  type: actionTypes.replace,
  payload: {
    replaceId: replacePersonId,
    replacement: {
      [ replacementPerson.id ]: replacementPerson
    }
  }
});
