import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LabelsFilter from './labels_filter_panel/labels_filter';
import { toggleLabelsPanel } from 'Actions/labelsPanel';

const kinds = ['private', 'public', 'system'];

class LabelsFilterPanel extends Component {
  static propTypes = {
    labels: PropTypes.array,
    isLoading: PropTypes.bool,
    togglePanel: PropTypes.func.isRequired,
  }

  handleCloseLabelFilterView = e => {
    e.preventDefault();
    this.props.togglePanel();
  }

  render() {
    const { props: { labels, isLoading } } = this;

    const filters = kinds
      .map(kind => {
        const labelsOfKind = labels.filter(label => label.attributes.kind === kind);

        return (
          <LabelsFilter
            key={`labels-kind-${kind}`}
            labels={labelsOfKind}
            isTypeLabel={kind}
            isLoadingLabels={isLoading}
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
  }
}) => ({
  isLoading,
  labels
});

const mapDispatch = {
  togglePanel: toggleLabelsPanel
};

export default connect(mapState, mapDispatch)(LabelsFilterPanel);
