import React, { Fragment, PureComponent } from 'react';
import { array } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { getTopic } from 'Src/newRedux/database/topics/thunks';
import LoadingIndicator from 'Components/shared/LoadingIndicator';


class TopicPathContainer extends React.Component {

  state = {
    loading: true
  }

  async componentDidMount() {
    this.mounted_ = true
    const { getTopic, topic, topics } = this.props;
    const path = get( topic, 'attributes.path', [] );
    const asyncCalls = [];
    path.forEach( ancestor => {
      if ( ancestor.id != topic.id && ( !topics[ ancestor.id ] || !topics[ ancestor.id ].relationships ) ) {
        asyncCalls.push( getTopic({ topicSlug: ancestor.slug }) );
      }
    })
    await Promise.all( asyncCalls );
    this.mounted_ && this.setState({ loading: false });
  }


  render() {
    const { props: { renderAncestor, topic, topics }, state: { loading } } = this;
    return loading ? (
      <span>...</span>
    ) : (
      <Fragment>
        { get( topic, 'attributes.path', [] ).map(( ancestor, index ) => (
          renderAncestor( topics[ ancestor.id ], index )
        )) }
      </Fragment>
    )
  }
}


const mapState = ( state, props ) => {
  const sm = stateMappings( state );
  return {
    topics: sm.topics
  }
}

const mapDispatch = {
  getTopic
}


export default connect( mapState, mapDispatch )( TopicPathContainer );
