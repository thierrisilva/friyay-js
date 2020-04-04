import React, { Component } from 'react';
import { bool, string, func, array, object} from 'prop-types';
import { toggleItemInclusionInArray } from 'Lib/utilities'
import LabelGroup from './LabelGroup';

const kinds = ['private', 'public', 'system'];

class SelectableLabelList extends Component {


  static propTypes = {
    canAddOrEdit: bool,
    containerClassName: string,
    selectedLabelIds: array,
    onChangeSelection: func.isRequired
  }


  handleLabelSelect = ( label ) => {
    const { selectedLabelIds, multiSelect, onChangeSelection } = this.props;
    const newSelection = multiSelect
      ? toggleItemInclusionInArray( label.id, selectedLabelIds )
      : [ label.id ];

    onChangeSelection( newSelection );
  }


  render() {
    const { canAddOrEdit, isIndicator, selectedLabelIds } = this.props;

    return(
      <div className='selectable-label-list' >
        { kinds.map( kind => (
          <LabelGroup
            canAddOrEdit={ canAddOrEdit }
            key={ kind }
            kind={ kind }
            onCreateLabel={ this.handleLabelSelect }
            onLabelSelect={ this.handleLabelSelect }
            selectedLabelIds={ selectedLabelIds } />
        ))}
      </div>
    );
  }
}


export default SelectableLabelList;
