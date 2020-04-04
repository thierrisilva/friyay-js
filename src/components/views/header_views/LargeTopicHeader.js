import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { string, object, oneOfType, func, bool } from 'prop-types';
import Ability from 'Lib/ability';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { setLeftSubtopicMenuOpenForTopic } from 'Src/newRedux/interface/menus/actions';

import ButtonMenuOpenDismiss from 'Components/shared/buttons/ButtonMenuOpenDismiss';
import StarButton from '../../shared/topics/elements/StarButton';
import FollowButton from '../../shared/topics/elements/FollowButton';
import SettingsButton from '../../shared/topics/elements/SettingsButton';
import withDataManager from 'Src/dataManager/components/withDataManager';

import LoadingIndicator from 'Components/shared/LoadingIndicator';

class TopicHeader extends Component {

  static propTypes = {
    topic: object,
    displayLeftSubtopicMenuForTopic: oneOfType([ string, bool ]),
    setLeftSubtopicMenuOpenForTopic: func.isRequired
  }

  render(){
    const { dmLoading, topic, displayLeftSubtopicMenuForTopic } = this.props;

    return (
      <header className="large-topic-header">
        { topic ?
          (
            <Fragment>
              <div className="large-topic-header_title-container">

                <h1 className="large-topic-header_title">
                  { topic.attributes.title }
                </h1>
                <div className="header-actions">
                  { Ability.can('update', 'self', topic) &&
                      <SettingsButton topic={topic}/> }
                  <StarButton topic={topic} />
                  <FollowButton topic={topic} />
                </div>
              </div>
              { topic.attributes.description && (
                <div className="row">
                  <h4 className="text-center text-muted">
                    { topic.attributes.description }
                  </h4>
                </div>
              )}
            </Fragment>
          ) : (
            <LoadingIndicator />
          )
        }

      </header>
    );
  }
}


const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    displayLeftSubtopicMenuForTopic: sm.menus.displayLeftSubtopicMenuForTopic,
    // topic: sm.topics[ sm.page.topicId ],
    // topicId: sm.page.topicId,
  }
}

const mapDispatch = {
  setLeftSubtopicMenuOpenForTopic
}

// const dataRequirements = ( props ) => ({
//   topic: { topicId: props.topicId },
// });


export default connect( mapState, mapDispatch )( TopicHeader );
