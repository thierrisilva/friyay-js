// Browser
window.windowHeight = $(window).height();
window.windowWidth = $(window).width();

window.documentHeight = null;
window.documentWidth = null;

window.lastWindowScrollTop = null;
window.windowScrollTop = null;
window.lastElementScrollTop = null;
window.elementScrollTop = null;
window.elementHeight = null;

window.modalHeight = null;
window.lastModalScrollTop = null;
window.modalScrollTop = null;

window.bottomOffset = 2; // scroll end detection pixels sensitive

window.ITEMS_PER_PAGE = 25;

// Events
window.SCROLL_EVENT = 'scroll';
window.ELEMENT_SCROLL_EVENT = 'elem-scroll';
window.CHANGE_EVENT = 'change';
window.TOGGLE_EVENT = 'toggle';
window.LOAD_EVENT = 'load';
window.DESTROY_EVENT = 'destroy';
window.FOLLOW_EVENT = 'follow';
window.UNFOLLOW_EVENT = 'unfollow';

window.MODAL_SCROLL_EVENT = 'modal-scroll';
window.HASHTAG_CLICK_EVENT = 'hashtag-click';

window.PARENT_LOAD_EVENT = 'parent-load';
window.CHILDREN_LOAD_EVENT = 'children-load';

window.ITEMS_LOAD_EVENT = 'items-load';
window.ITEM_LOAD_EVENT = 'item-load';
window.ITEM_LOAD_FAILED = 'item-load-failed';
window.ITEM_LIKE_EVENT = 'item-like';
window.ITEM_UNLIKE_EVENT = 'item-unlike';
window.ITEM_CREATE_EVENT = 'item-create';
window.ITEM_UPDATE_EVENT = 'item-update';
window.ITEM_DESTROY_EVENT = 'item-destroy';
window.ITEM_ARCHIVE_EVENT = 'item-archive';
window.ITEM_REMOVE_EVENT = 'item-remove';

window.ITEM_UPDATE_SILENT_EVENT = 'item-update-silent';

window.LABELS_LOAD_EVENT = 'labels-load';
window.LABEL_LOAD_EVENT = 'label-load';
window.LABEL_CREATE_EVENT = 'label-create';
window.LABEL_UPDATE_EVENT = 'label-update';
window.LABEL_DESTROY_EVENT = 'label-destroy';
window.LABEL_ASSIGN_EVENT = 'label-assign';
window.LABEL_REMOVE_EVENT = 'label-remove';

window.USER_FOLLOW_EVENT = 'user-follow';
window.USER_UNFOLLOW_EVENT = 'user-unfollow';
window.USERS_LOAD_EVENT = 'users-load';
window.USER_LOAD_EVENT = 'user-load';
window.USERS_BY_DOMAIN_LOAD = 'user-domain-load';
window.USERS_BY_DOMAIN_UPDATE = 'user-domain-update';
window.USERS_BY_DOMAIN_REMOVE = 'user-domain-remove';
window.USERS_BY_DOMAIN_REMOVE_FAIL = 'user-domain-remove-fail';
window.ROLES_BY_DOMAIN_LOAD = 'role-domain-load';

window.GROUPS_LOAD_EVENT = 'groups-load';
window.GROUP_LOAD_EVENT = 'group-load';
window.GROUP_CREATE_EVENT = 'group-create';
window.GROUP_UPDATE_EVENT = 'group-update';
window.GROUP_DESTROY_EVENT = 'group-destroy';
window.GROUP_JOIN_EVENT = 'group-join';
window.GROUP_LEAVE_EVENT = 'group-leave';

window.TOPIC_FOLLOW_EVENT = 'topic-follow';
window.TOPIC_UNFOLLOW_EVENT = 'topic-unfollow';
window.TOPICS_LOAD_EVENT = 'topics-load';
window.TOPIC_LOAD_EVENT = 'topic-load';
window.TOPIC_CREATE_EVENT = 'topic-create';
window.TOPIC_UPDATE_EVENT = 'topic-update';
window.TOPIC_DESTROY_EVENT = 'topic-destroy';
window.TOPIC_MOVE_EVENT = 'topic-move';
window.TOPIC_UNSTAR_EVENT = 'topic-unstart';
window.TOPIC_STAR_EVENT = 'topic-star';
window.HEX_TOPIC_CREATE_EVENT = 'topic-hex-create';
window.REMOVE_SUBTOPIC_EVENT = 'subtopic-remove';
window.ADD_SUBTOPIC_EVENT = 'subtopic-add';
window.UPDATE_SUBTOPIC_EVENT = 'subtopic-update';
window.UPDATE_SUBTOPIC_ERROR = 'subtopic-update-error';

window.TOPIC_CREATE_ON_FLY_EVENT = 'topic-create-on-fly';
window.TOPIC_CREATE_CONFLICT_EVENT = 'topic-create-conflict';

window.TIPS_LOAD_EVENT = 'tips-load';
window.TIP_LOAD_EVENT = 'tip-load';
window.TIP_CREATE_EVENT = 'tip-create';
window.TIP_UPDATE_EVENT = 'tip-update';
window.TIP_DESTROY_EVENT = 'tip-destroy';

window.QUESTIONS_LOAD_EVENT = 'questions-load';
window.QUESTION_LOAD_EVENT = 'question-load';
window.QUESTION_CREATE_EVENT = 'question-create';
window.QUESTION_UPDATE_EVENT = 'question-update';
window.QUESTION_DESTROY_EVENT = 'question-destroy';

window.DOMAINS_LOAD_EVENT = 'domains-load';
window.DOMAIN_LOAD_EVENT = 'domain-load';
window.DOMAIN_CREATE_EVENT = 'domain-create';
window.DOMAIN_UPDATE_EVENT = 'domain-update';
window.DOMAIN_DESTROY_EVENT = 'domain-destroy';

window.USER_UPDATE_EVENT = 'user-update';

window.COMMENTS_LOAD_EVENT = 'comments-load';
window.COMMENT_LOAD_EVENT = 'comment-load';
window.COMMENT_CREATE_EVENT = 'comment-create';
window.COMMENT_UPDATE_EVENT = 'comment-update';
window.COMMENT_DESTROY_EVENT = 'comment-destroy';

window.TOUR_STOPPED_EVENT = 'tour-stopped';
window.DEFAULT_AVATAR_URL =
  'https://tiphiveupload.s3.amazonaws.com/assets/AvatarBeeSquare.png';
window.EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

window.DASHBOARD_LOAD_EVENT = 'dashboard-load';

window.AUTOSAVE_KEY = 'tiphiveAutosave';

window.AUTOSAVE_SAVE_EVENT = 'autosave-save';
window.AUTOSAVE_LOAD_EVENT = 'autosave-load';
window.AUTOSAVE_CLEAR_EVENT = 'autosave-clear';

window.ATTACHMENTS_LOAD_EVENT = 'attachments-load';

window.VERSION_CHANGE_EVENT = 'version-change';

// System
window.currentUser = null;
window.currentProtocol = 'http';
window.currentHost = window.location.hostname;
window.isSubdomain = false;
window.mainDomainNames = ['www', 'my', 'staging', 'beta', 'js', 'support'];
window.currentDomain = '';
window.currentDomainName = '';
window.hostComponents = window.currentHost.split('.');

// currentHost = domain.tiphive.com
if (window.hostComponents.length > 2) {
  window.currentDomainName = window.hostComponents[0];

  // if current domain name is NOT in main domain names list, we're in subdomain site
  if (window.mainDomainNames.indexOf(window.currentDomainName) < 0) {
    window.isSubdomain = true;
  }
}
