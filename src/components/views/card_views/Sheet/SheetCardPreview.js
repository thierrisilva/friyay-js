import { any } from 'prop-types';
import React from 'react';

import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';

function SheetCardPreview({ card }) {
  return (
    <div className="sheet-view-card-preview">
      <CardTitleLink card={card} />
    </div>
  );
}

SheetCardPreview.propTypes = { card: any.isRequired };

export default SheetCardPreview;
