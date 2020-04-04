import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Ability from 'Lib/ability';
import { stateMappings } from 'Src/newRedux/stateMappings';
import {
  initiateDeleteTopicDialog,
  initiateMoveTopicDialog
} from 'Src/newRedux/database/topics/abstractions';
import {
  toggleStarTopic,
  toggleFollowTopic,
  toggleHideCards,
  isCardsHidden
} from 'Src/newRedux/database/topics/thunks';
import { setUpdateTopicModalOpen } from 'Src/newRedux/interface/modals/actions';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import OptionsDropdownButton from 'Components/shared/buttons/OptionsDropdownButton';
import FilePickerUpload from 'Src/components/shared/FilePickerUpload';
import QSModal from 'Components/pages/quick_setup';
import { yayDesign } from 'Src/lib/utilities';

class TopicActionsDropdown extends PureComponent {
  static propTypes = {
    userFollowsTopic: PropTypes.bool,
    withoutAddImage: PropTypes.bool,
    initiateDeleteTopicDialog: PropTypes.func,
    initiateMoveTopicDialog: PropTypes.func,
    toggleStarTopic: PropTypes.func,
    toggleFollowTopic: PropTypes.func,
    setUpdateTopicModalOpen: PropTypes.func,
    toggleHideCards: PropTypes.func,
    onRenameTopicSelected: PropTypes.func,
    isCardsHidden: PropTypes.func,
    addNewTopic: PropTypes.func,
    toggleShowFilePicker: PropTypes.func,
    setRightMenuOpenForMenu: PropTypes.func,
    topic: PropTypes.any,
    children: PropTypes.node,
    icon: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      filePickerShown: false,
      quickSetup: false
    };
  }

  getTopics() {
    const { topic } = this.props;
    const adminOptions = {
      settings: {
        text: 'Settings',
        onClick: () => this.props.setUpdateTopicModalOpen(topic.id, true)
      },
      rename: { text: 'Rename', onClick: this.props.onRenameTopicSelected },
      move: {
        text: 'Move',
        onClick: () => this.props.initiateMoveTopicDialog(topic.id)
      },
      delete: {
        text: 'Delete',
        onClick: () => this.props.initiateDeleteTopicDialog(topic.id)
      },
      showCard: {
        text: 'Show Card Block',
        onClick: () => this.props.toggleHideCards(topic)
      },
      quickSetup: {
        text: 'Quick Setup',
        onClick: this.toggleQuickSetup
      },
      hideCard: {
        text: 'Hide Card Block',
        onClick: () => this.props.toggleHideCards(topic)
      },
      share: {
        text: 'Share',
        onClick: () => this.props.setUpdateTopicModalOpen(topic.id, true, 1)
      },
      addImage: { text: 'Add Image', onClick: this.toggleShowFilePicker }
    };
    const options = {
      star: {
        text: 'Star',
        onClick: () => this.props.toggleStarTopic(topic.id)
      },
      unStar: {
        text: 'Unstar',
        onClick: () => this.props.toggleStarTopic(topic.id)
      },
      follow: {
        text: 'Follow',
        onClick: () => this.props.toggleFollowTopic(topic.id)
      },
      unFollow: {
        text: 'Unfollow',
        onClick: () => this.props.toggleFollowTopic(topic.id)
      },
      selectView: {
        text: 'Select View',
        onClick: () => this.props.setRightMenuOpenForMenu('Views')
      },
      selectFilter: {
        text: 'Select Filter',
        onClick: () => this.props.setRightMenuOpenForMenu('Filters')
      },
      selectOrder: {
        text: 'Select Order',
        onClick: () => this.props.setRightMenuOpenForMenu('Orders')
      },
      addYay: {
        text: 'Add yay',
        onClick: this.props.addNewTopic
      }
    };
    return { adminOptions, options };
  }

  toggleShowFilePicker = () => {
    const { filePickerShown } = this.state;
    this.setState({
      filePickerShown: !filePickerShown
    });
  };

  toggleQuickSetup = () => {
    this.setState({ quickSetup: !this.state.quickSetup });
  };

  handleFilePickerClose = () => {
    this.setState({
      filePickerShown: false
    });
  };

  render() {
    const {
      children,
      className,
      icon,
      topic,
      userFollowsTopic,
      withoutAddImage,
      color,
      ...restProps
    } = this.props;

    const { filePickerShown, quickSetup } = this.state;
    const { adminOptions, options } = this.getTopics();
    const cardsHidden = restProps.isCardsHidden(topic);

    const optionForAdmin = Object.keys(adminOptions);
    optionForAdmin.splice(
      optionForAdmin.indexOf(cardsHidden ? 'hideCard' : 'showCard'),
      1
    );
    if (withoutAddImage) {
      optionForAdmin.splice(optionForAdmin.indexOf('addImage', 1), 1);
    }

    const defaultOptions = Object.keys(options);
    defaultOptions.splice(
      defaultOptions.indexOf(
        topic.attributes.starred_by_current_user ? 'star' : 'unStar'
      ),
      1
    );
    defaultOptions.splice(
      defaultOptions.indexOf(userFollowsTopic ? 'follow' : 'unFollow'),
      1
    );

    return (
      <OptionsDropdownButton
        className={className}
        icon={icon}
        color={color}
        additionalClasses={'dark-grey-icon-button'}
      >
        <div className="dropdown-option-title">yay Options</div>
        {Ability.can('update', 'self', topic) &&
          optionForAdmin.map(key => (
            <a
              className="dropdown-option-item"
              key={key}
              onClick={adminOptions[key].onClick}
            >
              {adminOptions[key].text}
            </a>
          ))}
        {defaultOptions.map(key => (
          <a
            className="dropdown-option-item"
            key={key}
            onClick={options[key].onClick}
          >
            {options[key].text}
          </a>
        ))}
        {children}
        {filePickerShown && (
          <FilePickerUpload
            topic={topic}
            onClose={this.handleFilePickerClose}
          />
        )}
        {quickSetup && (
          <QSModal toggleModal={this.toggleQuickSetup} topic={topic} />
        )}
      </OptionsDropdownButton>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const { user, page, topics } = sm;
  const active_design = yayDesign(page.topicId, topics[page.topicId]);

  const userFollowedTopics = user.relationships.following_topics.data;

  return {
    active_design,
    userFollowsTopic: userFollowedTopics.includes(props.topic.id)
  };
};

const mapDispatch = {
  initiateDeleteTopicDialog,
  initiateMoveTopicDialog,
  toggleStarTopic,
  toggleFollowTopic,
  setUpdateTopicModalOpen,
  toggleHideCards,
  isCardsHidden,
  setRightMenuOpenForMenu
};

export default connect(
  mapState,
  mapDispatch
)(TopicActionsDropdown);
