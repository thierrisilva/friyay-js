import React, { Component } from 'react';
import { object } from 'prop-types';
import CardLabels from 'Components/shared/cards/elements/assemblies/CardLabels';
import CardAssigneeLabel from 'Components/shared/cards/elements/CardAssigneeLabel';
import LikeButton from 'Components/shared/cards/elements/LikeButton';
import StarButton from 'Components/shared/cards/elements/StarButton';
import CardWorkEstimationLabel from 'Components/shared/cards/elements/CardWorkEstimationLabel';
import CardDueDateLabel from 'Components/shared/cards/elements/CardDueDateLabel';
import UserAvatar from 'Src/components/shared/users/elements/UserAvatar';
import IconButton from 'Components/shared/buttons/IconButton';

class CardDetailsFooter extends Component {
  render() {
    const { card, hideComments } = this.props;
    return [
      <div
        key="for-full-screen"
        className="card-details-footer hide-for-split-screen-view"
      >
        <h4
          onClick={() => this.props.toggleComments()}
          className="comments-list_title"
        >
          <IconButton
            additionalClasses="caret-down"
            fontAwesome={true}
            icon={hideComments === true ? 'caret-down' : 'caret-up'}
          />
          Comments
        </h4>

        <div className="card-details-footer__gutter" />

        <div className="flex-r-center-spacebetween card-details-footer__actions card-footer_flex-container">
          <div className="card-details-header_title-container">
            <UserAvatar user={card.attributes.creator} />
          </div>
          <span className="">
            {moment(card.attributes.created_at).format('DD MMM YY')}
          </span>
          <CardAssigneeLabel
            card={card}
            className="card-footer_assignee"
            showTooltip
          />
          <CardLabels card={card} expandDirection="up" />
          <CardWorkEstimationLabel
            card={card}
            className="timeline-card__plan-label"
            showTooltip
          />
          <CardDueDateLabel
            card={card}
            className="timeline-card__plan-label"
            showTooltip
          />
          <LikeButton card={card} />
          <StarButton card={card} />
        </div>
      </div>,

      <div
        key="for-split-screen"
        className="card-details-footer hide-for-full-screen-view"
      >
        <h4
          onClick={() => this.props.toggleComments()}
          className="comments-list_title"
        >
          <IconButton
            additionalClasses="caret-down"
            fontAwesome={true}
            icon={hideComments === false ? 'caret-up' : 'caret-down'}
          />
          Comments
        </h4>

        <div className="card-details-header_title-container">
          <UserAvatar user={card.attributes.creator} />
          <span className="">
            {moment(card.attributes.created_at).format('DD MMM YY')}
          </span>
        </div>

        <div className="card-details-footer__gutter" />

        <div className="flex-r-center-spacebetween card-details-footer__actions card-footer_flex-container">
          <CardLabels card={card} expandDirection="up" />
          <CardAssigneeLabel
            card={card}
            className="card-footer_assignee"
            showTooltip
          />
          <CardWorkEstimationLabel
            card={card}
            className="timeline-card__plan-label"
            showTooltip
          />
          <CardDueDateLabel
            card={card}
            className="timeline-card__plan-label"
            showTooltip
          />
          <LikeButton card={card} />
          <StarButton card={card} />
        </div>
      </div>
    ];
  }
}

CardDetailsFooter.propTypes = {
  card: object.isRequired
};

export default CardDetailsFooter;
