/* global vex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import CardDetails from 'Components/views/card_views/Card/CardDetails';
import IconButton from 'Components/shared/buttons/IconButton';
import RevolvingToggleButton from 'Components/shared/buttons/RevolvingToggleButton';
import WikiList from './WikiList';
import WikiTopicListContent from './WikiTopicListContent';
import { scrollToShow } from 'Src/lib/utilities';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';
import { getSidePaneArrowTop, getSidePaneArrowLeft } from 'Src/lib/utilities';
import { yayDesign } from 'Src/lib/utilities';

class WikiView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTree: true,
      selectedCardId: null,
      background: '#37AACF'
    };
    this.viewRef = React.createRef();
  }

  componentDidUpdate = prevProps => {
    const {
      props: { cards, topic },
      state: { selectedCardId }
    } = this;
    if (
      cards &&
      cards.length > 0 &&
      (!selectedCardId ||
        (topic ? topic.id : 0) !== (prevProps.topic ? prevProps.topic.id : 0))
    ) {
      let selectedCard = cards.find(card =>
        topic ? card.relationships.topics.data.includes(topic.id) : true
      );
      if (!selectedCard && !this.state.selectedCardId) {
        return;
      }

      this.setState({ selectedCardId: selectedCard ? selectedCard.id : null });
    }
  };

  handleToggleTree = () => {
    this.setState(state => ({ displayTree: !state.displayTree }));
  };

  handleSelectCard = cardId => {
    this.setState({ selectedCardId: cardId });
  };

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

  afterCardCreated = cardId => {
    const elem = document.querySelector('.card-title.c' + cardId);
    scrollToShow(elem, 14, 24);
  };

  render() {
    const {
      topic,
      displayLeftMenu,
      displayLeftSubtopicMenuForTopic,
      active_design
    } = this.props;
    const {
      displayTree,
      selectedCardId,
      showIcons,
      showTitle,
      inEditMode,
      initialCard,
      background
    } = this.state;

    const {
      card_font_color,
      card_background_color,
      card_background_color_display
    } = active_design || {};

    return (
      <div ref={this.viewRef} className="wiki-view relative">
        <div
          className={`wiki-view_tree left-list ${displayTree && 'presented'}`}
        >
          <WikiList
            color={card_font_color}
            onSelectCard={this.handleSelectCard}
            selectedCardId={selectedCardId}
            topic={topic}
          />
        </div>
        <div className="wiki-view_small-screen">
          <RevolvingToggleButton
            onClick={this.handleToggleTree}
            toggleValue={displayTree}
          />
        </div>
        <IconButton
          containerClasses="left-section-icon-container"
          wrapperClasses="left-section-icon"
          style={{
            top: getSidePaneArrowTop(this.viewRef),
            backgroundColor: card_background_color_display
              ? card_background_color
              : '#fafafa',
            left: `${getSidePaneArrowLeft(false) +
              (displayLeftSubtopicMenuForTopic.topicId ? 270 : 0) +
              (displayLeftMenu ? 270 : 0)}px`
          }}
          fontAwesome
          color={card_font_color}
          icon={displayTree ? 'chevron-left' : 'chevron-right'}
          onClick={this.handleToggleTree}
        />

        {Boolean(selectedCardId) && (
          <div
            className={`wiki-view_content-container ${
              displayTree ? 'tree-shown' : 'tree-hidden'
            }`}
          >
            <ActiveFiltersPanel />
            <CardDetails
              cardId={selectedCardId}
              onEditorScroll={this.handleEditorScroll}
              rootContainerClass="wiki-view"
              showMinMax
            />
          </div>
        )}
        {!selectedCardId && (
          <div className="wiki-view_content-container">
            <ActiveFiltersPanel />
            <WikiTopicListContent topic={topic} />
          </div>
        )}
      </div>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const { page, topics } = sm;
  const { topicId } = page;
  const topic = topics[topicId];
  const active_design = yayDesign(topicId, topic);

  return {
    active_design,
    topic,
    topicId: topicId,
    currentUser: sm.user,
    isEditing: sm.modals.displayEditCardModal,
    group: Object.values(sm.groups)[0],
    displayLeftMenu: sm.menus.displayLeftMenu,
    displayLeftSubtopicMenuForTopic: sm.menus.displayLeftSubtopicMenuForTopic
  };
};

export default connect(mapState)(WikiView);
