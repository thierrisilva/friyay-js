import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SheetFooter from './SheetFooter';
import SheetHeader from './SheetHeader';
import SheetTopicSection from './SheetTopicSection';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';
import { createCard } from 'Src/newRedux/database/cards/thunks';
import { createTopic } from 'Src/newRedux/database/topics/thunks';
import { scrollToShow, yayDesign } from 'Src/lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { updateOrCreateTopicOrderOnSheetViewColumnChange } from 'Src/newRedux/database/topicOrders/abstractions';
import { getRelevantTopicOrderForTopic } from 'Src/newRedux/database/topicOrders/selectors';

class SheetView extends Component {
  static propTypes = {
    cardRequirements: PropTypes.object.isRequired,
    cards: PropTypes.array.isRequired,
    columns: PropTypes.array,
    configureColumns: PropTypes.bool,
    subtopics: PropTypes.array.isRequired,
    topic: PropTypes.object,
    createCard: PropTypes.func.isRequired,
    createTopic: PropTypes.func.isRequired,
    selectedTopicOrder: PropTypes.object
  };

  static defaultProps = { columns: [], configureColumns: true };

  state = {
    addCardOrSubtopic: { topicId: null, mode: null },
    columns: this.props.columns,
    expandedTopics: {},
    sortColumn: null,
    sortOrder: 'asc',
    selectedCardId: null,
    yayTitle: '',
    cardTitle: ''
  };

  componentDidMount() {
    this.contentScrollRef.addEventListener('scroll', this.handleContentScroll);

    if (this.props.selectedTopicOrder) {
      let columnOrderFromDb = this.props.selectedTopicOrder.attributes
        .sheet_view_column_order;

      this.setState({ columns: columnOrderFromDb });
    }
  }

  componentWillUnmount() {
    this.contentScrollRef.removeEventListener(
      'scroll',
      this.handleContentScroll
    );
  }

  getTopicSheetColumnStorageId = topicId => `sheet_view_columns_${topicId}`;

  componentDidUpdate = provProps => {
    const topicId = this.props.topic && this.props.topic.id;
    const prevTopicId = provProps.topic && provProps.topic.id;

    if (this.props.configureColumns && topicId && topicId != prevTopicId) {
      const topicColumns = JSON.parse(
        localStorage.getItem(this.getTopicSheetColumnStorageId(topicId))
      );

      //to support legacy
      const genericColumns = JSON.parse(
        localStorage.getItem('sheet_view_columns')
      );

      // Topic Specific  > Generic Columns (same columns for all topics) > show body column by default
      const columns = topicColumns || genericColumns || ['card_body'];
      this.setState({ columns });
    }
  };

  handleAddCardOrSubtopic = (topicId, mode) => {
    this.setState({
      addCardOrSubtopic: { topicId, mode },
      expandedTopics: { ...this.state.expandedTopics, [topicId]: true }
    });
  };

  handleCardCreated = cardId => {
    const elem = document.querySelector('.card-title.c' + cardId);
    scrollToShow(elem, 14, 24);
    this.handleSelectCard(cardId);
  };

  handleAddCardOrSubtopicSubmit = title => {
    const { mode, topicId: parent_id } = this.state.addCardOrSubtopic;

    if (mode === 'card') {
      this.props
        .createCard({
          attributes: { title },
          relationships: { topics: { data: [parent_id] } }
        })
        .then(({ data: { data: newCard } }) => {
          this.handleCardCreated(newCard.id);
        })
        .then(({ data: { data: newCard } }) => {
          if (this.props.cardsSplitScreen) {
            this.props.updateSelectedCard(newCard.id);
          }
        });
    } else {
      this.props.createTopic({ attributes: { title, parent_id } });
    }

    this.setState({ addCardOrSubtopic: { topicId: null, mode: null } });
  };

  handleColumnToggle = column => {
    const columns = this.state.columns.filter(col => col !== column);

    if (columns.length === this.state.columns.length) {
      columns.push(column);
    }

    this.setState({ columns }, () => {
      this.contentScrollRef.scrollLeft =
        this.contentScrollRef.scrollWidth - this.contentScrollRef.offsetWidth;
    });

    const topicId = this.props.topic && this.props.topic.id;
    if (this.props.configureColumns && topicId) {
      // localStorage.setItem('sheet_view_columns', JSON.stringify(columns));
      localStorage.setItem(
        this.getTopicSheetColumnStorageId(topicId),
        JSON.stringify(columns)
      );

      this.props.updateOrCreateTopicOrderOnSheetViewColumnChange({
        topicId,
        columns
      });
    }
  };

