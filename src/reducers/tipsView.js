import { switchcaseF } from './utils';
import {
  TOGGLE_TOPIC_OPTIONS,
  SET_ALL_TOPICS_VIEW,
  TOGGLE_HEX_GRID,
  GET_VIEWS,
  SET_UI_SETTINGS,
  SELECT_VIEW,
  SELECT_TOPIC_VIEW
} from 'AppConstants';
import { VIEWS_ENUM as VIEWS } from 'Enums';
import {
  ifElse,
  always,
  not,
  compose,
  isNil,
  T,
  propEq,
  lensProp,
  view,
  find,
  and,
  is
} from 'ramda';

const notNil = compose(not, isNil);
const getUiSettingsFor = key =>
  compose(
    ifElse(notNil, view(lensProp('value')), always(null)),
    find(propEq('key', key))
  );

const getUiAllTopicsView = getUiSettingsFor('all_topics_view');
const getUiMyTopicsView = getUiSettingsFor('my_topics_view');
const getUiTipsView = getUiSettingsFor('tips_view');
const getUiHexPanel = getUiSettingsFor('hex_panel');
const defaultView = JSON.parse(localStorage.getItem('tipsView'));
const isValid = match => and(is(Object)(match), notNil(match));
const getParsed = compose(JSON.parse, key => localStorage.getItem(key));
const getValueOrTrue = ifElse(compose(notNil, getParsed), getParsed, T);
const getValueOrNull = ifElse(
  compose(isValid, getParsed),
  getParsed,
  always(null)
);
const getValueOrEmptyArray = ifElse(
  compose(isValid, getParsed),
  getParsed,
  always([])
);

const oldReferences = {
  grid: 1,
  small_grid: 2,
  list: 3,
  task: 5,
  card_panel: 8
};

// Migrate old tips view content
// TODO: move this into app start
const cardsView = localStorage.getItem('view');
if (cardsView !== null) {
  const ref = oldReferences[cardsView];
  localStorage.setItem(
    'tips_view',
    notNil(ref) ? JSON.stringify(ref) : JSON.stringify(VIEWS.GRID)
  );
  localStorage.removeItem('view');
}

// Migrate old topics view content
// TODO: move this into app start
const content = JSON.parse(localStorage.getItem('TopicViewFilter'));
if (content !== null) {
  const allView = oldReferences[content.all.tipMode];
  let topics = content.topics !== undefined ? content.topics : [];
  const myViews = topics.map(topic => ({
    id: topic.topicID,
    view: oldReferences[topic.tipMode]
  }));

  const all_topics_view = {
    view: allView,
    lastModified: new Date().valueOf()
  };

  localStorage.setItem('all_topics_view', JSON.stringify(all_topics_view));
  localStorage.setItem('my_topics_view', JSON.stringify(myViews));
  localStorage.removeItem('TopicViewFilter');
}

const initialState = {
  view: defaultView || VIEWS.GRID,
  allTopics: getValueOrNull('all_topics_view'),
  myTopics: getValueOrEmptyArray('my_topics_view'),
  isPanelVisible: false,
  isHexGridVisible: getValueOrTrue('hex_panel'),
  views: []
};

const setUiSettings = (state, payload) => ({
  ...state,
  view: getUiTipsView(payload),
  allTopics: getUiAllTopicsView(payload),
  myTopics: getUiMyTopicsView(payload),
  isHexGridVisible: getUiHexPanel(payload)
});
const getViews = (state, payload) => ({
  ...state,
  views: payload
});
const setView = (state, payload) => ({
  ...state,
  view: payload
});
const setHexGrid = state => ({
  ...state,
  isHexGridVisible: not(state.isHexGridVisible)
});
const setMyViews = (state, payload) => ({
  ...state,
  myTopics: payload
});
const setAllViews = (state, payload) => ({
  ...state,
  allTopics: payload,
  myTopics: []
});

const togglePanel = state => ({
  ...state,
  isPanelVisible: not(state.isPanelVisible)
});

const tipsView = (state = initialState, { type, payload }) =>
  switchcaseF({
    [SELECT_VIEW]: setView,
    [SELECT_TOPIC_VIEW]: setMyViews,
    [TOGGLE_TOPIC_OPTIONS]: togglePanel,
    [SET_ALL_TOPICS_VIEW]: setAllViews,
    [TOGGLE_HEX_GRID]: setHexGrid,
    [GET_VIEWS]: getViews,
    [SET_UI_SETTINGS]: setUiSettings
  })(state)(type)(state, payload);

export default tipsView;
