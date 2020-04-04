/* global vex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import AddLabelForm from './add_label_form';
import LabelRows from './label_rows';
import { removeLabel } from 'Actions/labels';
import { addLabelFilter, removeLabelFilter } from 'Actions/labelsFilter';

class LabelsFilter extends Component {
  static propTypes = {
    isTypeLabel: PropTypes.string.isRequired,
    labels: PropTypes.array,
    isLoadingLabels: PropTypes.bool,
    labelsFilter: PropTypes.array,
    addLabel: PropTypes.func.isRequired,
    removeLabel: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
  };

  state = {
    viewMode: 'label_list',
  };

  handleLabelSelect = label => {
    const id = label.id;
    const { props: { addLabel: add, removeLabel: remove, labelsFilter } } = this;
    labelsFilter.includes(id) ? remove(id) : add(id);
  }

  handleLabelDelete = label => {
    const id = label.id;
    const { props: { remove } } = this;

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this label?',
      callback: async value => value && remove(id)
    });
  }

  switchView = viewMode =>
    this.setState(state => ({ ...state, viewMode }));

  render() {
    const {
      props: {
        isTypeLabel,
        labels,
        isLoadingLabels,
        labelsFilter
      },
      state: {
        viewMode
      }
    } = this;

    let labelsFilterContent = (
      <LabelRows
        labelType={isTypeLabel}
        labels={labels}
        labelsFilter={labelsFilter}
        handleAddLabelClick={() => this.switchView('add_label')}
        isLoading={isLoadingLabels}
        handleLabelSelect={this.handleLabelSelect}
        handleLabelDelete={this.handleLabelDelete}
      />
    );

    if (viewMode === 'add_label') {
      labelsFilterContent = (
        <AddLabelForm
          labelType={isTypeLabel}
          switchView={this.switchView}
        />
      );
    }

    return (
      <div className="labels-filter-panel-body-section">
        {labelsFilterContent}
      </div>
    );
  }
}

const mapState = ({ labelsFilter }) => ({ labelsFilter });
const mapDispatch = {
  addLabel: addLabelFilter,
  removeLabel: removeLabelFilter,
  remove: removeLabel
};

export default connect(mapState, mapDispatch)(withRouter(LabelsFilter));
