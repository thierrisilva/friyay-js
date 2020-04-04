/* global filepicker */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  match,
  length,
  equals,
  compose,
  not,
  ifElse,
  is,
  identity,
  and,
  isNil,
  always
} from 'ramda';
// import { getUsers } from 'Actions/comments';

import FroalaEditor from 'froala-editor/js/froala_editor.pkgd.min.js';
import ReactFroalaEditor from 'react-froala-wysiwyg';
import Tribute from 'tributejs';

import withDataManager from 'Src/dataManager/components/withDataManager';
import { getPeopleArray } from 'Src/newRedux/database/people/selectors';
import { getPeople } from 'Src/newRedux/database/people/thunks';

import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/themes/royal.min.css'
import 'froala-editor/css/froala_style.min.css';
import 'tributejs/dist/tribute.css';
import 'froala-editor/css/third_party/embedly.min.css';

// plugins js
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/code_view.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/file.min.js';
import 'froala-editor/js/third_party/embedly.min.js';
import 'froala-editor/js/plugins/inline_style.min.js';
import 'froala-editor/js/plugins/line_breaker.min.js';
import 'froala-editor/js/plugins/code_beautifier.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/draggable.min.js';
import 'froala-editor/js/plugins/entities.min.js';

// plugin css
import 'froala-editor/css/plugins/colors.min.css';
import 'froala-editor/css/plugins/table.min.css';
import 'froala-editor/css/plugins/code_view.min.css';
import 'froala-editor/css/plugins/video.min.css';
import 'froala-editor/css/plugins/image.min.css';
import 'froala-editor/css/plugins/file.min.css';
import 'froala-editor/css/third_party/embedly.min.css';
import 'froala-editor/css/plugins/line_breaker.min.css';
import 'froala-editor/css/plugins/draggable.min.css';

const IMG_BASE_URL = 'https://process.filestackapi.com';
const notNull = compose(
  not,
  isNil
);
const isString = is(String);
const notNullAndIsString = and(notNull, isString);
const getStringOrEmpty = ifElse(notNullAndIsString, identity, always(''));
const isImageUrl = compose(
  not,
  equals(0),
  length,
  match(/\.(jpeg|jpg|gif|png)$/),
  getStringOrEmpty
);

class TextEditor extends Component {
  static defaultProps = {
    defaultValue: null,
    focus: false,
    customStyleMap: {},
    tabIndex: null,
    placeholder: 'Input text',
    users: [],
    areUsersLoading: false,
    type: '',
    froalaEditorEvents: {},
    settings: {}
  };

  static propTypes = {
    placeholder: PropTypes.string,
    className: PropTypes.string,
    editorClassName: PropTypes.string,
    toolbarClassName: PropTypes.string,
    body: PropTypes.string,
    onChange: PropTypes.func,
    tabIndex: PropTypes.number,
    users: PropTypes.array,
    areUsersLoading: PropTypes.bool,
    type: PropTypes.string,
    getPeople: PropTypes.func,
    froalaEditorEvents: PropTypes.object,
    settings: PropTypes.object
  };

  imgProcess = {
    id: '',
    getUrl: () => `${IMG_BASE_URL}/resize=width:300/${this.imgProcess.id}`,
    getUrlWithWidthHeight: (w, h) =>
      `${IMG_BASE_URL}/resize=width:${w},height:${h}/${this.imgProcess.id}`,
    renderImgElement: img => {
      const src = img.src;
      if (src.indexOf(IMG_BASE_URL) !== -1) {
        const splitUrl = src.split('/');
        this.imgProcess.id = splitUrl[splitUrl.length - 1];
        const height = Math.trunc(img.height || 0);
        const width = Math.trunc(img.width || 0);
        const imageUrl = this.imgProcess.getUrlWithWidthHeight(width, height);
        const uploadingImage = document.querySelector(`img[src="${src}"]`);
        uploadingImage.setAttribute('src', imageUrl);
      }
    }
  };

