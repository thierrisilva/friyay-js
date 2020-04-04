import HexView from 'Components/views/topic_views/Hex/HexView';
import SmallHexView from 'Components/views/topic_views/Small_Hex/SmallHexView';
import SmallTilesView from 'Components/views/topic_views/Tile/SmallTiles';
import TopicListView from 'Components/views/topic_views/List/TopicListView';
import RowView from "Components/views/topic_views/Row";


const topicViews = {
  HEX: {
    key: 'HEX',
    name: 'Hex',
    icon: 'topic',
    category: 'topic',
    viewComponent: HexView, //put your view component here
    defaultConfig: {
      header: false,
      topic: 'HEX',
      card: false
    }
  },
  TILE: {
    key: 'TILE',
    name: 'Tile',
    icon: 'view_module',
    category: 'topic',
    viewComponent: SmallTilesView, //put your view component here
    defaultConfig: {
      header: false,
      topic: 'TILE',
      card: false
    }
  },
  SMALL_HEX: {
    key: 'SMALL_HEX',
    name: 'Small Hex',
    icon: 'view_module',
    category: 'topic',
    viewComponent: SmallHexView, //put your view component here
    defaultConfig: {
      header: false,
      topic: 'SMALL_HEX',
      card: false
    }
  },
  LIST: {
    key: 'LIST',
    name: 'List',
    icon: 'view_stream',
    category: 'topic',
    viewComponent: TopicListView, //put your view component here
    defaultConfig: {
      header: false,
      topic: 'LIST',
      card: false
    }
  },
  ROW: {
    key: 'ROW',
    name: 'Row',
    icon: 'label',
    category: 'topic',
    viewComponent: RowView, //put your view component here
    defaultConfig: {
      header: false,
      topic: 'ROW',
      card: false
    }
  }
}


export default topicViews;
