/* global window */
import Pusher from 'pusher-js';

const ActivitySocket = new Pusher(window.PUSHER_APP_KEY, {
  cluster: 'us2',
});

export default ActivitySocket;
