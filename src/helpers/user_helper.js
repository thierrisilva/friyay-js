import md5 from 'md5';

var UserHelper = {
  avatar: function(email, size) {
    var avatarSize = size ? size : '40';
    var emailHash = md5(email);
    return '//www.gravatar.com/avatar/' + emailHash + '?s=' + avatarSize;
  }
};

export default UserHelper;
