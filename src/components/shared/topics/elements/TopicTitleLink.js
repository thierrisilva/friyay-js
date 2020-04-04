import React from 'react';
import { connect } from 'react-redux';
import { func, object, string } from 'prop-types';
import Dotdotdot from 'react-dotdotdot';
import { viewTopic } from 'Src/newRedux/database/topics/thunks';

const TopicTitleLink = ({ additionalClasses = '', maxLines = 1, onClick, size = '', topic, viewTopic }) => {

  const handleViewTopic = () => {
    onClick
      ? onClick()
      : viewTopic({ topicSlug: topic.attributes.slug });
  }

  return (
      <a className={`card-title ${ size } ${ additionalClasses }`} onClick={ handleViewTopic }  >
        <Dotdotdot clamp={ maxLines }>
          {topic.attributes.title}
        </Dotdotdot>
      </a>
  )
}



TopicTitleLink.propTypes = {
  size: string,
  topic: object.isRequired,
  viewTopic: func.isRequired
};

const mapDispatch = {
  viewTopic,
}

export default connect( undefined, mapDispatch )( TopicTitleLink );
