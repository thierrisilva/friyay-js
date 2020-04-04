import { createSelector } from 'reselect';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { reduceArrayToMappedObjectForAttribute } from 'Lib/utilities';

const getLabels = (state) => state._newReduxTree.database.labels;

export const getLabelsInAlphaOrder = createSelector(
  [ getLabels ],
  ( labels ) => {
    return Object.values(labels).sort((a, b) => a.attributes.name.toLowerCase().localeCompare( b.attributes.name.toLowerCase() ))
  }
)


export const mapLabelsByKind = createSelector(
  ( state ) => getLabelsInAlphaOrder( state ),
  ( labelsInAlphaOrder ) => reduceArrayToMappedObjectForAttribute( labelsInAlphaOrder, 'attributes.kind', 'system' )
)
