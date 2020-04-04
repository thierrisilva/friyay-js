import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { addGoogleFileToCard } from 'Src/newRedux/integrationFiles/google-drive/thunks';
import { addDropboxFileToCard } from 'Src/newRedux/integrationFiles/dropbox/thunks';
import { addBoxFileToCard } from 'Src/newRedux/integrationFiles/box/thunks';
//TODO Make this component HOC

class GridCardAttachmentDropOptions extends Component {

  static propTypes = {
    card: PropTypes.shape({}),
    addToNewFile: PropTypes.func,
    view: PropTypes.string,
    addGoogleFileToCard: PropTypes.func,
    addDropboxFileToCard: PropTypes.func,
    addBoxFileToCard: PropTypes.func,
  }

  state = {
    hoverHighlightClass: 'activate-highlight',
  }

  checkCardIsSaved = (componentProps) => {
    const { addGoogleFileToCard, addDropboxFileToCard, addBoxFileToCard, card, addToNewFile } = this.props;
    const provider = componentProps.draggedItemProps.item.provider;
    const methodsMap = {
      'google': addGoogleFileToCard,
      'dropbox': addDropboxFileToCard,
      'box': addBoxFileToCard
    };
    if (card) {
      methodsMap[provider](componentProps);
    } else {
      addToNewFile(componentProps);
    }
  }

  toggleHoverClass = (type) => this.setState(prevState =>
    ({ ...prevState, hoverHighlightClass: type ? `activate-highlight-${type}` : ''})
  );

  render() {
    const { props: { card, view }, state: { hoverHighlightClass } } = this;

    return(
      <div className="full-width grid-attachment-options">

        {view && view.includes('new') && <p>+ Add Card</p>}

        <GenericDropZone
          dropClassName={`attachment-option${view || ''} ${hoverHighlightClass.includes('link') && hoverHighlightClass}`}
          card={card}
          method="link"
          onDragEnter={() => { this.toggleHoverClass('link'); }}
          onDragLeave={() => { this.toggleHoverClass(false); }}
          onDrop={itemObject => this.checkCardIsSaved(itemObject)}
          itemType={dragItemTypes.FILE}
        >
          Link
        </GenericDropZone>

        <GenericDropZone
          dropClassName={`attachment-option${view || ''} ${hoverHighlightClass.includes('upload') && hoverHighlightClass}`}
          card={card}
          method="upload"
          onDragEnter={() => { this.toggleHoverClass('upload'); }}
          onDragLeave={() => { this.toggleHoverClass(false); }}
          onDrop={itemObject => this.checkCardIsSaved(itemObject)}
          itemType={dragItemTypes.FILE}
        >
          Upload
        </GenericDropZone>

      </div>
    );
  }
}

const mapDispatch = {
  addGoogleFileToCard,
  addDropboxFileToCard,
  addBoxFileToCard,
};

export default connect(null, mapDispatch)(GridCardAttachmentDropOptions);
