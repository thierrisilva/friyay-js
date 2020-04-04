import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import RightActionBarFilterStore from '../../../stores/right_action_bar/right_action_bar_filter_store';
import Ability from 'Lib/ability';
import { connect } from 'react-redux';
import { getTips } from 'Actions/tips';
import { getLabels } from 'Actions/labels';
import { removeLabelFilter, addLabelFilter } from 'Actions/labelsFilter';
import classnames from 'classnames';
import { merge } from 'ramda';
import isEqual from 'lodash/isEqual';
import TopicPageActions from 'Actions/topic_page_actions';
import { CARD_FILTER_ENUM as FILTER } from 'Enums';
import tiphive from 'Lib/tiphive';
import { filterByAllTips, filterByFollowingTips } from 'Actions/rightBarFilter';
import ActiveFiltersLabels from 'Components/shared/labels/elements/assemblies/ActiveFiltersLabels';

const FilterChip = ({ currentFilter, handleRemove, isDefault }) => (
  <div className="filter-chip flex-r-center-spacebetween">
    <span className="mr5">{RightNavFilterOptions[currentFilter]}</span>
    {!isDefault && (
      <a className="flex-r-center-spacebetween" onClick={handleRemove}>
        <i className="fa fa-lg fa-close" />
      </a>
    )}
  </div>
);

FilterChip.propTypes = {
  currentFilter: PropTypes.string.isRequired,
  handleRemove: PropTypes.func.isRequired,
  isDefault: PropTypes.bool
};

const RightNavFilterOptions = {
  [FILTER.ALL]: 'All Cards',
  [FILTER.FOLLOWING]: 'Cards from yays I Follow',
  [FILTER.LIKED]: 'Cards I Liked',
  [FILTER.STARRED]: 'Cards I Starred',
  [FILTER.MINE]: 'My Cards',
  [FILTER.POPULAR]: 'Popular Cards'
};

