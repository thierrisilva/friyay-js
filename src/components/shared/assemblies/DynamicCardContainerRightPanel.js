import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import IconButton from 'Components/shared/buttons/IconButton';
import CardDetails from 'Src/components/views/card_views/Card/CardDetails';
import { toggleCardsSplitScreen } from 'Src/newRedux/interface/menus/actions.js';
import cx from 'classnames';

class DynamicCardContainerRightPanel extends PureComponent {
  /**
   * On editor scrolling event handler.
   *
   * @param {Event} e
   * @param {Node}  toolbarEl
   * @return  {Void}
   */
  handleEditorScroll = (e, toolbarEl) => {
    if (e.currentTarget.scrollTop >= 191) {
      // 191px is when the first line of text gone from view port while scrolling
      if (toolbarEl && !toolbarEl.classList.contains('fixed')) {
        toolbarEl.classList.add('fixed');
      }
    } else {
      if (toolbarEl && toolbarEl.classList.contains('fixed')) {
        toolbarEl.classList.remove('fixed');
      }
    }
  };

  render() {
    const {
      card,
      toggleLeftPane,
      isLeftPaneOpen,
      toggleCardsSplitScreen
    } = this.props;

    return (
      <Fragment>
        {card ? (
          <Fragment>
            <div className="flex split-icon-wrapper">
              <IconButton
                fontAwesome
                icon={isLeftPaneOpen ? 'chevron-left' : 'chevron-right'}
                additionalClasses="card-container__card-panel-toggle"
                onClick={toggleLeftPane}
              />
              <IconButton
                fontAwesome
                icon="columns"
                additionalClasses="card-container__card-panel-split-toggle"
                onClick={toggleCardsSplitScreen}
              />
            </div>
            <div
              className={cx('height-100pc', {
                'mx-12pc pt10': !isLeftPaneOpen
              })}
            >
              <CardDetails
                cardId={card.id}
                onEditorScroll={this.handleEditorScroll}
                rootContainerClass="card-view"
                showMinMax
              />
            </div>
          </Fragment>
        ) : (
          <h4 className="card-container__card-placeholder text-center pt50 mt0">
            Please select a card from left section.
          </h4>
        )}
      </Fragment>
    );
  }
}

const mapState = (state, props) => {
  const { cards, user } = stateMappings(state);
  const selectedCardId = user.attributes.ui_settings.selectedCardId;

  return {
    card: cards[selectedCardId] || null
  };
};

const mapDispatch = {
  toggleCardsSplitScreen
};

export default connect(
  mapState,
  mapDispatch
)(DynamicCardContainerRightPanel);
