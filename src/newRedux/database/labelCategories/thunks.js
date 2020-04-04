import {
  fetchLabelCategories,
  patchLabelCategory,
  postLabelCategory,
  deleteCategory
} from './apiCalls';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { success, failure } from 'Utils/toast';
import { normalizeLC, normalizeLCs } from './schema';
import {
  addLabelCategories,
  changeLabelCategory,
  deleteLabelCategory
} from './actions';

export const createLabelCategory = name => async (dispatch, getState) => {
  try {
    const newLabelCategory = await postLabelCategory(name);
    dispatch(addLabelCategories(normalizeLC(newLabelCategory).labelCategories));
    return newLabelCategory;
  } catch (error) {
    failure(' Unable to save new label category');
    return null;
  }
};

export const getLabelCategories = () => async dispatch => {
  try {
    const labelCategoriesData = await fetchLabelCategories();
    dispatch(
      addLabelCategories(normalizeLCs(labelCategoriesData).labelCategories)
    );
  } catch (error) {
    failure('Unable to load label categories');
  }
};

export const removeLabelCategory = categoryId => async (dispatch, getState) => {
  try {
    const removedLabelCategory = await deleteCategory(categoryId);
    dispatch(deleteLabelCategory(categoryId));
    return removedLabelCategory;
  } catch (error) {
    failure('Unable to remove the label category');
    return null;
  }
};

export const updateLabelCategory = (categoryId, attributes) => async (
  dispatch,
  getState
) => {
  const existingCategory = stateMappings(getState()).labelCategories[
    categoryId
  ];
  const updatedCategory = {
    ...existingCategory,
    attributes: {
      ...existingCategory.attributes,
      ...attributes
    }
  };

  dispatch(changeLabelCategory(updatedCategory));

  try {
    await patchLabelCategory(categoryId, attributes);
    success('Label category saved');
  } catch (error) {
    failure('Unable to save changes to that label category');
    dispatch(changeLabelCategory(existingCategory));
  }
};
