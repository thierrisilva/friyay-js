import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AddCardButton } from 'Components/shared/buttons/index';
import { createCard, updateCard } from 'Src/newRedux/database/cards/thunks';
import CardDetailsEditor from 'Components/views/card_views/Card/CardDetailsEditor';
import { scrollToShow } from 'Src/lib/utilities';
import QuickRightBarActions from 'Components/shared/assemblies/QuickRightBarActions';

class MessageBoardHeader extends React.PureComponent {
  static propTypes = {
    topic: PropTypes.object
  };

  state = { inInputMode: false };

  handleToggleInputMode = () =>
    this.setState(prev => ({ inInputMode: !prev.inInputMode }));

  afterCardCreated = cardId => {
    const elem = document.querySelector('.card-title.c' + cardId);
    scrollToShow(elem, 14, 24);
  };

  render() {
    const { inInputMode } = this.state;
    const { topic } = this.props;

    return (
      <Fragment>
        <div className="ml15 flex-r-start message-board-header">
          <AddCardButton
            onAddCardClick={this.handleToggleInputMode}
            topic={topic}
          />
          <QuickRightBarActions tooltipOptions={{ place: 'bottom' }} />
        </div>

        {inInputMode && (
          <div className="m-l-3 p-y-2 message-board__card-detail message-board__card-detail--new">
            <CardDetailsEditor
              onToggleEditMode={this.handleToggleInputMode}
              newCardRelationships={{
                topics: { data: [topic.id] }
              }}
              afterCardCreated={this.afterCardCreated}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

const mapDispatch = {
  createCard,
  updateCard
};

export default connect(
  undefined,
  mapDispatch
)(MessageBoardHeader);
