import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { cardFilters } from 'Lib/config/filters/cards';
import { setCardFilters } from 'Src/newRedux/filters/actions';
import { stateMappings } from 'Src/newRedux/stateMappings';

import Icon from 'Components/shared/Icon';
import IconButton from 'Components/shared/buttons/IconButton';


class RightActionBarFilters extends Component {

  // static propTypes = {
  //   location: PropTypes.object.isRequired,
  //   isLabelPanelVisible: PropTypes.bool,
  //   toggleLabelPanel: PropTypes.func.isRequired,
  //   isTopicPanelVisible: PropTypes.bool,
  //   toggleTopicPanel: PropTypes.func.isRequired,
  //   filterByAll: PropTypes.func.isRequired,
  //   filterByFollowing: PropTypes.func.isRequired,
  //   filterByLiked: PropTypes.func.isRequired,
  //   filterByMine: PropTypes.func.isRequired,
  //   filterByPopular: PropTypes.func.isRequired,
  //   filterByStarred: PropTypes.func.isRequired,
  //   currentFilter: PropTypes.string.isRequired,
  //   currentModule: PropTypes.string,
  //   lastModule: PropTypes.string
  // };

  // static contextTypes = {
  //   addTourSteps: PropTypes.func.isRequired
  // };

  // componentDidMount() {
    /*
     * Add tour steps
     * Check if target is not null !important
     */
    // if (this.tourPoint !== null) {
    //   this.context.addTourSteps({
    //     title: 'Card Filters',
    //     text: 'Filters your Cards based on Stars, Likes, Labels and People',
    //     selector: '#tour-step-7',
    //     position: 'left'
    //   });
    // }
  // }


  render() {
    const { cardFilter, setCardFilters } = this.props;

    return (
      <div
        className="right-action-bar_segment"
        id="tour-step-7"
        ref={div => (this.tourPoint = div)}
      >
        { Object.values(cardFilters).map(( filter, index ) => (
          <div className={`right-action-bar_button-container link-tooltip-container ${ index == 3 && 'min-height-1' } ${ index > 3 && 'min-height-2' }`} key={ `card-filter-icon-${filter.key}` } >
            <div className="link-tooltip">{filter.name}</div>
            <IconButton
              additionalClasses='right-action-bar_button'
              additionalIconClasses={`${ filter.key == cardFilter ? 'large yellow' : 'large' }`}
              color='#CCCCCC'
              fontAwesome={ filter.iconType == 'fontAwesome' }
              icon={ filter.icon }
              onClick= { () => setCardFilters( filter.key )} />
          </div>

        ))}
      </div>
    );
  }
}

const mapState = (state, props) => ({
  cardFilter: stateMappings(state).filters.cardFilter,
});


const mapDispatch = {
  setCardFilters
};

export default connect(mapState, mapDispatch)(RightActionBarFilters);
