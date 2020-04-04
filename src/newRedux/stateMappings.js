/* provides a mapping to each nested (or not) endPoints so we can change
   the Redux store without having to change every connected component */

export const stateMappings = state => ({
  cards: state._newReduxTree.database.cards,
  comments: state._newReduxTree.database.comments,
  loadIndicator: state._newReduxTree.ui.loadIndicator,
  dock: state._newReduxTree.ui.dock,
  domains: state._newReduxTree.database.domains,
  filters: state._newReduxTree.filters,
  groups: state._newReduxTree.database.groups,
  labelCategories: state._newReduxTree.database.labelCategories,
  labelOrders: state._newReduxTree.database.labelOrders,
  labels: state._newReduxTree.database.labels,
  loadIndicator: state._newReduxTree.ui.loadIndicator,
  menus: state._newReduxTree.ui.menus,
  modals: state._newReduxTree.ui.modals,
  notifications: state._newReduxTree.database.notifications,
  page: state._newReduxTree.ui.page,
  people: state._newReduxTree.database.people,
  peopleOrders: state._newReduxTree.database.peopleOrders,
  routing: state._newReduxTree.routing,
  session: state._newReduxTree.session,
  topics: state._newReduxTree.database.topics,
  topicOrders: state._newReduxTree.database.topicOrders,
  user: state._newReduxTree.database.user,
  userUISettings: state._newReduxTree.database.user.ui_settings,
  utilities: state._newReduxTree.utilities,
  bot: state._newReduxTree.bot,
  integrationFiles: state._newReduxTree.integrationFiles,
  search: state._newReduxTree.database.search,
  views: state._newReduxTree.ui.views
});
