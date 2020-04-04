import React, { Fragment } from 'react';
import moment from 'moment';

import Ability from 'lib/ability';
import tiphive from 'lib/tiphive';
import CommentButton from 'Src/components/shared/cards/elements/CommentButton.js';
import LikeButton from 'Src/components/shared/cards/elements/LikeButton.js';
import StarButton from 'Src/components/shared/cards/elements/StarButton.js';
import UserAvatar from 'Src/components/shared/users/elements/UserAvatar.js';
// import ItemContentLabels from 'Src/components/pages/item_page/item_content_labels.js';
import CardWorkEstimationLabel from 'Src/components/shared/cards/elements/CardWorkEstimationLabel.js';
import CardDueDateLabel from 'Src/components/shared/cards/elements/CardDueDateLabel.js';
import CardLabels from 'Components/shared/cards/elements/assemblies/CardLabels';
import { SCREEN } from 'Enums';

import './GridFooter.scss';

export default function GridFooter({ item, labels, switchScreen }) {
  const canComment = Ability.can('comment', 'self', item);
  const canLike = Ability.can('like', 'self', item);

  return (
    <div className="grid-footer-wrapper">
      <div className="footer-row">
        <span className="date-string">
          {moment(item.attributes.updated_at).format('DD MMM YY')}
        </span>
        <CardLabels card={item} expandDirection="up" />
      </div>
      <div className="footer-row">
        <UserAvatar user={item.attributes.creator} showTooltip />
        {item.attributes.due_date && (
          <CardDueDateLabel
            card={item}
            className="timeline-card__plan-label"
            showTooltip
          />
        )}
        {item.attributes.resource_required && (
          <CardWorkEstimationLabel
            card={item}
            className="timeline-card__plan-label"
            showTooltip
          />
        )}
        {canComment && <CommentButton card={item} />}
        {canLike && <LikeButton card={item} />}
        <StarButton card={item} />
        {!!switchScreen && !tiphive.userIsGuest() && (
          <a
            className="btn-label light-gray mr8"
            onClick={() => {
              switchScreen(SCREEN.LABEL_LISTING);
            }}
          >
            <i className="fa fa-tag fa-lg" />
          </a>
        )}
      </div>
    </div>
  );
}