class ItemsTopBar extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    handleSwitchTipsView: PropTypes.func,
    handleNewTipClick: PropTypes.func,
    topic: PropTypes.object,
    group: PropTypes.object,
    userId: PropTypes.string,
    hideNewTipButton: PropTypes.bool,
    name: PropTypes.any,
    handleRemoveFilterChips: PropTypes.func,
    defaultFilter: PropTypes.any,
    parentView: PropTypes.string,

    getAllTips: PropTypes.func.isRequired,
    getAllLabels: PropTypes.func.isRequired,
    removeLabel: PropTypes.func.isRequired,
    areLabelsLoading: PropTypes.bool,
    labels: PropTypes.array,
    selectedLabels: PropTypes.array,
    addLabel: PropTypes.func.isRequired,
    currentFilter: PropTypes.string.isRequired,
    filterByAll: PropTypes.func.isRequired,
    filterByFollowing: PropTypes.func.isRequired,
    currentUserId: PropTypes.string.isRequired
  };

  static defaultProps = {
    topic: null,
    userId: null,
    labels: [],
    group: null
  };

  // static contextTypes = {
  //   addTourSteps: PropTypes.func.isRequired
  // };
  //
  // tourPoint = null;

  //
  // componentDidMount() {
  //   RightActionBarFilterStore.addEventListener(
  //     window.TIP_FILTER_CHANGE,
  //     this.onRightBarFilterChange
  //   );
  //   /*
  //    * Add tour steps
  //    * Check if target is not null !important
  //    */
  //   if (this.tourPoint !== null) {
  //     this.context.addTourSteps({
  //       title: 'Add Card',
  //       text:
  //         'Add Cards to share any type of information: text, files, images, video, links, etc',
  //       selector: '#tour-step-4',
  //       position: 'top'
  //     });
  //   }
  // }

  componentWillUnmount() {
    RightActionBarFilterStore.removeEventListener(
      window.TIP_FILTER_CHANGE,
      this.onRightBarFilterChange
    );
  }

  // TODO: pass into individual pages and remove
  componentWillReceiveProps = ({
    selectedLabels: newLabels,
    areTipsLoading
  }) => {
    const {
      props: { selectedLabels: oldLabels },
      state: { filterType }
    } = this;
    if (!isEqual(oldLabels.join(','), newLabels.join(',')) && !areTipsLoading) {
      this.applyFilter(filterType, newLabels);
    }
  };

  onRightBarFilterChange = filterType => {
    const {
      state: { filterMode }
    } = this;

    if (filterType === 'label_tag') {
      this.setState({
        filterMode: filterMode === 'labels' ? '' : 'labels'
      });
    }
  };

  handleLabelFilterRemove = label => this.props.removeLabel(label.id);

  applyFilter = (filterType = '', selectedLabels) => {
    const {
      props: { router, getAllTips, topic, group, userId, parentView }
    } = this;

    this.setState({ filterType });

    const labels = selectedLabels.join(',');
    const groupId = (group && group.id) || null;
    const topicId = (topic && topic.id) || null;

    let newRoute = null;
    const getDefaultOptions = merge({
      group_id: groupId,
      page: {
        number: 1,
        size: 25
      },
      filter: {
        ...(filterType === 'following'
          ? { topics: 'following' }
          : { type: filterType }),
        labels
      }
    });

    let tipsOptions = null;

    if (group !== null) {
      const path =
        topic !== null
          ? `/groups/${group.id}/yays/${topic.attributes.slug}`
          : `/groups/${group.id}`;
      const [groupNumber] = groupId.split('-');

      newRoute = `${path}?filter_type=${filterType}&filter_labels=${labels}`;
      tipsOptions = getDefaultOptions({
        topic_id: topicId,
        filter: { within_group: groupNumber }
      });
    } else if (userId) {
      newRoute = `/users/${userId}?filter_type=${filterType}&filter_labels=${labels}`;
      tipsOptions = getDefaultOptions({ user_id: userId });
    } else if (topic !== null) {
      newRoute = `/yays/${
        topic.attributes.slug
      }?filter_type=${filterType}&filter_labels=${labels}`;

      if (parentView === 'task') {
        TopicPageActions.onTaskLabelFilterClose();
        tipsOptions = null;
      } else {
        tipsOptions = getDefaultOptions({ topic_id: topicId });
      }
    } else {
      // newRoute = `/?filter_type=${filterType}&filter_labels=${labels}`;
      // tipsOptions = getDefaultOptions({});
    }

    newRoute !== null && router.push(newRoute);
    tipsOptions !== null && getAllTips(tipsOptions);
  };

  handleRemoveFilterChips = () => {
    const {
      props: { topic, filterByAll, filterByFollowing }
    } = this;
    if (topic !== null || tiphive.isSupportDomain()) {
      filterByAll();
    } else {
      filterByFollowing();
    }

    this.applyFilter('', this.props.selectedLabels);
  };

  render() {
    const {
      props: {
        topic,
        hideNewTipButton,
        handleNewTipClick,
        userId,
        currentFilter,
        currentUserId
      }
    } = this;

    let newTipButton = null;
    let canCreate = false;

    if (topic !== null) {
      canCreate = Ability.can('create', 'tips', topic) && !hideNewTipButton;
    } else if (userId !== null) {
      canCreate = userId === currentUserId;
    } else if (topic === null && userId === null) {
      canCreate = true;
    }

    if (canCreate) {
      newTipButton = (
        <a
          className="btn btn-noback"
          onClick={handleNewTipClick}
          id="tour-step-4"
          ref={anchor => (this.tourPoint = anchor)}
        >
          + Add New Card
        </a>
      );
    }

    let isChipDefault = false;

    if (topic !== null || userId !== null || tiphive.isSupportDomain()) {
      isChipDefault = currentFilter === FILTER.ALL;
    } else {
      isChipDefault = currentFilter === FILTER.FOLLOWING;
    }

    return (
      <div
        className={classnames({ 'items-top-bar': true, pt0: topic === null })}
      >
        <div className="flex-r-center-spacebetween">
          {newTipButton}
          <ActiveFiltersLabels
            removeFilter={isChipDefault ? null : this.handleRemoveFilterChips}
          />
        </div>
      </div>
    );
  }
}

const mapState = ({
  tips: { collection, isLoading: areTipsLoading },
  labels: { collection: labels, isLoading: areLabelsLoading },
  labelsFilter: selectedLabels,
  rightBarFilter: { currentFilter },
  appUser: { id },
  _newReduxTree: {
    routing: { routerHistory }
  }
}) => ({
  tips: collection.filter(
    ({ attributes: { is_disabled } }) => is_disabled === false
  ),
  labels,
  areTipsLoading,
  areLabelsLoading,
  selectedLabels,
  currentFilter,
  currentUserId: id,
  router: routerHistory
});

const mapDispatch = {
  getAllTips: getTips,
  getAllLabels: getLabels,
  removeLabel: removeLabelFilter,
  addLabel: addLabelFilter,
  filterByAll: filterByAllTips,
  filterByFollowing: filterByFollowingTips
};

export default connect(
  mapState,
  mapDispatch
)(ItemsTopBar);
