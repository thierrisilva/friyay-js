import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextEditor from '../../shared/text_editor';
import AttachmentActions from 'Actions/attachment_actions';
import AttachmentStore from '../../../stores/attachment_store';
import FileDropStore from '../../../stores/file_drop_store';
import FileUploadBox from '../../shared/file_upload_box';
import ItemContentHeader from './item_content/item_content_header';
import toString from 'lodash/toString';
import { setEditHidden } from 'Actions/tipsModal';


import { createCard, updateCard } from 'Src/newRedux/database/cards/thunks';



class ItemContentEdit extends Component {
  // static propTypes = {
  //   removeStyle: PropTypes.bool,
  //   showActions: PropTypes.bool,
  //   autoSave: PropTypes.bool,
  //   updateAutoSave: PropTypes.func,
  //   cardView: PropTypes.bool,
  //   onUpdateTitle: PropTypes.func,
  //   enableUpdateForm: PropTypes.func,
  //   handleTopicClick: PropTypes.func,
  //   itemAddActive: PropTypes.bool,
  //
  //   tip: PropTypes.object.isRequired,
  //   onToggleEditMode: PropTypes.func.isRequired,
  //   updateCard: PropTypes.func.isRequired,
  //   isSaving: PropTypes.bool,
  //   isEditing: PropTypes.bool,
  //   onTopicClick: PropTypes.func,
  //   closeCardViewEdit: PropTypes.func,
  //   removeAttachmentFromTip: PropTypes.func.isRequired,
  //   view: PropTypes.number,
  // };

  static defaultProps = {
    autoSave: false,
    isSaving: false,
    closeCardViewEdit: null
  };

  state = {
    uploadedFiles: [],
    reloadingUploadedFiles: false,
    itemBody: '',
    itemTitle: '',
    itemAttachmentIds: '',
    topicIds: [],
    parentTipId: null,
    sharingItemIds: [],
    labelIds: []
  };

  componentDidMount() {
    // TODO: LOL rubbish
    AttachmentStore.addEventListener(window.ATTACHMENTS_LOAD_EVENT, this.onAttachmentsLoad);

    let attachmentIds = [];
    let uploadedFiles = [];

    const { tip, removeStyle } = this.props;
    const { attributes } = tip;
    const { topics, parent_tip, share_settings, labels } = tip.relationships;
    const { documents, images } = attributes.attachments_json;

    if (documents) {
      attachmentIds = [
        ...attachmentIds,
        ...documents.map(({ id }) => toString(id))
      ];
    }

    if (images) {
      attachmentIds = [
        ...attachmentIds,
        ...images.map(({ id }) => toString(id))
      ];
    }

    uploadedFiles = [
      ...this.uploadedFileParse('images', images),
      ...this.uploadedFileParse('documents', documents)
    ];

    if (attachmentIds.length > 0) {
      AttachmentActions.loadAttachments(attachmentIds);
      this.setState(state => ({
        ...state,
        reloadingUploadedFiles: true
      }));
    }

    this.setState(state => ({
      ...state,
      itemBody: attributes.body || '',
      itemTitle: attributes.title || '',
      itemAttachmentIds: attachmentIds.join(',') || '',
      topicIds: topics.data,
      parentTipId : (parent_tip !== undefined ?parent_tip.data.id : null),
      sharingItemIds: share_settings.data.map(
        item => `${item.sharing_object_type}-${item.sharing_object_id}`
      ),
      labelIds: labels.data.map(label => label.id),
      uploadedFiles
    }));

    FileDropStore.clearItemUploadedFile(FileDropStore.getState(), {
      itemType: 'tips',
      itemID: 'new'
    });

    $('.tip-page-content').on('scroll', this.handleScroll);
    $('#primary-modal').on('hidden.bs.modal', this.afterModalClose);

    if (removeStyle) {
      $('.fr-box').removeAttr('style');
      $(window).on('scroll', this.handleCardScroll);
    }
  }

