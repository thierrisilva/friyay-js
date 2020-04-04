import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import tiphive from 'Lib/tiphive';
import lineClamp from '../../../helpers/lineClamp';

export default class DocumentsList extends Component {
  static defaultProps = {
    item: null,
    documents: [],
    isGrid: false
  };

  static propTypes = {
    item: PropTypes.object,
    documents: PropTypes.array,
    isGrid: PropTypes.bool
  };

  title = null;

  componentDidMount() {
    this.title !== null && lineClamp(this.title, { lineCount: 2 });
  }

  componentDidUpdate() {
    this.title !== null && lineClamp(this.title, { lineCount: 2 });
  }

  render() {
    const {
      props: { documents, isGrid }
    } = this;
    const collapsed = isGrid && documents.length > 2;

    const documentListClass = classnames({
      'list-group documents-list-group': true,
      collapsed
    });

    const documentItems = documents
      .filter(doc => doc.file_url)
      .map(doc => {
        const documentURL = doc.file_url;
        let documentName = tiphive.baseName(documentURL);
        let iconName = 'fa fa-file-o text-muted';

        if (/text/.test(doc.file_content_type)) {
          iconName = 'fa fa-file-text-o text-muted';
        }
        if (/pdf/.test(doc.file_content_type)) {
          iconName = 'fa fa-file-pdf-o text-muted';
        }
        if (/spreadsheet/.test(doc.file_content_type)) {
          iconName = 'fa fa-file-excel-o text-muted';
        }
        if (/word/.test(doc.file_content_type)) {
          iconName = 'fa fa-file-word-o text-muted';
        }
        if (/presentation/.test(doc.file_content_type)) {
          iconName = 'fa fa-file-powerpoint-o text-muted';
        }

        if (!documentName) {
          documentName = doc.name;
        }

        const itemDocumentClass = classnames({
          'list-group-item group-item-document': true,
          'link-tooltip-container': collapsed
        });

        let link = (
          <a href={documentURL} target="_blank">
            {documentName}
          </a>
        );

        if (isGrid) {
          link = (
            <div className="line-clamp-wrapper">
              <a
                className="line-clamp"
                href={documentURL}
                target="_blank"
                ref={anchor => (this.title = anchor)}
              >
                {documentName}
              </a>
            </div>
          );
        }

        if (collapsed) {
          link = (
            <span className="link-tooltip">
              <a href={documentURL} target="_blank">
                {documentName}
              </a>
            </span>
          );
        }

        return (
          <li className={itemDocumentClass} key={'document-item-' + doc.id}>
            <i className={iconName} />
            {link}
          </li>
        );
      });

    if (collapsed) {
      return <ul className={documentListClass}>{documentItems.slice(0, 8)}</ul>;
    } else {
      return <ul className={documentListClass}>{documentItems}</ul>;
    }
  }
}