  handleContentScroll = ev => {
    requestAnimationFrame(() => {
      const scroll = ev.target.scrollLeft;

      this.footerScrollRef.scrollLeft = scroll;
      this.headerScrollRef.scrollLeft = scroll;
    });
  };

  handleSortToggle = column => {
    this.setState({
      sortColumn: column,
      sortOrder:
        this.state.sortColumn === column
          ? this.state.sortOrder === 'asc'
            ? 'desc'
            : 'asc'
          : 'asc'
    });
  };

  handleTopicExpand = topicId => {
    this.setState({
      expandedTopics: {
        ...this.state.expandedTopics,
        [topicId]: !this.state.expandedTopics[topicId]
      }
    });
  };

  handleSheetViewScroll = event => {
    const scrollLeft = event.target.scrollLeft;
    requestAnimationFrame(() => {
      this.headerScrollRef.style.left = `-${scrollLeft}px`;
      this.headerScrollRef.style.marginLeft = '15px';
    });
  };

  handleSelectCard = cardId => {
    this.setState({ selectedCardId: cardId });
  };

  saveContentRef = ref => (this.contentScrollRef = ref);
  saveFooterRef = ref => (this.footerScrollRef = ref);
  saveHeaderRef = ref => (this.headerScrollRef = ref);

  handleKeyPress = type => async e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const { createTopic, createCard } = this.props;
      const topicId = this.props.topic ? this.props.topic.id : '0';
      if (type === 'yay') {
        await createTopic({
          attributes: {
            title: this.state.yayTitle,
            parent_id: topicId
          }
        });
        this.setState({ yayTitle: '' });
      } else {
        await createCard({
          attributes: { title: this.state.cardTitle },
          relationships: { topics: { data: [topicId] } }
        });
        this.setState({ cardTitle: '' });
      }
    }
  };

  render() {
    const { yayTitle, cardTitle } = this.state;
    const topicId = this.props.topic ? this.props.topic.id : '0';
    const { additionalClasses, active_design } = this.props;

    const { card_font_color } = active_design || {};

    return (
      <div className={`h100 sheet-view-container ${additionalClasses}`}>
        <ActiveFiltersPanel />
        <div className="h100 sheet-view">
          <SheetHeader
            columns={this.state.columns}
            configureColumns={!!this.props.configureColumns}
            scrollContainerRef={this.saveHeaderRef}
            sortColumn={this.state.sortColumn}
            sortOrder={this.state.sortOrder}
            onColumnToggle={this.handleColumnToggle}
            onSortToggle={this.handleSortToggle}
            topic={this.props.topic}
            handleAddCardOrSubtopic={this.handleAddCardOrSubtopic}
            handleCardCreated={this.handleCardCreated}
          />
          <div ref={this.saveContentRef} className="sheet-view__content">
            <div className="sheet-view__grid">
              <SheetTopicSection
                color={card_font_color}
                addCardOrSubtopic={this.state.addCardOrSubtopic}
                cardRequirements={this.props.cardRequirements}
                columns={this.state.columns}
                configureColumns={!!this.props.configureColumns}
                expandedTopics={this.state.expandedTopics}
                level={0}
                showAddCard={
                  this.state.addCardOrSubtopic.topicId === topicId &&
                  this.state.addCardOrSubtopic.mode === 'card'
                }
                showAddSubtopic={
                  this.state.addCardOrSubtopic.topicId === topicId &&
                  this.state.addCardOrSubtopic.mode === 'topic'
                }
                sortColumn={this.state.sortColumn}
                sortOrder={this.state.sortOrder}
                topicId={topicId}
                onAddCardOrSubtopic={this.handleAddCardOrSubtopic}
                onAddCardOrSubtopicSubmit={this.handleAddCardOrSubtopicSubmit}
                onTopicExpand={this.handleTopicExpand}
                cards={this.props.cards}
              />
            </div>
          </div>
          <SheetFooter
            yayTitle={yayTitle}
            cardTitle={cardTitle}
            changeTitle={state => this.setState(state)}
            handleKeyPress={this.handleKeyPress}
            cards={this.props.cards}
            columns={this.state.columns}
            configureColumns={!!this.props.configureColumns}
            scrollContainerRef={this.saveFooterRef}
          />
          <div style={{ flexGrow: 1 }} />
        </div>
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);

  const {
    page: { topicId },
    topics
  } = sm;
  const topic = topicId && topics[topicId];
  const active_design = yayDesign(topicId, topic);

  return {
    active_design,
    selectedTopicOrder: getRelevantTopicOrderForTopic(state, topicId)
  };
};

export default connect(
  mapState,
  { createCard, createTopic, updateOrCreateTopicOrderOnSheetViewColumnChange }
)(SheetView);