  afterModalClose = () => {
    !this.props.isSaving &&
      this.props.isEditing &&
      !this.props.autoSave &&
      this.saveItem();
  };

  handleCardScroll = () => {
    const frToolbar = $('.fr-toolbar');
    const frWrapper = frToolbar.next();
    const width = frToolbar.parent().width();
    const offset = document
      .getElementById('editor')
      .parentElement.getBoundingClientRect().top;

    if (offset <= 90) {
      frToolbar.css({
        position: 'fixed',
        top: 90,
        width
      });

      frWrapper.css({
        marginTop: frToolbar.height()
      });
    } else {
      frToolbar.removeAttr('style');
      frWrapper.removeAttr('style');
    }
  };

  handleScroll = () => {
    let currentScroll = $('.tip-page-content').scrollTop();

    if (currentScroll >= 130) {
      $('.fr-toolbar').css({
        position: 'fixed',
        top: '1px',
        width: '66%'
      });
    } else {
      $('.fr-toolbar').removeAttr('style');
    }
  };

  componentWillUnmount() {
    AttachmentStore.removeEventListener(window.ATTACHMENTS_LOAD_EVENT, this.onAttachmentsLoad);
    $(window).off('scroll', this.handleCardScroll);
    $('.tip-page-content').off('scroll', this.handleScroll);
    const { autoSave, itemAddActive } = this.props;
    if (autoSave && !itemAddActive) {
      this.saveItem();
    }
  }

  onAttachmentsLoad = attachments => {
    if (!attachments || attachments.length === 0) return;

    this.setState(state => ({
      ...state,
      reloadingUploadedFiles: false,
      uploadedFiles: attachments.map(data => ({
        response: { data },
        localData: { preview: null }
      })),
      itemAttachmentIds: attachments.map(({ id }) => id).join(',')
    }));
  };

  handleAddUploadedFile = uploadedFile => {
    const { state: { uploadedFiles } } = this;
    const newFiles = [...uploadedFiles, uploadedFile];
    const fileIds = newFiles
      .map(({ response: { data: { id } } }) => id)
      .join(',');

    this.setState(state => ({
      ...state,
      uploadedFiles: newFiles,
      itemAttachmentIds: fileIds
    }));

    const itemTextAttachmentsElement = document.querySelector(
      '.item-text-attachments'
    );
    itemTextAttachmentsElement.scrollTop =
      itemTextAttachmentsElement.scrollHeight;
  };

  // handleRemoveUploadedFile = removedFileId => {
  //   const {
  //     state: { itemAttachmentIds, uploadedFiles },
  //     props: { removeAttachmentFromTip, tip }
  //   } = this;

  //   removeAttachmentFromTip(tip.id, removedFileId);

  //   this.setState(state => ({
  //     ...state,
  //     uploadedFiles: uploadedFiles
  //       .filter(file => file.response.data.id !== removedFileId),
  //     itemAttachmentIds: itemAttachmentIds
  //       .split(',')
  //       .filter(id => id !== removedFileId)
  //       .join(',')
  //   }));
  // }

  handleItemBodyChange = itemBody => this.setState({ itemBody });

  handleItemTitleChange = ({ target: { value } }) => {
    const { props: { onUpdateTitle } } = this;
    this.setState({ itemTitle: value });
    if(onUpdateTitle !== undefined)
    {
      onUpdateTitle(value);
    }
  }

