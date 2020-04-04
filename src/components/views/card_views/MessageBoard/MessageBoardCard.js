/*globals moment */
import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import CardDetailsEditor from 'Components/views/card_views/Card/CardDetailsEditor';
import StringHelper from 'Src/helpers/string_helper';
import IconButton from 'Components/shared/buttons/IconButton';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import CardLabels from 'Components/shared/cards/elements/assemblies/CardLabels';
import LikeButton from 'Components/shared/cards/elements/LikeButton';
import StarButton from 'Components/shared/cards/elements/StarButton';
import CardTopicLink from 'Src/components/shared/cards/elements/CardTopicLink';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import CommentsList from 'Components/shared/comments/CommentsList';
import Icon from 'Components/shared/Icon';
import { yayDesign } from 'Src/lib/utilities';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';

const MessageBoardCardRow = ({ card, color }) => {
  const {
    attributes: { created_at }
  } = card;
  return (
    <div className="flex-r-start">
      <CardTitleLink card={card} />
      <CardTopicLink card={card} style="lite" />

      <div
        className="message-board__message-time ml15"
        title={moment(created_at).format('MMMM Do YYY, h:mm:ss a')}
      >
        {moment(created_at).fromNow()}
      </div>

      <div className="message-board__row-actions-right">
        <div className="list-card_label-container">
          <CardLabels card={card} expandDirection="left" />
        </div>
        <div className="list-card_actions-container">
          <LikeButton color={color} card={card} />
          <StarButton color={color} card={card} />
          <CardActionsDropdown color={color} card={card} onAddCard={() => {}} />
        </div>
      </div>
    </div>
  );
};

class MessageBoardCard extends PureComponent {
  static propTypes = {
    card: PropTypes.object.isRequired,
    active_design: PropTypes.object
  };

  state = {
    isRowOpen: false,
    isInEditMode: false
  };

  handleToggleEditMode = () =>
    this.setState(prev => ({ isInEditMode: !prev.isInEditMode }));

  handleToggleRowOpen = () =>
    this.setState(prev => ({ isRowOpen: !prev.isRowOpen }));

  render() {
    const {
      props: { card, active_design },
      state: { isRowOpen, isInEditMode }
    } = this;
    const { card_font_color } = active_design || {};

    const {
      attributes: { body, creator, comments_count }
    } = card;

    return (
      <div className="message-board__card">
        <div className="flex-r-start">
          <IconButton
            additionalClasses="timeline-card__nested-cards-caret"
            additionalIconClasses="large"
            fontAwesome
            icon={isRowOpen ? 'caret-down' : 'caret-right'}
            onClick={this.handleToggleRowOpen}
            color={card_font_color}
          />

          <Icon
            containerClasses="message-board__chat-bubble-icon-container"
            additionalClasses="message-board__chat-bubble-icon"
            icon="chat_bubble"
            color={card_font_color}
          />

          <div className="mr14 message-board__card-comments-count">
            {comments_count}
          </div>

          <UserAvatar size={24} user={creator} />

          <div className="message-board__card-detail m-l-10px">
            {isRowOpen ? (
              <Fragment>
                {isInEditMode ? (
                  <CardDetailsEditor
                    card={card}
                    onToggleEditMode={this.handleToggleEditMode}
                    autoSaveOnClose={true}
                  />
                ) : (
                  <Fragment>
                    <MessageBoardCardRow color={card_font_color} card={card} />
                    <div
                      className="m-b-20px message-board__card-body"
                      onDoubleClick={this.handleToggleEditMode}
                      dangerouslySetInnerHTML={{
                        __html: StringHelper.simpleFormat(
                          body ||
                            '<div class="text-muted p-y-1">Double click to edit</div>'
                        )
                      }}
                    />
                    <CommentsList
                      wrapperClass="message-board__comments-list"
                      cardId={card.id}
                      hideComments={false}
                      dateFormatter={comment =>
                        moment(comment.attributes.created_at).fromNow()
                      }
                    />
                  </Fragment>
                )}
              </Fragment>
            ) : (
              <MessageBoardCardRow color={card_font_color} card={card} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const { page } = sm;
  const active_design = yayDesign(page.topicId, sm.topics[page.topicId]);

  return {
    active_design
  };
};

export default connect(
  mapState,
  null
)(MessageBoardCard);
