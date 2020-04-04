import React from 'react';

import tiphive from 'Lib/tiphive';
import CardWorkEstimationLabel from 'Src/components/shared/cards/elements/CardWorkEstimationLabel';
import CardDueDateLabel from 'Src/components/shared/cards/elements/CardDueDateLabel';

const GridPlanButtons = ({ card }) => {
  const { tip_links = [], documents = [] } = card.attributes.attachments_json;
  if (!tip_links.length && !documents.length) {
    return null;
  }
  return (
    <div className="grid-card_content-doc-links">
      {tip_links.map((link, index) => (
        <a
          className="material-icons text-muted grid-card_content-link"
          href={link.url}
          key={index}
          target="_blank"
        >
          link
        </a>
      ))}
      {documents.map((doc, index) => (
        <div
          className="link-tooltip-container grid-card_content-doc-link"
          key={index}
        >
          <a
            className="fa fa-file-o text-muted"
            href={doc.file_url}
            target="_blank"
          />
          <span className="link-tooltip">{tiphive.baseName(doc.file_url)}</span>
        </div>
      ))}
      <div className="card-footer_flex-container grid-plan-buttons" />
    </div>
  );
};

export default GridPlanButtons;
