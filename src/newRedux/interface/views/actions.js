import actionTypes from './actionEnum';

// ViewObject to be passed looks like:
// {
//   header: 0, <- where 0 is an enum value for the diff headers we have
//   topic: 1,  <- where 1 is an enum value for the diff topic views we have
//   card: 1    <- where 2 is an enum value for the diff vard views we have
// }
// and will replace the reducer state completely

export const changeView = viewObject => ({
  type: actionTypes.changeView,
  payload: {
    header: viewObject.defaultConfig.header,
    topic: viewObject.defaultConfig.topic,
    card: viewObject.defaultConfig.card
  }
});

export const topicDesignLoader = payload => ({
  type: actionTypes.topicDesignLoader,
  payload
});
