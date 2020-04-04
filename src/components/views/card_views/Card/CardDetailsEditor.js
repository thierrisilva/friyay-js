import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FileUploadBox from 'Components/shared/file_upload_box';
import TextEditor from 'Components/shared/text_editor';
import CardDetailsHeader from './CardDetailsHeader';
import { createCard, updateCard } from 'Src/newRedux/database/cards/thunks';
import { parseAttachmentsJson } from 'Lib/utilities';
import { success, failure } from 'Utils/toast';
import get from 'lodash/get';

class CardDetailsEditor extends Component {
  static propTypes = {
    card: PropTypes.shape({
      attributes: PropTypes.shape({
        title: PropTypes.string,
        body: PropTypes.string,
        attachments_json: PropTypes.object
      }),
      relationships: PropTypes.shape({
        attachments: PropTypes.object
      })
    }),
    autoSaveOnClose: PropTypes.bool,
    newCardRelationships: PropTypes.object
  };

  static defaultProps = {
    setShowSaveinBack: () => {},
    newCardRelationships: {},
    initialCard: false
  };

  constructor(props) {
    super(props);

    this.state = {
      itemTitle: get(props, 'card.attributes.title', ''),
      itemBody: get(props, 'card.attributes.body', ''),
      attachmentsJson: {
        tip_links: get(props, 'card.attributes.attachments_json.tip_links', []),
        documents: get(props, 'card.relationships.attachments.data', [])
      },
      saving: false,
      isDirty: false,
      autoSaveOnClose: props.autoSaveOnClose
    };

    this.onToggleEditMode = props.onToggleEditMode;
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onUnload);
  }

  componentWillUnmount = () => {
    window.removeEventListener('beforeunload', this.onUnload);

    const { card } = this.props;
    const { isDirty } = this.state;

    if (isDirty) {
      this.save(card);
    }
  };

  componentDidUpdate = prevProps => {
    const lastCard = prevProps.card && { ...prevProps.card };
    const { card } = this.props;

    if (this.state.isDirty && lastCard && lastCard.id !== card.id) {
      this.saveBeforeUnmount(lastCard);
    }
  };

  onUnload = e => {
    e.preventDefault();

    const { card } = this.props;
    const { isDirty } = this.state;

    if (isDirty) {
      this.save(card);
    }

    return (e.returnValue = 'Are you sure you want to close?');
  };

  handleAddUploadedFile = ({ response: { data } }) => {
    const { attachmentsJson } = this.state;
    const file = { ...data.attributes, id: data.id };
    const revisedAttachmentsJson =
      data.type == 'images'
        ? {
            ...attachmentsJson,
            images: [...(attachmentsJson.images || []), file]
          }
        : {
            ...attachmentsJson,
            documents: [...(attachmentsJson.documents || []), file]
          };

    this.setState({ attachmentsJson: revisedAttachmentsJson, isDirty: true });
    this.props.setShowSaveinBack(true);
  };

  handleRemoveUploadedFile = attachmentId => {
    const { attachmentsJson } = this.state;
    let attachments = {};

    for (let type of Object.keys(attachmentsJson)) {
      attachments = {
        ...attachments,
        [type]: attachmentsJson[type]
          ? attachmentsJson[type].filter(
              attachment => attachment.id !== attachmentId
            )
          : []
      };
    }

    this.setState({ attachmentsJson: attachments, isDirty: true });
    this.props.setShowSaveinBack(true);
  };

  handleItemTitleChange = e => {
    this.setState({ itemTitle: e.target.value, isDirty: true });
    this.props.setShowSaveinBack(true);
  };

  handleItemBodyChange = body => {
    this.setState({ itemBody: body, isDirty: true });
    this.props.setShowSaveinBack(true);
  };

  /**
   * On click save event handler.
   *
   * @param {Event} e
   * @return  {Void}
   */
  handleClickSave = e => {
    e.preventDefault();
    const { isDirty } = this.state;
    const { card } = this.props;

    if (isDirty) {
      this.save(card);
    }
    this.setState(
      {
        autoSaveOnClose: false
      },
      this.onToggleEditMode
    );
  };

  /**
   * Create new card
   *
   * @param {Event} e
   * @return {Void}
   */
  handleClickCreate = async e => {
    e.preventDefault();
    const {
      itemBody: body,
      itemTitle: title,
      attachmentsJson: { images = [], documents = [] }
    } = this.state;
    const { createCard, setShowSaveinBack, newCardRelationships } = this.props;

    const attributes = { title, body };

    const relationships = {
      ...newCardRelationships,
      attachments: {
        data: [...images.map(({ id }) => id), ...documents.map(({ id }) => id)]
      }
    };

    try {
      setShowSaveinBack(false);
      const {
        data: { data: newCard }
      } = await createCard({ attributes, relationships });
      if (this.props.afterCardCreated) {
        this.props.afterCardCreated(newCard.id);
      }
      this.setState({ isDirty: false }, this.onToggleEditMode);
    } catch (ex) {
      failure('Unable to create card, please try again later!');
      console.error(ex);
    }
  };

  /**
   * Save before unmount, use previous card props instead of current props.
   *
   * @param {Object}  lastCard
   * @return {Void}
   */
  saveBeforeUnmount = lastCard => {
    this.save(lastCard);
  };

  handleKeyUp = ({ keyCode }) => {
    if (keyCode === 13) {
      this.editor.getWrappedInstance().focus();
    }
  };

  /**
   * Persist card update.
   *
   * @param {Object}  card
   * @return {Void}
   */
  save = async card => {
    const { updateCard, updateDefaultTip, onUpdateComplete } = this.props;
    const { itemBody, itemTitle, attachmentsJson } = this.state;

    const images = attachmentsJson.images || [];
    const documents = attachmentsJson.documents || [];

    const attributes = {
      title: itemTitle,
      body: itemBody
    };

    const relationships = {
      attachments: {
        data: [...images.map(att => att.id), ...documents.map(att => att.id)]
      }
    };

    const modifiedCard = { id: card.id, attributes, relationships };
    if (updateDefaultTip) updateDefaultTip(modifiedCard);

    try {
      this.setState({ isDirty: false });
      this.props.setShowSaveinBack(false);
      await updateCard(modifiedCard);
      success('Card Updated');
    } catch (ex) {
      failure('Unable to update card, please try again later!');
      console.error(ex);
    }
  };

  render() {
    const {
      card,
      onToggleEditMode,
      showMinMax,
      initialCard,
      hideUploader,
      hideLinker,
      hideCancel,
      hideTitle,
      showDots
    } = this.props;
    const { attachmentsJson, itemBody, itemTitle } = this.state;

    const uploadedFiles = parseAttachmentsJson(attachmentsJson);
    const isCreatingNewCard = !card;

    return (
      <Fragment>
        {!isCreatingNewCard && (
          <CardDetailsHeader
            card={card}
            inEditMode
            onSaveClick={this.handleClickSave}
            showMinMax={showMinMax}
            showDots={showDots}
          />
        )}

        <div className="card-details-editor">
          <div className="item-update-form" style={{ flexGrow: 1 }}>
            {!hideTitle && (
              <div>
                <input
                  type="text"
                  name="item[title]"
                  className="card-details-editor_title-input"
                  placeholder="Type title"
                  autoComplete="off"
                  tabIndex={0}
                  value={itemTitle}
                  ref={r => (this.titleEditor = r)}
                  onChange={this.handleItemTitleChange}
                  onKeyUp={this.handleKeyUp}
                  required
                />
              </div>
            )}
            <div className="form-group item-text-attachments">
              <div className="form-group item-text-editor-container">
                <TextEditor
                  tabIndex={1}
                  placeholder="Write your Card content here"
                  body={itemBody}
                  onChange={this.handleItemBodyChange}
                  required
                  ref={ref => (this.editor = ref)}
                />
              </div>
            </div>
          </div>
          <div
            className="bottom-btns"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexShrink: 0
            }}
          >
            {!hideUploader && (
              <FileUploadBox
                objectType="tip"
                uploadedFiles={uploadedFiles}
                tabIndex={2}
                uploadBoxStyle={{
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  marginBottom: '-15px'
                }}
                removeUploadedFile={this.handleRemoveUploadedFile}
                addUploadedFile={this.handleAddUploadedFile}
              />
            )}
            {!hideCancel && (
              <div className="save-button">
                {isCreatingNewCard ? (
                  <button
                    type="button"
                    className="btn btn-default mr25"
                    onClick={this.handleClickCreate}
                    disabled={!itemTitle}
                  >
                    Create
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn mr25"
                    onClick={this.onToggleEditMode}
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapDispatch = {
  updateCard,
  createCard
};

export default connect(
  undefined,
  mapDispatch
)(CardDetailsEditor);
