import actionTypes from './actionEnum';

export const toggleUtilityValue = keyValue => ({
  type: actionTypes.setUtilityValue,
  payload: keyValue
});

export const togglePriorityView = () => ({
  type: actionTypes.changePriorityView
});
