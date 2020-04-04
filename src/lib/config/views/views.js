import cards from './cards';
import headers from './headers';
import topics from './topics';

const viewConfig = {
  cards,
  headers,
  topics
};

export default viewConfig;

const filterForPage = (cards, page) => {
  const values = Object.values(cards);
  values.filter(v => v.disabledPages && v.disabledPages.indexOf('home') > -1);
};
export const pageViewMappings = {
  home: viewConfig.cards,
  topic: viewConfig.cards,
  topics: viewConfig.topics,
  user: viewConfig.cards,
  users: {}
};
