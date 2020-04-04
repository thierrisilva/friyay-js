import { createSelector } from 'reselect';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { sortAlpha } from 'Lib/utilities';

export const getGroups = (state) => sortAlpha( Object.values( state._newReduxTree.database.groups ), 'title' );
