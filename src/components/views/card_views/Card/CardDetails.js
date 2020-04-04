import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
// import CardDetailsFooter from './item_content/item_content_footer';
import Ability from 'Lib/ability';

import { stateMappings } from 'Src/newRedux/stateMappings';
import CommentsList from 'Components/shared/comments/CommentsList';
import CardDetailsEditor from './CardDetailsEditor';
import CardDetailsPreview from './CardDetailsPreview';
import CardPrintLayout from './CardPrintLayout';

const handleItemPrintClick = () => window.print();

class CardDetails extends Component {
  static propTypes = {
    onEditorScroll: PropTypes.func,
    rootContainerClass: PropTypes.string,
    autoSaveOnClose: PropTypes.bool,
    setShowSaveinBack: PropTypes.func
  };

  static defaultProps = {
    inEditMode: false,
    showIcons: true,
    showTitle: true,
    initialCard: false
  };

  constructor(props) {
    super(props);
    const { inEditMode, showIcons, showTitle, initialCard } = props;
    this.state = {
      inEditMode,
      showIcons,
      showTitle,
      initialCard,
      hideComments: true
    };

    this.onEditorScroll = props.onEditorScroll;
  }

  componentDidUpdate = prevProps => {
    const { card, rootContainerClass } = this.props;
    const { inEditMode } = this.state;

    if (inEditMode) {
      // Performance reason, don't query the DOM if `this.toolbarEl` already defined.
      this.toolbarEl =
        this.toolbarEl ||
        document.querySelector(
          `.${rootContainerClass} .card-details .card-details-editor .fr-toolbar`
        );
    } else {
      this.toolbarEl = null;
    }

    // If selected card changed
    if (card && card.id !== prevProps.cardId) {
      // Scroll card details to the top
      const cardDetailRootEl = document.getElementsByClassName(
        'card-details'
      )[0];
      cardDetailRootEl.scroll({
        top: 0,
        behavior: 'smooth'
      });

      this.setState({
        inEditMode: false
      });
    }
  };

  /**
   * On scroll event handler.
   *
   * @param {Event} e
   * @return  {Void}
   */
  handleScroll = e => {
    const { inEditMode } = this.state;
    const { rootContainerClass } = this.props;
    const toolbarEl = this.toolbarEl;

    if (!inEditMode || !rootContainerClass) {
      return;
    }

    // Don't execute default scroll event handler if handler props already defined
    if (this.onEditorScroll) {
      this.onEditorScroll(e, this.toolbarEl);
      return; // halt!
    }

    // Default scroll event handler
    if (e.currentTarget.scrollTop >= 199) {
      if (toolbarEl && !toolbarEl.classList.contains('fixed')) {
        toolbarEl.classList.add('fixed');
      }
    } else {
      if (toolbarEl && toolbarEl.classList.contains('fixed')) {
        toolbarEl.classList.remove('fixed');
      }
    }
  };

  handleToggleEditMode = () => {
    const { originalTip, updateCardVersion } = this.props;
    this.setState(state => ({ inEditMode: !state.inEditMode }));
    if (!this.state.inEditMode && originalTip) {
      updateCardVersion(originalTip);
    }
  };

  handleShowHide = () => {
    const { showIcons: showIconState, showTitle: showTitleState } = this.state;
    const hideComments =
      showIconState === true ? true : this.state.hideComments;
    this.setState({
      showIcons: !showIconState,
      showTitle: !showTitleState,
      hideComments
    });
  };

  setShowSaveinBack = show => {
    if (this.props.setShowSaveinBack) {
      if (show === true) {
        if (this.props.autoSaveOnClose === true) {
          this.props.setShowSaveinBack(show);
        }
      } else {
        this.props.setShowSaveinBack(show);
      }
    }
  };

  cloneTip = (card, originalTip) => {
    let deepClonedTip;
    if (card) deepClonedTip = cloneDeep(card);
    if (deepClonedTip && deepClonedTip.attributes && originalTip) {
      deepClonedTip.attributes.body = originalTip.body;
      deepClonedTip.attributes.title = originalTip.title;
      return deepClonedTip;
    }
  };

  toggleComments = () => {
    this.setState(({ hideComments }) => ({ hideComments: !hideComments }));
  };

  render() {
    const {
      card,
      showMinMax,
      autoSaveOnClose,
      updateDefaultTip,
      hideUploader,
      showDots
    } = this.props;
    const {
      inEditMode,
      hideComments,
      showIcons,
      showTitle,
      initialCard
    } = this.state;

    let deepClonedTip = this.cloneTip(card, this.props.originalTip);
    if (!deepClonedTip) deepClonedTip = card;

    return card ? (
      <div className="card-details" onScroll={this.handleScroll}>
        {inEditMode ? (
          <CardDetailsEditor
            card={deepClonedTip}
            onToggleEditMode={this.handleToggleEditMode}
            showMinMax={showMinMax}
            autoSaveOnClose={autoSaveOnClose}
            initialCard={initialCard}
            setShowSaveinBack={this.setShowSaveinBack}
            updateDefaultTip={updateDefaultTip}
            hideUploader={hideUploader}
            hideLinker
            hideCancel
            hideTitle={!showTitle}
            showDots={showDots}
          />
        ) : (
          <Fragment>
            <CardDetailsPreview
              card={card}
              onDoubleClick={this.handleToggleEditMode}
              showMinMax={showMinMax}
              showTitle={showTitle}
              showIcons={showIcons}
              handleShowHide={this.handleShowHide}
              toggleComments={this.toggleComments}
              hideComments={this.state.hideComments}
              showDots={showDots}
            />
            {!hideComments && (
              <CommentsList
                cardId={card.id}
                hideComments={this.state.hideComments}
              />
            )}
          </Fragment>
        )}
        <CardPrintLayout card={card} />
      </div>
    ) : (
      <div />
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    card: sm.cards[props.cardId],
    inEditMode: sm.page.cardEditMode
  };
};

export default connect(mapState)(CardDetails);
