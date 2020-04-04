import React, { Component, Fragment } from 'react';
import IconButton from 'Components/shared/buttons/IconButton';
import Icon from 'Components/shared/Icon';
import DomainList from './domainList';
import TeamList from './teamList';
import MemberList from './memberList';
import YayList from './yayList';
import CardList from './cardList';
import APIRequest from 'Lib/ApiRequest';
import { dragItemTypes } from 'Src/components/shared/drag_and_drop/_index';

class WorkspaceWrapper extends Component {
  state = {
    showMembers: false,
    selectedDomain: undefined,
    selectedGroup: undefined,
    selectedYay: undefined,
    topicOrder: {}
  };

  getReleventOrder(parentTopic) {
    const { topicOrder, selectedDomain } = this.state;
    if (!selectedDomain) return;
    const topicId = parentTopic ? parentTopic.id : 0;
    return (topicOrder[selectedDomain.id] || []).find(
      t => t.attributes.is_default && t.attributes.topic_id == topicId
    );
  }

  loadTopicOrder(domain) {
    let resource = 'topic_orders';
    APIRequest.get({
      resource,
      domain
    })
      .done(response => {
        this.setState({
          topicOrder: {
            ...this.state.topicOrder,
            [domain.id]: response.data
          }
        });
      })
      .fail(function(xhr, status) {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load orders');
        }
      });
  }

  onSelectDomain = selectedDomain => {
    if (!this.state.topicOrder[selectedDomain.id]) {
      this.loadTopicOrder(selectedDomain);
    }
    this.setState({
      selectedDomain,
      showMembers: true,
      selectedGroup: undefined,
      selectedYay: undefined
    });
  };

  onSelectGroup = selectedGroup => {
    if (selectedGroup == this.state.selectedGroup) {
      this.setState({ selectedGroup: undefined });
    } else {
      this.setState({ selectedGroup });
    }
  };

  onSelectYay = selectedYay => {
    this.setState({ selectedYay });
  };

  toggleMembers = () => {
    this.setState({ showMembers: !this.state.showMembers });
  };

  handleReorder = ({ dropZoneProps, droppedItemProps, itemOrder }) => {
    const self = this;
    const { selectedDomain: domain, topicOrder } = self.state;
    const { parentCard, type } = dropZoneProps;
    const currentOrder = self.getReleventOrder(parentCard);
    if (type === dragItemTypes.CARD) {
      currentOrder.attributes.tip_order = itemOrder.map(i => i.id);
    } else if (type === dragItemTypes.TOPIC) {
      currentOrder.attributes.subtopic_order = itemOrder.map(i => i.id);
    }

    APIRequest.patch({
      resource: `topic_orders/${currentOrder.id}`,
      domain,
      data: { data: currentOrder }
    })
      .done(response => {
        self.setState({
          topicOrder: {
            ...topicOrder,
            [domain.id]: topicOrder[domain.id]
              .filter(t => t.id != response.data.id)
              .concat(response.data)
          }
        });
      })
      .fail(function(xhr, status) {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load orders');
        }
      });
  };

  render() {
    const {
      showMembers,
      selectedDomain,
      selectedGroup,
      selectedYay
    } = this.state;
    return (
      <Fragment>
        <div className={`workspace-section ${showMembers && 'show-member'}`}>
          <div className="ws-header">
            <span>Workspaces &nbsp;</span>
            <span>
              <IconButton
                additionalClasses="dark-grey-icon-button"
                icon="people_outline"
                onClick={this.toggleMembers}
                tooltip="Teams"
              />
              {showMembers && 'Teams'}
            </span>
            <span>
              <IconButton
                additionalClasses="dark-grey-icon-button"
                icon="person_outline"
                onClick={this.toggleMembers}
                tooltip="Member"
              />
              {showMembers && 'Members'}
            </span>
          </div>
          <div className="ws-body">
            <div className="ws-body-child">
              <DomainList
                onSelectDomain={this.onSelectDomain}
                selectedDomain={selectedDomain}
              />
            </div>
            {showMembers && (
              <Fragment>
                <div className="ws-body-child">
                  <TeamList
                    domain={selectedDomain}
                    selectedGroup={selectedGroup}
                    onSelectGroup={this.onSelectGroup}
                  />
                </div>
                <div className="ws-body-child">
                  <MemberList
                    domain={selectedDomain}
                    selectedGroup={selectedGroup}
                  />
                </div>
              </Fragment>
            )}
          </div>
        </div>
        <div className="card-section">
          <div className="ws-header">
            <Icon
              additionalClasses="rectangle-icon dark-grey-icon-button"
              icon="square"
              fontAwesome
            />
            Cards
          </div>
          <div className="ws-body">
            <div className="ws-body-child">
              <YayList
                domain={selectedDomain}
                selectedYay={selectedYay}
                onSelectYay={this.onSelectYay}
                topicOrder={this.getReleventOrder()}
                handleReorder={this.handleReorder}
              />
            </div>
            <div className="ws-body-child">
              {selectedYay && (
                <Fragment>
                  <YayList
                    domain={selectedDomain}
                    parentCard={selectedYay}
                    topicOrder={this.getReleventOrder(selectedYay)}
                    handleReorder={this.handleReorder}
                  />
                  <CardList
                    domain={selectedDomain}
                    parentCard={selectedYay}
                    topicOrder={this.getReleventOrder(selectedYay)}
                    handleReorder={this.handleReorder}
                  />
                </Fragment>
              )}
            </div>
            <div
              className={`ws-body-child ${showMembers ? 'flex-1' : 'flex-5'}`}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default WorkspaceWrapper;
