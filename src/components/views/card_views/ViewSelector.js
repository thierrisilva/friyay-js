import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import cardViews from 'Src/lib/config/views/cards';
import { selectView } from 'Src/newRedux/interface/views/thunks';
import { updateTopic } from 'Src/newRedux/database/topics/thunks';
import Ability from 'Src/lib/ability';
import DomainFormPageActions from 'Src/actions/domain_form_page_actions';
import Icon from 'Components/shared/Icon';
import QSModal from 'Components/pages/quick_setup';
import { createCard } from 'Src/newRedux/database/cards/thunks';

const views = Object.values(cardViews);
const viewTabs = ['Content', 'Planning', 'Database', 'Yay Lists'];

const ViewOptionCard = ({ onSelect, view }) => {
  const imageUrl = `/images/views/${view.previewImage}.png`;

  return (
    <div className="view-selector-card" onClick={() => onSelect(view)}>
      <h4 className="view-selector-card_title">{view.name}</h4>
      <div className="view-selector-card_image-container">
        <img src={imageUrl} className="view-selector-card_image" />
      </div>
      <div className="view-selector-description">{view.description}</div>
    </div>
  );
};

const PlainViewOptionCard = ({ onSelect, view }) => {
  const imageUrl = `/images/views/${view.previewImage}.png`;

  return (
    <div
      className="view-selector-card"
      onClick={() => onSelect(view)}
      style={{ flexDirection: 'row', flex: 1 }}
    >
      <img src={imageUrl} className="view-selector-card_image" />
      <div>
        <h4 className="view-selector-card_title" style={{ textAlign: 'left' }}>
          {view.name}
        </h4>
        <div className="view-selector-description">{view.description}</div>
      </div>
    </div>
  );
};

class ViewSelector extends PureComponent {
  static propTypes = {
    selectView: PropTypes.func,
    topic: PropTypes.object,
    updateTopic: PropTypes.func,
    plainView: PropTypes.bool,
    onUpdateComplete: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedTab: viewTabs[0],
      quickSetup: false
    };

    this.selectView = props.selectView;
  }

  handleClickTab = selectedTab => {
    this.setState({ selectedTab });
  };

  toggleQuickSetup = () => {
    this.setState({ quickSetup: !this.state.quickSetup });
  };

  createNewCard = async topicId => {
    const { createCard } = this.props;
    const attributes = { title: 'Title' };
    const relationships = {
      topics: { data: [topicId] }
    };
    await createCard({ attributes, relationships });
  };

  handleSelectView = async view => {
    const { topic, updateTopic, domain } = this.props;
    const attributes = { default_view_id: view.key };
    this.selectView(view);
    if (topic) {
      const navigationView = ['HEX', 'TILE', 'SMALL_HEX', 'LIST'];
      if (!navigationView.includes(view.key)) {
        await this.createNewCard(topic.id);
      }
      Ability.can('update', 'self', topic) &&
        updateTopic({ id: topic.id, attributes });
    } else {
      DomainFormPageActions.updateDomainDefaultCardView(
        window.currentDomain.id,
        view.key
      );
    }
    onUpdateComplete && onUpdateComplete();
  };

  render() {
    const { selectedTab } = this.state;

    return (
      <div className="view-selector">
        {!this.props.plainView && (
          <Fragment>
            <h4 className="view-selector_title"> Select yay View </h4>
            <div className="view-selector_subtitle">
              {' '}
              Pick a view to use this yay for notes, project planning, knowledge
              base, sheets and more - you can easily change the view later on.
            </div>
          </Fragment>
        )}
        <div className="view-selector-tab-wrapper">
          <div className="view-selector_tab-container">
            {viewTabs.map(tab => (
              <a
                className={cx('view-selector_tab', {
                  selected: selectedTab == tab
                })}
                key={tab}
                onClick={() => this.handleClickTab(tab)}
              >
                <span>{tab}</span>
              </a>
            ))}
          </div>
          {!this.props.plainView && (
            <a
              className="view-selector-tab-right-content"
              onClick={this.toggleQuickSetup}
            >
              <Icon icon="map" />
              Quick Setup
            </a>
          )}
        </div>
        <div className="view-selector_view-list p-y-5px">
          {views
            .filter(
              view =>
                view.category == selectedTab.replace(' ', '_').toLowerCase()
            )
            .map(view => {
              return this.props.plainView ? (
                <PlainViewOptionCard
                  key={view.key}
                  onSelect={this.handleSelectView}
                  view={view}
                />
              ) : (
                <ViewOptionCard
                  key={view.key}
                  onSelect={this.handleSelectView}
                  view={view}
                />
              );
            })}
        </div>
        {this.state.quickSetup && (
          <QSModal
            toggleModal={this.toggleQuickSetup}
            topic={this.props.topic}
          />
        )}
      </div>
    );
  }
}

const mapDispatch = {
  selectView,
  updateTopic,
  createCard
};

export default connect(
  undefined,
  mapDispatch
)(ViewSelector);
