import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { dragItemTypes, GenericDropZone } from 'Components/shared/drag_and_drop/_index';
import { createTopicAndCardsForGoogleFolder } from 'Src/newRedux/integrationFiles/google-drive/thunks';
import { createTopicAndCardsForDropboxFolder } from 'Src/newRedux/integrationFiles/dropbox/thunks';

class TopicItemNew extends Component {
  static propTypes = {
    handleAddTopicClick: func.isRequired
  };

  state = {
    isAttachmentHoveringOnCard: false,
  }
  // static contextTypes = {
  //   addTourSteps: PropTypes.func.isRequired
  // };

  tourPoint = null;

  // componentDidMount() {
  //   /*
  //    * Add tour steps
  //    * Check if target is not null !important
  //    */
  //   if (this.tourPoint !== null) {
  //     this.context.addTourSteps({
  //       title: 'Add SubTopic',
  //       text: 'Create SubTopics to further keep your Topics organized. There are unlimited levels of SubTopics.',
  //       selector: '#tour-step-3',
  //       position: 'bottom'
  //     });
  //   }
  // }


  toggleAttachmentHoveringOnCard = (status) => {
    this.setState(prevState => ({
      ...prevState,
      isAttachmentHoveringOnCard: status,
    }));
  }

  AddTopicFromFolder = (itemProps) => {
    const { createTopicAndCardsForGoogleFolder, createTopicAndCardsForDropboxFolder } = this.props; // eslint-disable-line
    const provider = itemProps.draggedItemProps.item.provider;
    const methodMaps = {
      google: createTopicAndCardsForGoogleFolder,
      dropbox: createTopicAndCardsForDropboxFolder,
    };
    itemProps.providerData = this.props[`${provider}Data`];
    methodMaps[provider](itemProps);
  }

  render() {
    const { props: { handleAddTopicClick }, state : { isAttachmentHoveringOnCard } } = this;
    return (
      <div className="new-topic" id="tour-step-3" ref={div => (this.tourPoint = div)}>
        <a onClick={handleAddTopicClick} />
          <h5 style={{display: 'table', width: '100%', marginTop: 0, height: '100%'}}>
            <div onClick={handleAddTopicClick} style={{width: '100%', display: 'table-cell', verticalAlign: 'middle',
              cursor: 'pointer'}}>
              <i className="glyphicon glyphicon-plus" />
            </div>
          </h5>
      </div>
    );
  }
}

const mapState = (state) => {
  const sm = stateMappings(state);
  return {
    googleData: sm.integrationFiles.google,
    dropboxData: sm.integrationFiles.dropbox,
    boxData: sm.integrationFiles.box,
  };
};

const mapDispatch = {
  createTopicAndCardsForGoogleFolder,
  createTopicAndCardsForDropboxFolder,
};

export default connect(mapState, mapDispatch)(TopicItemNew);
