import store from '../store/store';
import { pushNotification } from 'Src/newRedux/database/notifications/thunks';
let subscribedChannel = null;

const PushNotification = {
  subscribe(userId, socket, notificationActions, channelName) {
    subscribedChannel = socket.subscribe(channelName);
    this.unsubscribe(socket);

    [
      'someone_comments_on_tip',
      'someone_commented_on_tip_user_commented',
      'someone_mentioned_on_comment',
      'someone_likes_tip',
      'someone_shared_topic_with_me',
      'someone_adds_topic',
      'bot-notification',
    ].map(
      binding =>
        subscribedChannel.bind(binding, ({ notification }) =>
          store.dispatch(pushNotification(userId, notification)))
    );
  },

  unsubscribe(socket) {
    if (!subscribedChannel) {
      return;
    }

    subscribedChannel.unbind_all();
    socket.unsubscribe(subscribedChannel);
  }
};

export default PushNotification;