  editorConfig = () => {
    const {
      placeholder,
      type,
      getPeople,
      users,
      areUsersLoading,
      froalaEditorEvents
    } = this.props;

    const uploadURL = `${window.FILESTACK_API_URL}?key=${
      window.FILESTACK_API_KEY
    }`;

    const defaultEvents = {
      'paste.before': function(originalEvent) {
        const clipboard = originalEvent.clipboardData;
        const data = clipboard.getData('text/plain');
        const isYoutubeLink = /^https?:\/\/.*youtu\.?be/.test(data);

        if (isYoutubeLink) {
          this.video.insertByURL(data);

          return false;
        }
      },
      initialized: async function() {
        let editor = this;
        self.editor = this;

        let usersToDisplay = users.map(
          ({ attributes: { name, username } }) => ({
            key: username.replace(/\d+$/, ''),
            value: username.replace(/\d+$/, '')
          })
        );

        if (users.length === 0 && !areUsersLoading) {
          const usersForComments = await getPeople();
          usersToDisplay = usersForComments.map(
            ({ attributes: { name, username } }) => ({
              key: username.replace(/\d+$/, ''),
              value: username.replace(/\d+$/, '')
            })
          );
        }

        let tribute = new Tribute({
          values: usersToDisplay,
          selectTemplate: item => {
            return `<span class="fr-deletable fr-tribute">
                <a href="/users/${item.original.key}" target="_blank">
                  ${item.original.key}
                </a>
              </span>`;
          }
        });

        tribute.attach(editor.el);

        editor.events.on(
          'keydown',
          function(e) {
            if (e.which == FroalaEditor.KEYCODE.ENTER && tribute.isActive) {
              return false;
            }
          },
          true
        );
      },
      'file.uploaded': response => {
        const { filename, url } = JSON.parse(response) || {};
        this.file.insert(url, filename, response);

        return false;
      },
      'image.uploaded': response => {
        const parseResponse = JSON.parse(response);
        const [splitUrl] = parseResponse.url.split('/').reverse();
        this.imgProcess.id = splitUrl;
        this.image.insert(this.imgProcess.getUrl());
        this.image.remove($('img.fr-uploading'));
      },
      'image.resizeEnd': ([image]) => {
        return this.imgProcess.renderImgElement(image, editor);
      },
      'commands.after': function(cmd) {
        if (cmd === 'imageSetSize') {
          const images = editor.image.get();
          // there's no way to access the right image here, so update everything
          // fancy way to iterate is because images is a jquery iterator map or each don't work
          for (let idx of [...Array(images.length).keys()]) {
            this.imgProcess.renderImgElement(images[idx], editor);
          }
        }
      },
      'paste.beforeCleanup': (clipboard_html = '') => {
        if (isImageUrl(clipboard_html)) {
          this.image.insert(clipboard_html);
          const checkImageInterval = setInterval(() => {
            const uploadedImage = document.querySelector(
              `img[src="${clipboard_html}"]`
            );
            if (uploadedImage) {
              uploadedImage.style.opacity = 0.6;
              clearInterval(checkImageInterval);
            }
          });

          filepicker.storeUrl(clipboard_html, {}, imageData => {
            const [splitUrl] = imageData.url.split('/').reverse();
            this.imgProcess.id = splitUrl;
            const uploadedImage = document.querySelector(
              `img[src="${clipboard_html}"]`
            );
            uploadedImage.setAttribute('src', this.imgProcess.getUrl());
            uploadedImage.style.opacity = 1;
          });
          return ' ';
        }
      }
    };

    const mergedEvents = { ...defaultEvents };
    Object.entries(froalaEditorEvents).forEach(([key, propsEvent]) => {
      if (defaultEvents[key]) {
        const compoundFunction = (...props) => {
          defaultEvents[key](...props);
          propsEvent(...props);
        };
        mergedEvents[key] = compoundFunction;
      } else {
        mergedEvents[key] = propsEvent;
      }
    });

    const settings = {
      key: window.FROALA_EDITOR_KEY,
      enter: FroalaEditor.ENTER_BR,
      attribution: false,
      inlineMode: false,

      imageDefaultWidth: 0,
      imagePaste: true,
      imagePasteProcess: true,
      pasteAllowLocalImages: true,

      linkAlwaysBlank: false,
      linkInsertButtons: ['linkBack'],
      linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],

      paragraphFormatSelection: true,
      placeholderText: placeholder,
      toolbarSticky: false,
      tabSpaces: 4,
      zIndex: 2080,
      theme: 'royal',
      toolbarButtons: {
        moreText: {
          buttons: [
            'bold',
            'italic',
            'underline',
            'strikeThrough',
            'subscript',
            'superscript',
            'fontSize',
            'textColor',
            'backgroundColor',
            'clearFormatting'
          ]
        },
        moreParagraph: {
          buttons: [
            'formatUL',
            'formatOL',
            'indent',
            'outdent',
            'alignLeft',
            'alignCenter',
            'alignRight',
            'alignJustify',
            'paragraphFormat'
          ],
          buttonsVisible: 3
        },
        moreRich: {
          buttons: [
            'insertFile',
            'insertLink',
            'insertImage',
            'insertVideo',
            'insertTable',
            'emoticons',
            'embedly',
            'insertHR'
          ]
        },
        moreMisc: {
          buttons: ['undo', 'redo', 'selectAll', 'html'],
          align: 'right',
          buttonsVisible: 0
        }
      },
      // toolbarButtons: [
      //   'bold',
      //   'italic',
      //   'underline',
      //   'strikeThrough',
      //   'fontSize',
      //   'colors',
      //   '|',
      //   'paragraphFormat',
      //   'align',
      //   'formatOL',
      //   'formatUL',
      //   'outdent',
      //   'indent',
      //   'insertFile',
      //   'embedly',
      //   'insertLink',
      //   'insertImage',
      //   'insertVideo',
      //   'insertTable',
      //   'emoticons',
      //   'insertHR',
      //   'html',
      // ],
      fileUseSelectedText: true,
      fileUploadURL: uploadURL,
      fileUploadMethod: 'POST',
      fileUploadParam: 'fileUpload',
      pluginsEnabled: [
        'align',
        'codeBeautifier',
        'codeView',
        'entities',
        'fontFamily',
        'fontSize',
        'inlineStyle',
        'lineBreaker',
        'link',
        'lists',
        'paragraphFormat',
        'paragraphStyle',
        'save',
        'table',
        'url',
        'video',
        'image',
        'emoticons',
        'draggable',
        'colors',
        'file',
        'embedly'
      ],
      pluginsDisabled: [],
      codeBeautifierOptions: {
        indent_char: ' ',
        indent_size: 2
      },
      imageUploadURL: uploadURL,
      imageUploadParam: 'fileUpload',
      imageUploadMethod: 'POST',
      imageInsertButtons: ['imageUpload', 'imageByURL'],
      videoInsertButtons: ['videoByURL', 'videoEmbed'],
      events: mergedEvents
    };

    if (type === 'comment') {
      settings.toolbarButtons = [
        'bold',
        'italic',
        'paragraphFormat',
        'formatOL',
        'formatUL',
        'insertLink',
        'insertImage',
        'emoticons',
        'html'
      ];
      settings.zIndex = 20;
    }

    return {
      ...settings,
      ...this.props.settings
    };
  };

  focus = () => this.editor.events.focus();

  render() {
    const {
      props: { body, onChange, tabIndex }
    } = this;

    return (
      <div id="editor">
        <ReactFroalaEditor
          config={this.editorConfig()}
          model={body}
          onModelChange={onChange}
          tabIndex={tabIndex}
        />
      </div>
    );
  }
}

const mapState = (state, props) => ({
  users: getPeopleArray(state)
});

const mapDispatch = {
  getPeople
};

const dataRequirements = props => {
  return {
    people: {}
  };
};

export default connect(
  mapState,
  mapDispatch,
  null,
  { withRef: true }
)(TextEditor);
