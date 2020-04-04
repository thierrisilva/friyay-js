/* global vex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import CardDetails from 'Components/views/card_views/Card/CardDetails';
import DMLoader from 'Src/dataManager/components/DMLoader';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';

class BasicView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTree: true,
      showIcons: false,
      showTitle: false,
      inEditMode: false
    };
  }

  /**
   * On editor scrolling event handler.
   *
   * @param {Event} e
   * @param {Node}  toolbarEl
   * @return  {Void}
   */
  handleEditorScroll = (e, toolbarEl) => {
    if (!toolbarEl || !toolbarEl.classList) {
      return;
    }
    const isToolBarHaveFixedClass = toolbarEl.classList.contains('fixed');
    // 191px is when the first line of text gone from view port while scrolling
    if (
      e.currentTarget.scrollTop >= 191 &&
      toolbarEl &&
      !isToolBarHaveFixedClass
    ) {
      toolbarEl.classList.add('fixed');
    } else if (toolbarEl && isToolBarHaveFixedClass) {
      toolbarEl.classList.remove('fixed');
    }
  };

  render() {
    const { cards, cardRequirements } = this.props;
    const { displayTree, showIcons, showTitle, inEditMode } = this.state;

    return (
      <div className="basic-view relative">
        <ActiveFiltersPanel />
        <div className="basic-view-container">
          {cards && cards.length
            ? cards.map(card => (
                <div
                  key={card.id}
                  className={`basic-view_content-container c${card.id} ${
                    displayTree ? 'tree-shown' : 'tree-hidden'
                  }`}
                >
                  <CardDetails
                    cardId={card.id}
                    onEditorScroll={this.handleEditorScroll}
                    rootContainerClass="basic-view"
                    showMinMax
                    showIcons={showIcons}
                    showTitle={showTitle}
                    inEditMode={inEditMode}
                    hideUploader
                  />
                </div>
              ))
            : ''}
          <DMLoader
            dataRequirements={{
              cardsWithAttributes: { attributes: cardRequirements }
            }}
            loaderKey="cardsWithAttributes"
          />
        </div>
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const topicId = sm.page.topicId;

  return {
    topicId,
    topic: sm.topics[topicId]
  };
};

export default connect(mapState)(BasicView);
