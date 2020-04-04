import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ItemLabelsListing from './label_tab_content/item_labels_listing';
import ItemLabelsForm from './label_tab_content/item_label_form';
import { SCREEN } from 'Enums';

export default class LabelTabContent extends PureComponent {
  static propTypes = {
    handleLabelChange: PropTypes.func.isRequired,
    labelsCategory: PropTypes.array,
    selectedLabels: PropTypes.array,
  };

  state = {
    screen: SCREEN.LABEL_LISTING,
    data: null,
  }

  switchScreen = (screen, data = null) =>
    this.setState(state => ({ ...state, screen, data }));
  
  render() {
    const { props: { handleLabelChange, selectedLabels, labelsCategory }, state: { screen, data } } = this;
    const itemContent = screen === SCREEN.LABEL_FORM
      ? (
        <ItemLabelsForm
          label={data} 
          switchScreen={this.switchScreen} 
          handleLabelChange={handleLabelChange}
          labelsCategory={labelsCategory}
        />
      )
      : (
        <ItemLabelsListing
          selectedLabels={selectedLabels}
          switchScreen={this.switchScreen} 
          handleLabelChange={handleLabelChange} 
        />
      );

    return (
      <div className="tab-pane label-tab-content" role="tabpanel">
        {itemContent}
      </div>
    );
  }
}
