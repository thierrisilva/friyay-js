import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GroupItemLabels from './group_item_labels';
import Loader from '../../../../shared/Loader';
import { SCREEN } from 'Enums';
import { stateMappings } from 'Src/newRedux/stateMappings';

class ItemLabelsListing extends Component {
  static propTypes = {
    switchScreen: PropTypes.func,
    item: PropTypes.object.isRequired,
    labels: PropTypes.array,
    isLoading: PropTypes.bool,
    handleCloseClick: PropTypes.func
  };

  static defaultProps = {
    labels: [],
    isLoading: false
  };

  handleAddLabelClick = e => {
    e.preventDefault();
    this.props.switchScreen(SCREEN.LABEL_FORM);
  };

  handleMenuCloseClick = e => {
    e.preventDefault();
    this.props.switchScreen(SCREEN.ITEM);
  };

  render() {
    const { props: { labels, isLoading, item, switchScreen, openLabelForm } } = this;

    return (
      <div
        className="grid-card-menu full-height"
      >
        <div
          className="list-group list-options"
          style={{ height: 355, margin: 0 }}
        >
          <div className="list-group-item grid-item-menu-header flex-r-center-spacebetween">
            Labels
            <button
              style={{ marginTop: -5 }}
              type="button"
              className="close-labels-listing"
              aria-label="Close"
              onClick={this.handleMenuCloseClick}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          {isLoading ? (
            <div className="flex-r-center-center" style={{ height: 320 }}>
              <Loader />
            </div>
          ) :
          (<GroupItemLabels
            item={item}
            labels={labels}
            switchScreen={switchScreen}
          />)
        }
        </div>
        <div
          className="item-labels-footer"
        >
          <a className="light-gray" onClick={this.handleAddLabelClick}>+ Add label</a>
        </div>
      </div>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);

  return {
    labels: Object.values(sm.labels)
  }
};

export default connect(mapState)(ItemLabelsListing);
