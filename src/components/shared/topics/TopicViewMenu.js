import PropTypes from 'prop-types';
import React from 'react';
import IconButton from 'Src/components/shared/buttons/IconButton';
import RevolvingToggleButton from 'Src/components/shared/buttons/RevolvingToggleButton';

class TopicViewMenu extends React.Component {
  static propTypes = {
    topicViewMode: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onToggleTopicSection: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.onToggleTopicSection = props.onToggleTopicSection;
  }

  /**
   * On click the icon button event handler.
   *
   * @return  {Void}
   */
  handleClickTopicView = () => {
    this.onToggleTopicSection();
  };

  render() {
    const { active, topicViewMode, color } = this.props;
    switch (topicViewMode) {
      case 'SMALL_HEX':
      case 'HEX':
        return (
          <RevolvingToggleButton
            active={active}
            onClick={this.handleClickTopicView}
          />
        );

      case 'ROW':
        return (
          <IconButton
            color={color}
            icon={'label'}
            additionalClasses="current-view"
            additionalIconClasses={active ? 'active' : ''}
            onClick={this.handleClickTopicView}
          />
        );

      case 'LIST':
        return (
          <IconButton
            color={color}
            icon={'view_list'}
            additionalClasses="current-view"
            additionalIconClasses={active ? 'active' : ''}
            onClick={this.handleClickTopicView}
          />
        );

      case 'TILE':
        return (
          <IconButton
            color={color}
            icon={'view_module'}
            additionalClasses="current-view"
            additionalIconClasses={active ? 'active' : ''}
            onClick={this.handleClickTopicView}
          />
        );

      case 'SIMPLE_TILE':
        return (
          <IconButton
            color={color}
            icon={'view_module'}
            additionalClasses="current-view"
            additionalIconClasses={active ? 'active' : ''}
            onClick={this.handleClickTopicView}
          />
        );

      default:
        break;
    }
  }
}

export default TopicViewMenu;
