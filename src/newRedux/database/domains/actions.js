import actionTypes from './actionEnum';

export const addDomains = ( normalizedRecords ) => ({
  type: actionTypes.add,
  payload: normalizedRecords
});

export const domainUpdate = (updatedDomain) => ({
  type: actionTypes.change,
  payload: updatedDomain
});

export const updateDomain = domain => ({
  type: actionTypes.update,
  payload: domain
});
