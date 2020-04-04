import React, { Fragment, PureComponent } from 'react';
import Icon from 'Components/shared/Icon';
import { toggleSubtopicPanel } from 'Src/newRedux/interface/views/thunks';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import AddSubtopicCard from 'Components/shared/topics/AddSubtopicCard';
import { scrollToShow } from 'Src/lib/utilities';
import { connect } from 'react-redux';
import { createCard } from 'Src/newRedux/database/cards/thunks';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import { AddCardButton } from 'Components/shared/buttons/index';
import { stateMappings } from 'Src/newRedux/stateMappings';

class AddCardOrSubtopic extends PureComponent {
  myRef = React.createRef();
  state = {
    addCardMode: false,
    addSubtopicMode: false,
    visible: false,
    isSaving: false
  };

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  createNewCard = topicId => {
    setTimeout(async () => {
      this.setState({ isSaving: true });
      const { createTextCard } = this.props;
      const attributes = { title: 'Title' };
      const relationships = {
        topics: { data: [topicId] }
      };
      const newCard = await createTextCard({ attributes, relationships });
      document.querySelector('.c' + newCard.data.data.id).scrollIntoView();
      this.setState({ isSaving: false, visible: false });
    });
  };

  handleClickOutside = e => {
    if (this.myRef.current && !this.myRef.current.contains(e.target)) {
      this.setState({
        addCardMode: false,
        addSubtopicMode: false,
        visible: false
      });
    }
  };

  handleCardWasCreated = cardId => {
    this.handleDismissAddCard();
    this.props.afterCardCreated
      ? this.props.afterCardCreated(cardId)
      : scrollToShow(document.querySelector('.c' + cardId), 14, 24);
  };

  handleDismissAddCard = () => {
    this.setState({ addCardMode: false, visible: false });
  };

  handleDismissAddSubtopic = () => {
    this.setState({ addSubtopicMode: false, visible: false });
  };

  handleShowAddCard = () => {
    setTimeout(() => {
      this.setState({ addCardMode: true, addSubtopicMode: false });
    });
  };

  handleShowAddTextCard = () => {
    this.createNewCard(this.props.topic.id);
  };

  handleShowAddSubtopic = () => {
    setTimeout(() => {
      this.setState({ addSubtopicMode: true, addCardMode: false });
    });
  };

  handleTopicWasCreated = () => {
    this.handleDismissAddSubtopic();
    this.props.toggleSubtopicPanel &&
    this.props.cardView.view !== 'WIKI' &&
    !this.props.cardView.subtopic_panel_visible
      ? this.props.toggleSubtopicPanel(this.props.topic)
      : this.scrollToShow(
          document.querySelector('.t' + this.props.topic.id),
          18,
          26
        );
  };

  render() {
    const {
      displayAddCardButton,
      displayAddSubtopicButton,
      showAddTextCard,
      showUploadFileCard,
      color,
      ...childProps
    } = this.props;
    const { addCardMode, addSubtopicMode, visible, isSaving } = this.state;

    return (
      <div
        ref={this.myRef}
        className={`add-card-or-subtopic dropdown ${visible ? 'open' : ''}`}
      >
        <a
          className="dropdown-toggle add-card-or-subtopic_button"
          onClick={() => {
            this.setState(state => {
              return {
                visible: !state.visible,
                addCardMode: false,
                addSubtopicMode: false
              };
            });
          }}
        >
          <Icon color={color ? color : '#6FCF97'} icon="add" />
        </a>
        <ul className="dropdown-menu" id="domain-dropdown">
          {isSaving ? (
            <LoadingIndicator />
          ) : (
            <Fragment>
              <li>
                {addSubtopicMode && (
                  <Fragment>
                    <p className="dropdown-menu-title">Create yay</p>
                    <AddSubtopicCard
                      {...childProps}
                      afterTopicCreated={this.handleTopicWasCreated}
                      inInputMode={true}
                      onDismiss={this.handleDismissAddSubtopic}
                      parentTopicId={
                        childProps.topic ? childProps.topic.id : null
                      }
                    />
                  </Fragment>
                )}
              </li>
              <li>
                {addCardMode && (
                  <Fragment>
                    <p className="dropdown-menu-title">Create Card</p>
                    <AddCardCard
                      {...childProps}
                      afterCardCreated={this.handleCardWasCreated}
                      inInputMode={true}
                      onDismiss={this.handleDismissAddCard}
                      topMenu={true}
                    />
                  </Fragment>
                )}
              </li>
              {!addCardMode && !addSubtopicMode && (
                <Fragment>
                  <li>
                    {showUploadFileCard && childProps.topic && (
                      <a>
                        <AddCardButton
                          openFileUploader
                          topic={childProps.topic}
                          buttonText={
                            <Fragment>
                              <p className="dropdown-menu-title">Upload File</p>
                              <p className="dropdown-menu-description">
                                Add a file to the card.
                              </p>
                            </Fragment>
                          }
                        />
                      </a>
                    )}
                  </li>
                  <li>
                    {showAddTextCard && childProps.topic && (
                      <a onClick={this.handleShowAddTextCard}>
                        <p className="dropdown-menu-title">Text Card</p>
                        <p className="dropdown-menu-description">
                          Card as a Text Block with editor (title is hidden):
                        </p>
                      </a>
                    )}
                  </li>
                  <li>
                    {displayAddCardButton && childProps.topic && (
                      <a onClick={this.handleShowAddCard}>
                        <p className="dropdown-menu-title">Card</p>
                        <p className="dropdown-menu-description">
                          For a note, task, knowledge page, sharing file, images
                          and more
                        </p>
                      </a>
                    )}
                  </li>
                  <li>
                    {displayAddSubtopicButton && (
                      <a onClick={this.handleShowAddSubtopic}>
                        <p className="dropdown-menu-title">yay</p>
                        <p className="dropdown-menu-description">
                          For creating and organizing lists of cards
                        </p>
                      </a>
                    )}
                  </li>
                </Fragment>
              )}
            </Fragment>
          )}
        </ul>
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const { user, page } = sm;
  const uiSettings = user.attributes.ui_settings;
  const myTopicsView = uiSettings.my_topics_view.find(
    view => view.id === page.topicId
  );

  return {
    cardView: myTopicsView && myTopicsView
  };
};

const mapDispatch = {
  toggleSubtopicPanel,
  createTextCard: createCard
};

export default connect(
  mapState,
  mapDispatch
)(AddCardOrSubtopic);
