import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { object } from 'prop-types';
import { idFromSlug } from 'Lib/utilities';
import intersection from 'lodash/intersection';
import { dataManager } from 'Src/dataManager/DataManager';

class CardTopicLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topicToLinkTo: null
    };
    this.mounted_ = true;
  }

  async componentDidMount() {
    const {
      card,
      currentTopicId,
      fullPath,
      rootUrl,
      routerHistory,
      topics
    } = this.props;
    const cardTopics =
      card.relationships.topics.data.length > 0
        ? card.relationships.topics.data
        : card.relationships.subtopics.data;

    let topicIdToLinkTo = cardTopics[0];

    if (this.mounted_) {
      this.setState({ topicIdToLinkTo: topicIdToLinkTo });
    }
  }

  componentWillUnmount() {
    this.mounted_ = false;
  }

  render() {
    const {
      card,
      currentTopicId,
      fullPath,
      rootUrl,
      routerHistory,
      style,
      topics
    } = this.props;
    const { topicIdToLinkTo } = this.state;
    const baseUrl = rootUrl == '/' ? rootUrl : rootUrl + '/';
    const topicToLinkTo = topics[topicIdToLinkTo];

    return topicToLinkTo ? (
      // fullPath ? (  TODO: relook at fullPath option once we have a solution to getting all topics down
      //   <div className='card-topic-link_container'>
      //     { topicToLinkTo.attributes.path.map((leg, index) => (
      //       <Link className={`card-topic-link ${ style }`} key={leg.id} to={ `${baseUrl}yays/${ leg.slug }` }  >
      //         {index > 0 ? ` / ${leg.title}` : leg.title}
      //       </Link>
      //     ))}
      //   </div>
      //
      // ) : (
      <Link
        className={`cardTopicTitle card-topic-link full ${style}`}
        to={`${baseUrl}yays/${topicToLinkTo.attributes.slug}`}
      >
        {topicToLinkTo.attributes.title}
      </Link>
    ) : null;
  }
}

CardTopicLink.propTypes = {
  card: object.isRequired,
  topics: object.isRequired
};

const mapState = (state, props) => ({
  currentTopicId: stateMappings(state).page.topicId,
  rootUrl: stateMappings(state).page.rootUrl,
  routerHistory: stateMappings(state).routing.routerHistory,
  topics: stateMappings(state).topics
});

export default connect(mapState)(CardTopicLink);
