import { createSelector } from 'reselect';

const getLabelCategories = (state) => state._newReduxTree.database.labelCategories;

export const getLabelCategoriesArray = createSelector(
  ( state ) => getLabelCategories( state ),
  ( labelCategories ) => Object.values( labelCategories )
)
