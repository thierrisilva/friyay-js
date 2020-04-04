/* global vex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AddLabelForm from './AddLabelForm';
import LabelRows from './LabelRows';
import { removeLabel } from 'Src/newRedux/database/labels/thunks';
import { mapLabelsByKind } from 'Src/newRedux/database/labels/selectors';
import { stateMappings } from 'Src/newRedux/stateMappings';
// import { getLabelsInAlphaOrder } from 'Src/newRedux/database/labels/selectors';


class LabelGroup extends Component {
  // static propTypes = {
  //   isTypeLabel: PropTypes.string.isRequired,
  //   labels: PropTypes.array,
  //   isLoadingLabels: PropTypes.bool,
  //   labelsFilter: PropTypes.array,
  //   addLabel: PropTypes.func,
  //   removeLabel: PropTypes.func,
  //   location: PropTypes.object,
  //   remove: PropTypes.func.isRequired,
  //   selectedLabel: PropTypes.object,
  //   handleLabelSelect: PropTypes.func.isRequired
  // };

  state = {
    viewMode: 'label_list',
  };


  handleLabelDelete = label => {
    const id = label.id;
    const { props: { remove } } = this;

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this label?',
      callback: async value => value && remove(id)
    });
  }

  switchView = ( viewMode ) => {
    this.setState(state => ({ ...state, viewMode }));
  }


  render() {
    const {
      props: {
        canAddOrEdit,
        kind,
        labels,
        selectedLabelIds,
        onCreateLabel,
        onLabelSelect
      },
      state: {
        viewMode
      }
    } = this;


    return (
      <div className="label-group">
        { viewMode == 'add_label' ? (
          <AddLabelForm
            labelType={ kind }
            switchView={ this.switchView }
            onCreateLabel={ onCreateLabel }/>
        ) : (
          <LabelRows
            canAddOrEdit={ canAddOrEdit }
            labelType={kind}
            labels={labels}
            onAddLabelClick={ () => this.switchView('add_label') }
            onLabelSelect={ onLabelSelect }
            onLabelDelete={this.handleLabelDelete}
            selectedLabelIds={ selectedLabelIds }  />
        )
        }
      </div>
    );
  }
}

const mapState = ( state, props ) => {
  return {
    labels: mapLabelsByKind( state )[ props.kind ]
  }

}

const mapDispatch = {
  remove: removeLabel
};

export default connect(mapState, mapDispatch)( LabelGroup) ;
