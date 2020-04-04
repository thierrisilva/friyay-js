import React from 'react';
import PropTypes from 'prop-types';
import TipDetails from './tip_details';
import TipActions from './tip_actions';
import ItemContentLabels from '../../../pages/item_page/item_content_labels';
import CardAssigneeLabel from 'Components/shared/cards/elements/CardAssigneeLabel';
import CardDueDateLabel from 'Components/shared/cards/elements/CardDueDateLabel';
import CardWorkEstimationLabel from 'Components/shared/cards/elements/CardWorkEstimationLabel';

const ListItemTip = ({
  item,
  onLikeUnlikeClick,
  onStarUnstarClick,
  handleItemClick,
  removeItem,
  archiveItem,
  group,
  topic,
  tipViewMode
}) => {
  const labels = item.relationships.labels.data;

  let labelsContent = null;
  if (labels && labels.length > 0) {
    labelsContent = (
      <ItemContentLabels
        tip={item}
        labels={labels}
      />
    );
  }

  return (
    <div className="list-item-content">
      <TipDetails group={group} item={item} handleItemClick={handleItemClick} />
      <CardAssigneeLabel
        card={item}
        className="list-item-plan-property"
        showTooltip
      />
      <CardDueDateLabel
        card={item}
        className="list-item-plan-property"
        hideOnUndefinedValue={true}
        showTooltip
        showValue
      />
      <CardWorkEstimationLabel
        card={item}
        className="list-item-plan-property"
        hideOnUndefinedValue={true}
        showTooltip
        showValue
      />
      <div className="list-labels-root">{labelsContent}</div>
      <TipActions
        item={item}
        handleItemClick={handleItemClick}
        removeItem={removeItem}
        archiveItem={archiveItem}
        onLikeUnlikeClick={onLikeUnlikeClick}
        onStarUnstarClick={onStarUnstarClick}
        topic={topic}
        tipViewMode={tipViewMode}
      />
    </div>
  );
};

ListItemTip.propTypes = {
  item: PropTypes.object.isRequired,
  onLikeUnlikeClick: PropTypes.func.isRequired,
  handleItemClick: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  archiveItem: PropTypes.func.isRequired,
  group: PropTypes.object,
  onStarUnstarClick: PropTypes.func.isRequired,
  topic: PropTypes.object,
  tipViewMode: PropTypes.number.isRequired,
};

export default ListItemTip;
