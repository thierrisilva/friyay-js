import React from 'react';
import TipLinksList from './tip_links_list';

// TODO: @abdullah move all code from TipLinksList to here

const ItemContentTipLinks = React.memo(
  ({ item, tipLinks, showDescription, isGrid }) => (
    <TipLinksList
      item={item}
      tipLinks={tipLinks}
      showDescription={showDescription}
      isGrid={isGrid}
    />
  )
);

ItemContentTipLinks.defaultProps = {
  item: null,
  tipLinks: [],
  showDescription: false,
  isGrid: false
};

export default ItemContentTipLinks;
