export const notificationConfig = {
  all: {
    dbAction: '',
    description: 'All Activity',
    icon: 'globe',
    key: 'all'
  },
  assigned: {
    dbAction: 'someone_assigned_tip',
    description: 'Assignments',
    icon: 'user',
    key: 'assigned'
  },
  comment: {
    dbAction: 'someone_comments_on_tip',
    description: 'Comments',
    icon: 'comment',
    key: 'comment'
  },
  commented: {
    dbAction: 'someone_commented_on_tip_user_commented',
    description: 'Comment Replies',
    icon: 'comments',
    key: 'commented'
  },
  mention: {
    dbAction: 'someone_mentioned_on_comment',
    description: 'Mentions',
    icon: 'at',
    key: 'mention'
  },
  like: {
    dbAction: 'someone_likes_tip',
    description: 'Likes',
    icon: 'heart',
    key: 'like'
  },
  share_hive: {
    dbAction: 'someone_shared_topic_with_me',
    description: 'Shared yays',
    icon: 'share',
    key: 'share_hive'
  },
  add_hive: {
    dbAction: 'someone_adds_topic',
    description: 'New yays',
    icon: 'plus-circle',
    key: 'add_hive'
  }
};
