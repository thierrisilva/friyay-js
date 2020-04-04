import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bool, func, object, string } from 'prop-types';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import FormInput from 'Components/shared/forms/FormInput';
import {
  createCard,
  mapRelationships
} from 'Src/newRedux/database/cards/thunks';
import GridCardAttachmentDropOptions from 'Components/views/card_views/Grid/GridCardAttachmentDropOptions';
import DocumentCardAttachmentDropOptions from 'Components/views/card_views/Grid/GridCardAttachmentDropOptions';
import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { addGoogleFileToCard } from 'Src/newRedux/integrationFiles/google-drive/thunks';
import { addDropboxFileToCard } from 'Src/newRedux/integrationFiles/dropbox/thunks';
import { addBoxFileToCard } from 'Src/newRedux/integrationFiles/box/thunks';
import { setEditCardModalOpen } from 'Src/newRedux/interface/modals/actions';
import { setShowAddCardBottomOverlay } from 'Src/newRedux/interface/modals/actions';

class AddCardCard extends PureComponent {
  static propTypes = {
    createCard: func.isRequired,
    inInputMode: bool,
    newCardAttributes: object,
    newCardRelationships: object,
    topic: object,
    addFileToCard: func,
    view: string,
    setEditCardModalOpen: func
  };

  constructor(props) {
    super(props);
    this.state = {
      cardTitle: '',
      inInputMode: props.inInputMode,
      isSaving: false,
      isAttachmentHoveringOnCard: false,
      attachmentLink: null
    };
  }

  componentDidMount() {
    if (this.props.inInputMode) {
      window.addEventListener('keydown', this.handleKeyDown, true);
      this.scrollToShow();
    }
  }

  componentDidUpdate(prevProps) {
    const { inInputMode } = this.props;
    if (inInputMode !== prevProps.inInputMode) {
      this.setState({ inInputMode });
      inInputMode === true && this.scrollToShow();
    }
  }

  addFileToCard = attachmentLink => {
    const {
      addGoogleFileToCard,
      addDropboxFileToCard,
      addBoxFileToCard
    } = this.props;
    const methodMap = {
      google: addGoogleFileToCard,
      dropbox: addDropboxFileToCard,
      box: addBoxFileToCard
    };
    methodMap[attachmentLink.draggedItemProps.item.provider](attachmentLink);
  };

  handleCreateCard = async () => {
    const {
      state: { cardTitle, attachmentLink },
      props: {
        newCardAttributes,
        createCard,
        topic,
        topicId,
        newCardRelationships
      }
    } = this;
    const relatedTopicId = topicId || topic.id;
    this.setState({ isSaving: true });
    const attributes = { ...newCardAttributes, title: cardTitle };
    const relationships = {
      ...newCardRelationships,
      topics: { data: [relatedTopicId] }
    };
    let {
      data: { data: newCard, included }
    } = await createCard({ attributes, relationships });
    newCard = mapRelationships(included)(newCard);
    if (attachmentLink) {
      attachmentLink.dropZoneProps.card = { ...newCard };
      this.addFileToCard(attachmentLink);
    }
    this.setState({ cardTitle: '', isSaving: false, attachmentLink: null });
    this.handleToggleInputMode();
    this.props.afterCardCreated && this.props.afterCardCreated(newCard.id);
    this.props.onDismiss && this.props.onDismiss();
    this.props.setShowAddCardBottomOverlay(false);
  };

  handleSetCardTitle = cardTitle => {
    this.setState({ cardTitle });
  };

