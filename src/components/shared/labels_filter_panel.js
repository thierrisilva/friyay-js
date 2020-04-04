import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LabelsFilter from './labels_filter_panel/labels_filter';
import { toggleLabelsPanel } from 'Actions/labelsPanel';
import LabelGroup from './labels/elements/LabelGroup';
import { addLabelFilter, removeLabelFilter } from 'Actions/labelsFilter';

const kinds = ['private', 'public', 'system'];

class LabelsFilterPanel extends Component {
  static propTypes = {
    labels: PropTypes.array,
    isLoading: PropTypes.bool,
    togglePanel: PropTypes.func.isRequired,
  }

  handleLabelSelect = label => {
    const id = label.id;
    const { props: { addLabel: add, removeLabel: remove, labelsFilter } } = this;
    labelsFilter.includes(id) ? remove(id) : add(id);
  }

  handleCloseLabelFilterView = e => {
    e.preventDefault();
    this.props.togglePanel();
  }

  render() {
    const { props: { labels, isLoading, labelsFilter } } = this;

    const filters = kinds
      .map(kind => {
        const labelsOfKind = labels.filter(label => label.attributes.kind === kind);

        return (
          <LabelGroup
            key={`labels-kind-${kind}`}
            labels={labelsOfKind}
            isTypeLabel={kind}
            isLoadingLabels={isLoading}
            labelsFilter={labelsFilter}
            handleLabelSelect={this.handleLabelSelect}
          />
        );
      });

    return (
      <div className="labels-filter-panel">
        <div className="labels-filter-panel-body">
          <a
            onClick={this.handleCloseLabelFilterView}
            className="close-labels-view-filter"
          >
            <i className="fa fa-chevron-right" />
          </a>
          {filters}
        </div>
      </div>
    );
  }
}

const mapState = ({
  labels: {
    isLoading,
    collection: labels
  },
  labelsFilter
}) => ({
  isLoading,
  labels,
  labelsFilter
});

const mapDispatch = {
  addLabel: addLabelFilter,
  removeLabel: removeLabelFilter,
  togglePanel: toggleLabelsPanel
};

export default connect(mapState, mapDispatch)(LabelsFilterPanel);
