import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withLastLocation } from 'react-router-last-location';
import Loader from '../shared/Loader';
import { idFromSlug } from 'Lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';
import {
  getCard,
  archiveCard,
  removeCard,
  updateCard,
  viewCard,
  updateCardVersion,
  getTipVersions
} from 'Src/newRedux/database/cards/thunks';
import { addCardToDock } from 'Src/newRedux/interface/dock/thunks';
import CardDetails from 'Src/components/views/card_views/Card/CardDetails';
import { IconButton } from 'Src/components/shared/buttons/index';
import CardTopicLink from 'Src/components/shared/cards/elements/CardTopicLink';
import Icon from 'Src/components/shared/Icon';
import CardVersion from './CardVersion';

class ItemPage extends Component {
  mounted_ = false;

  static propTypes = {
    routerHistory: PropTypes.object.isRequired,
    lastLocation: PropTypes.object,
    tip: PropTypes.object
  };

  hasError = false;

  constructor(props) {
    super(props);
    this.state = {
      displayRelatedItems: false,
      isEditing: false,
      isLoading: true,
      isRelated: false,
      itemId: idFromSlug(props.match.params.cardSlug),
      itemSlug: props.match.params.cardSlug,
      editActiveFromCardForm: false,
      action: null,
      showVersionLogTab: false,
      tip: props.tip,
      defaultTip: null,
      versions: props.tip ? props.tip.relationships.versions.data : [],
      showSaveinBack: false,
      originalTip: null
    };

    this.getCard = props.getCard;
    this.getTipVersions = props.getTipVersions;
    this.changeTipByVersion = this.changeTipByVersion.bind(this);
  }

  componentDidMount = async () => {
    const { tip, match } = this.props;
    document.addEventListener('keydown', this.handleKeyDown);

    if (!tip) {
      (async () => {
        try {
          await this.getCard(match.params.cardSlug);
        } catch (ex) {
          console.error(ex);
        }
      })();
    }
  };

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * On click back button event handler.
   *
   * @param {Event} e
   * @return  {Void}
   */
  handleClickBack = e => {
    if (this.state.defaultTip)
      this.props.updateCardVersion(this.state.defaultTip);
    e.preventDefault();
    this.back();
  };

  handleKeyDown = e => {
    if (e.key == 'Escape' || e.keyCode == 27) {
      this.back();
    }
  };

  handleMinimizeCard = () => {
    const { addCardToDock, match } = this.props;
    const containerEl = document.getElementsByClassName(
      'card-page-container'
    )[0];
    containerEl.classList.add('minimized');
    if (this.state.defaultTip)
      this.props.updateCardVersion(this.state.defaultTip);

    // Wait for animation to be done
    setTimeout(() => {
      containerEl.classList.add('disappear');
      addCardToDock(idFromSlug(match.params.cardSlug));
      this.back();
    }, 433);
  };

  handleToggleRelatedItems = () => {
    this.setState(state => ({
      displayRelatedItems: !state.displayRelatedItems
    }));
  };

  /**
   * Back to last location.
   *
   * @return  {Void}
   */
  back = () => {
    const { routerHistory, lastLocation } = this.props;

    lastLocation
      ? routerHistory.push(lastLocation.pathname)
      : routerHistory.push('/');
  };

  toggleCardVersions = async () => {
    const showVersionLogTab = !this.state.showVersionLogTab;
    this.setState({ showVersionLogTab });
    if (showVersionLogTab) {
      this.setState({ defaultTip: this.props.tip });
      if (this.state.versions.length == 0) {
        const serverVersions = await this.getTipVersions(
          this.props.tip.attributes.slug
        );
        this.setState({
          versions: serverVersions
        });
      }
    } else {
      this.props.updateCardVersion(this.state.defaultTip);
      this.setState(prevState => ({
        originalTip: null
      }));
    }
  };

  updateDefaultTip = card => {
    this.setState({ defaultTip: card });
  };

  componentDidUpdate = prevProps => {
    const { tip } = this.props;
    if (tip == null) {
      return;
    } else if (tip !== prevProps.tip) {
      this.setState({
        tip,
        versions: tip.relationships.versions.data
      });
    }
  };

  changeTipByVersion(versionId) {
    const { versions, tip } = this.state;
    const version = versions.find(version => version.id === versionId);
    this.setState(prevState => ({
      originalTip: version.tip
    }));
    const { title, body } = version.previous_tip;
    const deepClonedTip = cloneDeep(tip);
    deepClonedTip.attributes.body = body;
    deepClonedTip.attributes.title = title;
    this.props.updateCardVersion(deepClonedTip);
  }

  setShowSaveinBack = showSaveinBack => {
    this.setState({ showSaveinBack });
  };

  render() {
    const { tip, versions, showVersionLogTab, originalTip } = this.state;
    let icon_btn_class = !this.state.showVersionLogTab
      ? 'right-140 medium grey-link'
      : 'right-140 medium yellow-link';
    return tip ? (
      <div className="card-page-container">
        <div className="card-nav">
          <a href="#" className="card-back" onClick={this.handleClickBack}>
            <Icon icon="chevron_left" additionalClasses="medium" />
            Back{this.state.showSaveinBack && <small> & Save</small>}
          </a>
          <CardTopicLink card={tip} fullPath />
        </div>
        <div className="icons-wrapper">
          <IconButton
            fontAwesome
            icon="minus"
            additionalClasses="medium grey-link"
            onClick={this.handleMinimizeCard}
          />
          <IconButton
            fontAwesome
            icon="clock-o"
            additionalClasses={icon_btn_class}
            onClick={this.toggleCardVersions}
          />
        </div>

        <CardDetails
          cardId={tip.id}
          card={tip}
          rootContainerClass="card-page-container"
          autoSaveOnClose={true}
          setShowSaveinBack={this.setShowSaveinBack}
          updateCardVersion={this.props.updateCardVersion}
          originalTip={this.state.originalTip}
          updateDefaultTip={this.updateDefaultTip}
          showDots
        />
        {versions != undefined && versions.length > 0 ? (
          <CardVersion
            versions={versions}
            toggleCardVersions={this.toggleCardVersions}
            showComponent={showVersionLogTab}
            changeTipByVersion={this.changeTipByVersion}
          />
        ) : null}
      </div>
    ) : (
      <div className="card-page-container" style={{ display: 'inline-block' }}>
        <Loader isLoading />
      </div>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    page: sm.page.page,
    tip: sm.cards[idFromSlug(props.match.params.cardSlug)] || null,
    tips: sm.cards,
    routerHistory: sm.routing.routerHistory
  };
};

const mapDispatch = {
  addCardToDock,
  archiveCard,
  getCard,
  removeCard,
  updateCard,
  viewCard,
  updateCardVersion,
  getTipVersions
};

export default withRouter(
  withLastLocation(
    connect(
      mapState,
      mapDispatch
    )(ItemPage)
  )
);
