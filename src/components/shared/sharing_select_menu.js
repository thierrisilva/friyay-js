import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SharingSelectMenuInput from './sharing_select_menu/sharing_select_menu_input';
import IconButton from 'Components/shared/buttons/IconButton';
import APIRequest from '../../lib/ApiRequest';

class SharingSelectMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sharingItems: [],
      isLoadingSharingItems: true,
      selectedSharingItems: props.selectedSharingItems,
      shouldReloadUsers: false,
      query: null,
      showDropdown: false
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleEmailAdd = this.handleEmailAdd.bind(this);
    this.handleSharingItemSelect = this.handleSharingItemSelect.bind(this);
    this.handleSharingItemRemove = this.handleSharingItemRemove.bind(this);
    this.handleSharingItemsFilter = this.handleSharingItemsFilter.bind(this);
    this.reloadSharingItems = this.reloadSharingItems.bind(this);
    this.clearSearchQuery = this.clearSearchQuery.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextStateString = JSON.stringify(nextState);
    const currentStateString = JSON.stringify(this.state);
    if (nextStateString !== currentStateString) {
      return true;
    } else {
      return false;
    }
  }

  componentDidUpdate = prevProps => {
    const { selectedSharingItems, update } = this.props;
    if (
      selectedSharingItems.length !== prevProps.selectedSharingItems &&
      update
    ) {
      this.setState(state => ({ ...state, selectedSharingItems }));
    }
  };

  componentDidMount() {
    let _this = this;

    let sharableTypes = _this.props.sharableTypes;

    let $sharingItemsXHR = APIRequest.get({
      resource: 'sharing_items',
      data: {
        q: '*',
        resources: sharableTypes.join(','),
        page: {
          number: 1,
          size: 999
        }
      }
    });

    $sharingItemsXHR.done((response, status, xhr) => {
      let sharingItems = response.data;

      let hasDefaultSharingItems = _this.props.hasDefaultSharingItems;

      if (hasDefaultSharingItems) {
        sharingItems.unshift(SharingSelectMenu.userFollowing());
        sharingItems.unshift(SharingSelectMenu.userEveryone());
        sharingItems.unshift(SharingSelectMenu.userMe());
      }

      let selectedSharingItems = _this.state.selectedSharingItems;

      if (hasDefaultSharingItems && selectedSharingItems.length === 0) {
        if (this.props.hive == 1) {
          selectedSharingItems.push({
            id: [
              SharingSelectMenu.userEveryone().attributes.resource_type,
              SharingSelectMenu.userEveryone().id
            ].join('-'),
            name: SharingSelectMenu.userEveryone().attributes.name
          });
        } else if (this.props.hive == 3) {
          selectedSharingItems.push({
            id: [
              SharingSelectMenu.userMe().attributes.resource_type,
              SharingSelectMenu.userMe().id
            ].join('-'),
            name: SharingSelectMenu.userMe().attributes.name
          });
        }
      }

      // TODO: Teefan - refactor into common ID formatting method, to apply for after search too.
      // map sharing item id with resource_type for selector
      sharingItems.forEach((item, index) => {
        const { resource_type } = item.attributes;
        if (resource_type) {
          sharingItems[index]['id'] = `${resource_type}-${item.id}`;
        }
      });

      _this.setState({
        sharingItems: sharingItems,
        isLoadingSharingItems: false,
        selectedSharingItems: selectedSharingItems
      });
    });
  }

  getSharingItemIds = () =>
    this.state.selectedSharingItems.map(item => item.id);

  static userEveryone() {
    return {
      id: 'everyone',
      attributes: {
        name: 'All Team Workspace members',
        resource_type: 'users'
      }
    };
  }

  static userFollowing() {
    return {
      id: 'following',
      attributes: {
        name: 'People I Follow',
        resource_type: 'users'
      }
    };
  }

  static userMe() {
    return {
      id: 'private',
      attributes: {
        name: 'Just Me (Private)',
        resource_type: 'users'
      }
    };
  }

  handleEmailAdd(e) {
    let _this = this;
    e.preventDefault();

    let query = _this.state.query;
    let sharingItem = { id: 'emails-' + query, name: query };

    let selectedSharingItems = _this.state.selectedSharingItems;
    let shouldAdd = true;

    $(selectedSharingItems).each((index, selectedItem) => {
      if (selectedItem.id === sharingItem.id) {
        shouldAdd = false;
        return false;
      }
    });

    if (shouldAdd) {
      if (this.props.hive == 3 && sharingItem.name.includes('All')) {
        sharingItem.name = 'Public';
      }
      selectedSharingItems.push(sharingItem);
    }

    _this.setState({
      selectedSharingItems: selectedSharingItems
    });
  }

  handleSharingItemSelect(item) {
    const id = item.id;
    const name = item.attributes.name;
    const sharingItem = { id, name };

    if (id && name) {
      let { selectedSharingItems } = this.state;

      let shouldAdd = !selectedSharingItems.some(
        shareItem => shareItem.id.toString() === id.toString()
      );

      if (id !== 'users-private') {
        selectedSharingItems = selectedSharingItems.filter(
          shareItem => shareItem.id !== 'users-private'
        );
      }

      if (id === 'users-private' && shouldAdd) {
        selectedSharingItems = [];
      }

      if (shouldAdd) {
        if (this.props.hive == 3 && sharingItem.name.includes('All')) {
          sharingItem.name = 'Public';
        }
        selectedSharingItems.push(sharingItem);
      }
      this.setState({
        selectedSharingItems
      });
      this.props.onUpdateComplete(selectedSharingItems);
      this.forceUpdate();
    }
  }

  handleSharingItemRemove(sharingItemID) {
    let { sharingFor, sharingObject } = this.props;

    this.setState(
      {
        selectedSharingItems: this.state.selectedSharingItems.filter(
          item => item.id.toString() !== sharingItemID.toString()
        )
      },
      () => {
        this.props.onUpdateComplete(this.state.selectedSharingItems);
      }
    );

    let topicID;
    if (sharingObject && sharingObject.type === 'topics') {
      topicID = sharingObject.id;
    }

    // if we're removing admin roles
    if (sharingFor == 'admin') {
      const userID = sharingItemID.split('-').pop();

      APIRequest.post({
        resource: 'roles/remove',
        data: {
          data: {
            role: sharingFor,
            user_id: userID,
            topic_id: topicID
          }
        }
      });
    }
  }

  handleSharingItemsFilter(query) {
    let _this = this;

    _this.setState({
      query: query,
      isLoadingSharingItems: true,
      shouldReloadUsers: true
    });

    _this.reloadSharingItems(query);
  }

  reloadSharingItems(query) {
    let _this = this;

    let sharableTypes = _this.props.sharableTypes;

    _this.setState({
      sharingItems: [],
      isLoadingSharingItems: true
    });

    let $sharingItemsXHR = APIRequest.get({
      resource: 'sharing_items',
      data: {
        q: query ? query : '*',
        resources: sharableTypes.join(','),
        page: {
          number: 1,
          size: 999
        }
      }
    });

    $sharingItemsXHR.done((response, status, xhr) => {
      let sharingItems = response.data;
      let hasDefaultSharingItems = _this.props.hasDefaultSharingItems;

      if (hasDefaultSharingItems && !query) {
        sharingItems.unshift(SharingSelectMenu.userFollowing());
        sharingItems.unshift(SharingSelectMenu.userEveryone());
        sharingItems.unshift(SharingSelectMenu.userMe());
      }

      // TODO: Teefan - refactor into common ID formatting method, to apply for after search too.
      // map sharing item id with resource_type for selector
      sharingItems.forEach((item, index) => {
        const { resource_type } = item.attributes;
        if (resource_type) {
          sharingItems[index]['id'] = `${resource_type}-${item.id}`;
        }
      });

      _this.setState({
        sharingItems: sharingItems,
        isLoadingSharingItems: false,
        shouldReloadUsers: false
      });
    });
  }

  clearSearchQuery(e) {
    e.preventDefault();

    this.setState({
      query: null
    });

    this.reloadSharingItems(null);
  }

  render() {
    let _this = this;

    let {
      sharingFor,
      selectTitle,
      isSubtopic,
      uniqueId,
      viewAsDropdown
    } = this.props;
    let {
      sharingItems,
      selectedSharingItems,
      isLoadingSharingItems,
      query,
      showDropdown
    } = this.state;

    let sharingOverrideRows = [];
    let sharingUserRows = [];
    let sharingGroupRows = [];

    sharingItems.map(item => {
      const overrideResourceIDs = [
        'users-everyone',
        'users-following',
        'users-private'
      ];
      if (overrideResourceIDs.includes(item.id)) {
        sharingOverrideRows.push(item);
      }

      if (item.attributes.resource_type === 'users') {
        sharingUserRows.push(item);
      }

      if (item.attributes.resource_type === 'groups') {
        sharingGroupRows.push(item);
      }
    });

    let sortedSharingItems = [].concat(
      sharingOverrideRows,
      sharingGroupRows,
      sharingUserRows
    );
    var uniqueSharingItems = [];
    sortedSharingItems.forEach((sharing_item, index) => {
      const uniqueSharingItemsIDs = uniqueSharingItems.map(value => value.id);
      if (!uniqueSharingItemsIDs.includes(sharing_item.id)) {
        uniqueSharingItems.push(sharing_item);
      }
    });

    let sharingItemRows = [];
    $.each(uniqueSharingItems, (index, sharingItem) => {
      let itemName = sharingItem.attributes.name;
      let itemType = sharingItem.attributes.resource_type;

      let isSelected = false;
      $(selectedSharingItems).each((index, selectedItem) => {
        if (
          selectedItem.id &&
          sharingItem.id.toString() === selectedItem.id.toString()
        ) {
          isSelected = true;
          return false;
        }
      });

      let idImage;
      switch (itemType) {
        case 'users':
          idImage = <i className="fa fa-user fa-lg" />;
          break;
        case 'groups':
          idImage = <i className="fa fa-users fa-lg" />;
          break;
        default:
          idImage = <i className="fa fa-building fa-lg" />;
      }

      let sharingItemRowClass = classNames('list-group-item', {
        selected: isSelected
      });
      let sharingItemRow = (
        <li
          className={sharingItemRowClass}
          key={
            'sharing-item-select-' +
            itemType +
            '-' +
            sharingItem.id +
            '-index' +
            index
          }
          id={'sharing-item-select-' + itemType + '-' + sharingItem.id}
          defaultValue={isSelected}
        >
          <div
            className="icon-hex-container"
            onClick={e => {
              e.preventDefault();
              _this.handleSharingItemSelect(sharingItem);
            }}
          >
            {idImage}
          </div>
          <a
            href="javascript:void(0)"
            className="link-menu-topic"
            onClick={e => {
              e.preventDefault();
              _this.handleSharingItemSelect(sharingItem);
            }}
          >
            {itemName}
          </a>
          <div className="clearfix" />
        </li>
      );
      sharingItemRows.push(sharingItemRow);
    });

    let inviteEmailContent;
    if (isLoadingSharingItems === false && window.EMAIL_REGEX.test(query)) {
      inviteEmailContent = (
        <div className="form-group query-info">
          {sharingItemRows.length === 0 && (
            <span>No user found for this email. </span>
          )}
          <a
            href="javascript:void(0)"
            className="btn btn-default btn-sm"
            onClick={_this.handleEmailAdd}
          >
            Share with <strong>{query}</strong>
          </a>
        </div>
      );
    }

    let queryContent;
    if (query) {
      queryContent = (
        <div className="form-group query-info">
          <em>Searching for:</em> <strong>{query}</strong>
          <a
            href="javascript:void(0)"
            className="query-clear-link"
            onClick={_this.clearSearchQuery}
          >
            {' '}
            clear search
          </a>
        </div>
      );
    }

    let sharingItemsSelectMenuContent;

    if (isLoadingSharingItems) {
      sharingItemsSelectMenuContent = (
        <p className="text-center">
          <img src="/images/ajax-loader.gif" />
        </p>
      );
    }

    if (isLoadingSharingItems === false) {
      sharingItemsSelectMenuContent = (
        <div className="topics-select-menu">
          <ul className="list-group topics-select-menu-content">
            {sharingItemRows}
          </ul>
        </div>
      );
    }

    let selectTitleContent;

    if (selectTitle) {
      selectTitleContent = <h4>{selectTitle}</h4>;
    } else {
      let sharingObjectName = sharingFor;
      if (sharingFor == 'topic' || isSubtopic) {
        sharingObjectName = 'Cards in this yay';
      }
      if (sharingFor == 'tip') {
        sharingObjectName = 'Card';
      }
      selectTitleContent = <h4>Who can see your {sharingObjectName}?</h4>;
    }

    return (
      <div className="sharing-select-menu">
        {!viewAsDropdown && selectTitleContent}

        <SharingSelectMenuInput
          name={sharingFor + '[sharing_item_ids]'}
          id={
            uniqueId
              ? `${sharingFor}${uniqueId}_sharing_item_ids`
              : sharingFor + '_sharing_item_ids'
          }
          selectedSharingItems={selectedSharingItems}
          handleSharingItemRemove={this.handleSharingItemRemove}
          handleSharingItemsFilter={this.handleSharingItemsFilter}
          viewAsDropdown
        />
        {viewAsDropdown && (
          <IconButton
            icon="caret-down"
            fontAwesome
            additionalClasses="dark-grey-icon-button"
            onClick={() => this.setState({ showDropdown: !showDropdown })}
          />
        )}
        {!viewAsDropdown && queryContent}
        {!viewAsDropdown && inviteEmailContent}

        {viewAsDropdown
          ? showDropdown && (
              <div className="dropdown-content">
                {sharingItemsSelectMenuContent}
              </div>
            )
          : sharingItemsSelectMenuContent}
      </div>
    );
  }
}

SharingSelectMenu.propTypes = {
  sharingFor: PropTypes.string,
  sharableTypes: PropTypes.array,
  selectTitle: PropTypes.string,
  isSubtopic: PropTypes.bool,
  sharingObject: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string // Personal domain
  ]),
  hasDefaultSharingItems: PropTypes.bool,
  selectedSharingItems: PropTypes.array,
  update: PropTypes.bool,
  onUpdateComplete: PropTypes.func,
  uniqueId: PropTypes.string,
  viewAsDropdown: PropTypes.bool
};

SharingSelectMenu.defaultProps = {
  sharingFor: 'tip',
  sharableTypes: ['User', 'Group'],
  sharingObject: null,
  hasDefaultSharingItems: true,
  selectedSharingItems: [],
  update: false,
  viewAsDropdown: false,
  onUpdateComplete: () => null
};

export default SharingSelectMenu;
