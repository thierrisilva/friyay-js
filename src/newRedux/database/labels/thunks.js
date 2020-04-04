/* global vex */
import { normalizeLabel, normalizeLabels } from './schema';
import { addLabels, changeLabel, deleteLabel } from './actions';
import api from './apiCalls';
import { success, failure } from 'Utils/toast';



export const createLabel = ({ attributes, relationships }) => async(dispatch, getState) => {

  try {
    const newServerLabel = await api.postLabel({ attributes, relationships });
    dispatch( addLabels( normalizeLabel( newServerLabel ).labels ));
    success('New label created!');
    return newServerLabel;
  } catch (error) {
    failure('Unable to save new label');
    return null;
  }
}



export const getLabels = () => async(dispatch, getState) => {

  try {
    const labelsData = await api.fetchLabels();
    dispatch( addLabels( normalizeLabels( labelsData ).labels ) );
    return labelsData;

  } catch (error) {
    failure('Unable to load labels');
    return null
  }
};



export const removeLabel = (labelId) => async(dispatch, getState) => {

  vex.dialog.confirm({
    message: 'Are you sure you want to delete this label?',
    callback: async value => {
      if (value) {

        const thisLabel = getState()._newReduxTree.database.labels[ labelId ];
        dispatch( deleteLabel( labelId ));

        try {
          await api.deleteLabel( labelId );

        } catch (error) {
          failure('Unable to remove label');
        }
      }
    }
  });
};


export const updateLabel = ({ id, attributes, relationships }) => async(dispatch, getState) => {
  try {
    const prevLabelData = { ...getState()._newReduxTree.database.labels[ id ] };
    const updatedLabel = {
      ...prevLabelData,
      attributes: {
        ...prevLabelData.attributes,
        ...attributes
      },
      relationships: {
        ...prevLabelData.relationships,
        ...relationships
      }
    }
    dispatch( changeLabel( updatedLabel ));
    await api.patchLabel( updatedLabel );

  } catch (error) {
    console.error('error patching label', error);
    failure ('Unable to save updates');
  }
}



//
// export const assignLabel = (label, cardId) => async(dispatch, getState) => {
//
//   try {
//     var response = await assignLabelToTip( label, cardId);
//     console.log(response);
//     const updatedCard = response.data.data;
//     dispatch({ type: DB_CARDS__UPDATE_CARDS, payload: { [updatedCard.id]: updatedCard } });
//
//   } catch (error) {
//     failure('Unable to add Label to Tip');
//
//   }
// }
//
// export const unassignLabel = (label, cardId) => async(dispatch, getState) => {
//
//   try {
//     var response = await unassignLabelFromTip( label, cardId);
//     console.log(response);
//     const updatedCard = response.data.data;
//     dispatch({ type: DB_CARDS__UPDATE_CARDS, payload: { [updatedCard.id]: updatedCard } });
//
//   } catch (error) {
//     failure('Unable to remove Label from Tip');
//
//   }
// }
