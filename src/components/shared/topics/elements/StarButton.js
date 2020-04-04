import React, { Component } from 'react';
import { object, func, string } from 'prop-types';
import { connect } from 'react-redux';
import { toggleStarTopic } from 'Src/newRedux/database/topics/thunks';
import IconButton from 'Components/shared/buttons/IconButton';

class StarButton extends Component {
  static propTypes = {
    topic: object.isRequired,
    toggleStarTopic: func.isRequired,
    color: string
  };

  render() {
    const { toggleStarTopic, topic, color } = this.props;
    const { starred_by_current_user } = topic.attributes;
    const starredColor = starred_by_current_user && (color ? color : '#6FCF97');

    return (
      <IconButton
        additionalClasses={'dark-grey-icon-button'}
        icon="star"
        color={starredColor}
        onClick={() => {
          toggleStarTopic(topic.id);
        }}
      />
    );
  }
}

const mapDispatch = {
  toggleStarTopic
};

export default connect(
  undefined,
  mapDispatch
)(StarButton);
