import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GroupItemLabels from './group_item_labels';
import Loader from '../../../../shared/Loader';
import { SCREEN } from 'Enums';

import { removeLabelCategory } from 'Src/newRedux/database/labelCategories/thunks';
import { getLabelsInAlphaOrder } from 'Src/newRedux/database/labels/selectors';
import { getLabelCategoriesArray } from 'Src/newRedux/database/labelCategories/selectors';

class ItemLabelsListing extends Component {
  static propTypes = {
    switchScreen: PropTypes.func.isRequired,
    labels: PropTypes.array,
    labelsCategory: PropTypes.array,
    isLoadingLC: PropTypes.bool,
    isLoading: PropTypes.bool,
    handleLabelChange: PropTypes.func,
    removeLabelCategory: PropTypes.func,
    selectedLabels: PropTypes.array
  };
  state = {
    privateLabelCategoryForm: false,
    publicLabelCategoryForm: false,
    label_categories_hash: {}
  };

  componentDidMount() {
    if (
      this.props.labelsCategory.length !=
      2 * Object.keys(this.state.label_categories_hash).length
    ) {
      let hash1 = new Object();
      const label_categories_ids = this.props.labelsCategory.map(a => a.id);
      label_categories_ids.map(
        n => ((hash1[n + 'private'] = false), (hash1[n + 'public'] = false))
      );
      this.setState({ label_categories_hash: hash1 });
    }
  }

  handleToggleLabelCategoryForms = kind => {
    let labels_kind_id = '#labels-' + kind;
    let current_state = this.state;
    if (kind == 'private') {
      this.setState((prevState, props) => ({
        privateLabelCategoryForm: !prevState.privateLabelCategoryForm
      }));
      if (!current_state.privateLabelCategoryForm) {
        $(labels_kind_id).animate(
          {
            scrollTop: 0
          },
          800
        );
      }
    } else {
      this.setState((prevState, props) => ({
        publicLabelCategoryForm: !prevState.publicLabelCategoryForm
      }));
      if (!current_state.publicLabelCategoryForm) {
        $(labels_kind_id).animate(
          {
            scrollTop: 0
          },
          800
        );
      }
    }
  };

  handleToggleLabelForms = (label_category_id, kind) => {
    let item = this.state.label_categories_hash[label_category_id + kind];
    let hash1 = this.state.label_categories_hash;
    item = !item;
    hash1[label_category_id + kind] = item;
    this.setState({ label_categories_hash: hash1 });
  };

  static defaultProps = {
    labels: [],
    labelsCategory: [],
    isLoadingLC: false,
    isLoading: false,
    selectedLabels: []
  };

  handleAddLabelClick = e => {
    e.preventDefault();
    this.props.switchScreen(SCREEN.LABEL_FORM);
  };

  render() {
    const {
      props: {
        labels,
        isLoading,
        switchScreen,
        handleLabelChange,
        selectedLabels,
        labelsCategory,
        removeLabelCategory
      }
    } = this;

    return (
      <div className="list-group list-options full-width">
        <div className="flex-r-center-spacebetween p15">
          <h4>Select Label</h4>
          <a onClick={this.handleAddLabelClick}>+ Add label</a>
        </div>
        <div className="flex-r-center-center">
          <Loader isLoading={isLoading} />
        </div>
        <GroupItemLabels
          selectedLabels={selectedLabels}
          labels={labels}
          labelsCategory={labelsCategory}
          switchScreen={switchScreen}
          handleLabelChange={handleLabelChange}
          privateLabelCategoryForm={this.state.privateLabelCategoryForm}
          handleToggleLabelCategoryForms={this.handleToggleLabelCategoryForms}
          handleToggleLabelForms={this.handleToggleLabelForms}
          publicLabelCategoryForm={this.state.publicLabelCategoryForm}
          label_categories_hash={this.state.label_categories_hash}
          removeLabelCategory={removeLabelCategory}
        />
      </div>
    );
  }
}

const mapState = (state, props) => {
  return {
    labels: getLabelsInAlphaOrder(state),
    isLoading: false,
    labelsCategory: getLabelCategoriesArray(state)
  };
};

const mapDispatch = {
  removeLabelCategory
};

export default connect(
  mapState,
  mapDispatch
)(ItemLabelsListing);
