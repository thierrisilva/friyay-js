import React from 'react';
import orderBy from 'lodash/orderBy';
import tiphive from 'Lib/tiphive';
import get from 'lodash/get';
import cx from 'classnames';
import ReactTooltip from 'react-tooltip';
import IconButton from 'Components/shared/buttons/IconButton';

const SheetCardFiles = ({ card, setEditCardModalOpen }) => {
  const documents = get(card, 'attributes.attachments_json.documents', []);

  return (
    <div className="flex-r-wrap-start">
      {documents.map(doc => {
        const documentURL = doc.file_url;
        let documentName = tiphive.baseName(documentURL);
        let iconName = 'fa-file-o';

        if (/text/.test(doc.file_content_type)) {
          iconName = 'fa-file-text-o';
        } else if (/pdf/.test(doc.file_content_type)) {
          iconName = 'fa-file-pdf-o';
        } else if (/spreadsheet/.test(doc.file_content_type)) {
          iconName = 'fa-file-excel-o';
        } else if (/word/.test(doc.file_content_type)) {
          iconName = 'fa-file-word-o';
        } else if (/presentation/.test(doc.file_content_type)) {
          iconName = 'fa-file-powerpoint-o';
        }

        return (
          <div key={doc.id} className="mr5" data-tip="" data-for={documentURL}>
            <i
              className={cx(
                'fa',
                iconName,
                'text-muted sheet-view__cell--files-icon'
              )}
            />

            <ReactTooltip
              border
              className="tiphive-tooltip"
              id={documentURL}
              type="dark"
              effect="solid"
            >
              {documentName}
            </ReactTooltip>
          </div>
        );
      })}

      <IconButton
        additionalClasses="sheet-view__card-title-edit-btn"
        fontAwesome
        icon="pencil"
        onClick={() => setEditCardModalOpen({ cardId: card.id, tab: 'Edit' })}
      />
    </div>
  );
};

export default {
  cssModifier: 'files',
  display: 'Files',
  resizableProps: {
    minWidth: '100'
  },
  Component: SheetCardFiles,
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(
      cards,
      card => get(card, 'attributes.attachments_json.documents', []).length,
      order
    );
  }
};
