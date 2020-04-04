import LargeTopicHeader from 'Components/views/header_views/LargeTopicHeader';
import SmallTopicHeader from 'Components/views/header_views/SmallTopicHeader';
import TopicHeader from 'Components/views/header_views/TopicHeader';
import TopicsHeader from 'Components/views/header_views/TopicsHeader';
import UserHeader from 'Components/views/header_views/UserHeader';
import WorkspaceHeader from 'Components/views/header_views/WorkspaceHeader';


const headerViews = {
  WORKSPACE_HOME: {
    key: 'WORKSPACE_HOME',
    name: 'Workspace Home',
    viewComponent: WorkspaceHeader
  },
  LARGE_TOPIC: {
    key: 'LARGE_TOPIC',
    name: 'Large Topic',
    viewComponent: LargeTopicHeader
  },
  SMALL_TOPIC: {
    key: 'SMALL_TOPIC',
    name: 'Small Topic',
    viewComponent: SmallTopicHeader
  },
  TOPIC: {
    key: 'TOPIC',
    name: 'Topic',
    viewComponent: TopicHeader
  },
  TOPICS: {
    key: 'TOPICS',
    name: 'Topics',
    viewComponent: TopicsHeader
  },
  USER: {
    key: 'USER',
    name: 'User',
    viewComponent: UserHeader
  }
};


export default headerViews;