  scrollToShow = () => {
    const elem = $('.add-card-card_section')[0];
    if (elem) {
      elem.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  };

  handleToggleInputMode = () => {
    this.state.inInputMode
      ? window.removeEventListener('keydown', this.handleKeyDown, true)
      : window.addEventListener('keydown', this.handleKeyDown, true);
    this.setState(state => ({ inInputMode: !state.inInputMode }));
    this.state.inInputMode && this.scrollToShow();
  };

  handleKeyDown = e => {
    if (e.key == 'Escape' || e.keyCode == 27) {
      this.handleToggleInputMode();
      this.props.onDismiss && this.props.onDismiss();
      this.props.setShowAddCardBottomOverlay(false);
    }
  };

  toggleAttachmentHoveringOnCard = status => {
    this.setState(prevState => ({
      ...prevState,
      isAttachmentHoveringOnCard: status
    }));
  };

  addToNewFile = attachment => {
    this.setState(prevState => ({
      ...prevState,
      attachmentLink: attachment
    }));
    this.props.setShowAddCardBottomOverlay(true);
    this.handleToggleInputMode();
  };

  handleEditButtonClick = () => {
    this.props.setEditCardModalOpen({
      cardId: null,
      defaultAttributes: {
        title: this.state.cardTitle,
        ...this.props.newCardAttributes
      },
      defaultRelationships: this.props.newCardRelationships
    });

    this.setState({ inInputMode: false });
  };

  render() {
    const {
      isFileDragged,
      cardClassName,
      cardStyle,
      containerClassName,
      containerStyle,
      topic,
      topicId,
      view = '',
      bottomOverlay,
      addCardUI,
      topMenu
    } = this.props;

    const {
      cardTitle,
      inInputMode,
      isSaving,
      isAttachmentHoveringOnCard
    } = this.state;

    if (!topic && !topicId) {
      return null;
    }

    return (
      <div
        className={cx('add-card-card-container', containerClassName)}
        style={containerStyle}
      >
        <GenericDropZone
          dropClassName="add-card-card_section"
          onDragEnter={() => this.toggleAttachmentHoveringOnCard(true)}
          onDragLeave={() => this.toggleAttachmentHoveringOnCard(false)}
          dropsDisabled
          itemType={dragItemTypes.FILE}
        >
          <div className={cardClassName} style={cardStyle}>
            <div className="add-card-card_content full-height">
              {isSaving && <LoadingIndicator />}

              {!isSaving && inInputMode && (
                <div className="add-card-input-wrapper">
                  <FormInput
                    autoFocus
                    defaultValue={cardTitle}
                    onChange={this.handleSetCardTitle}
                    onSubmit={this.handleCreateCard}
                    placeholder="Card title"
                  />
                  {topMenu && (
                    <div className="add-card-input-footer">
                      <p>hit enter to create</p>
                      <a onClick={this.handleCreateCard}>Create</a>
                    </div>
                  )}
                </div>
              )}
              {!isSaving &&
                !inInputMode &&
                (!isAttachmentHoveringOnCard || bottomOverlay) && (
                  <a
                    className="dark-grey-link w400"
                    onClick={this.handleToggleInputMode}
                  >
                    {addCardUI || '+ Add Card'}
                  </a>
                )}

              {isAttachmentHoveringOnCard && view.includes('document') && (
                <DocumentCardAttachmentDropOptions
                  view={view}
                  card={null}
                  addToNewFile={this.addToNewFile}
                />
              )}

              {isAttachmentHoveringOnCard && view.includes('grid') && (
                <GridCardAttachmentDropOptions
                  view={view}
                  card={null}
                  addToNewFile={this.addToNewFile}
                />
              )}

              {isFileDragged &&
                view === 'bottom-dropzone-overlay' &&
                !isSaving &&
                !inInputMode && (
                  <GridCardAttachmentDropOptions
                    view={view}
                    card={null}
                    addToNewFile={this.addToNewFile}
                  />
                )}
            </div>
          </div>
        </GenericDropZone>
      </div>
    );
  }
}

const mapState = state => ({
  isFileDragged: state._newReduxTree.ui.modals.showAddCardBottomOverlay
});

const mapDispatch = {
  createCard,
  addGoogleFileToCard,
  addDropboxFileToCard,
  addBoxFileToCard,
  setEditCardModalOpen,
  setShowAddCardBottomOverlay
};

export default connect(
  mapState,
  mapDispatch
)(AddCardCard);