  saveItem = async e => {
    e && e.preventDefault();

    const {
      props: {
        updateCard,
        tip,
        toggleEdit,
	      view,
      },
      state: {
        itemBody,
        itemAttachmentIds,
        topicIds,
        parentTipId,
        sharingItemIds,
        labelIds,
        itemTitle
      }
    } = this;

    const attributes = {
      title: itemTitle || 'Title',
      body: itemBody,
      expiredAt: null,
      start_date: null,
      due_date: null,
      completion_date: null,
      expected_completion_date: null,
      resource_required: null,
      completed_percentage: null,
    };

    const relationships = {
      attachments: { data: itemAttachmentIds },
      group_followers: { sharingItemIds },
      labels: { data: labelIds },
      topics: { data: topicIds },
      tip_assignments: { data: null },
      depends_on: { data: null }
    }

    updateCard({ id: tip.id, attributes, relationships });
    toggleEdit(false);
  };

  handleSaveClick = e => {
    const { updateAutoSave } = this.props;
    updateAutoSave && updateAutoSave(false);
    this.saveItem(e);
  };

  uploadedFileParse(type, files = []) {
    if (!Array.isArray(files)) return [];

    return files.map(file => ({
      response: {
        data: {
          id: file.id,
          type: type,
          attributes: file
        }
      },
      localData: {
        preview: null
      }
    }));
  }

  render() {
    const {
      props: {
        tip,
        cardView,
        handleItemTrashClick,
        onMinimize,
        onUpdateTitle,
        handleItemArchiveClick,
        handleMaximizeClick,
        toggleEdit,
        handleOptionClick,
        onTopicClick,
        closeCardViewEdit
      },
      state: { reloadingUploadedFiles, itemBody, itemTitle, uploadedFiles }
    } = this;

    const {
      attributes: { color_index }
    } = tip;
    const itemContentClass = `item-content item-content-edit fr-view color-${color_index}`;

    // const uploadedFiles = uniqBy(
    //   [
    //     ...this.state.uploadedFiles,
    //     ...this.uploadedFileParse('images', images),
    //     ...this.uploadedFileParse('documents', documents)
    //   ],
    //   attachment => toString(attachment.response.data.id)
    // );

    let fileUploadBox;
    if (reloadingUploadedFiles) {
      fileUploadBox = (
        <p className="text-center">
          Loading auto saved uploads... <img src="/images/ajax-loader.gif" />
        </p>
      );
    } else {
      fileUploadBox = (
        <FileUploadBox
          objectType="tip"
          uploadedFiles={uploadedFiles}
          tabIndex={2}
          removeUploadedFile={this.handleRemoveUploadedFile}
          addUploadedFile={this.handleAddUploadedFile}
        />
      );
    }

    return (
      <div className={itemContentClass} style={{ display: 'flex', flexDirection: 'column' }}>
        <ItemContentHeader
          editMode
          tip={tip}
          cardView={cardView}
          handleSaveClick={this.handleSaveClick}
          onTopicClick={onTopicClick}
        />
        <form className="item-update-form" style={{ flexGrow: 1 }}>
          <div className="panel-body item-update-tab pt0">
            <div>
              <input
                type="text"
                name="item[title]"
                className="form-control item-title form-control-minimal"
                placeholder="Type title"
                autoComplete="off"
                tabIndex={0}
                value={itemTitle}
                onChange={this.handleItemTitleChange}
                required
              />
            </div>
            <div className="form-group item-text-attachments">
              <div className="form-group item-text-editor-container">
                <TextEditor
                  tabIndex={1}
                  placeholder="Write your Card content here"
                  body={itemBody}
                  onChange={this.handleItemBodyChange}
                  required
                />
              </div>
            </div>
          </div>
        </form>
        <div className="bottom-btns" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {fileUploadBox}

          <div className="save-button">
            <button
              type="button"
              className="btn btn-default mr25"
              onClick={() => {
                toggleEdit(false);

                if (closeCardViewEdit !== null) {
                  closeCardViewEdit();
                }
              }}
            >
              Cancel
            </button>
            <input
              type="submit"
              name="submit"
              className="btn btn-default"
              value="SAVE"
              data-disable-with="Saving..."
              onClick={this.handleSaveClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatch = {
  createCard,
  updateCard
};

export default connect(null, mapDispatch)(ItemContentEdit);
