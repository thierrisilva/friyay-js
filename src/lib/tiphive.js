import AppStore from '../stores/app_store';
import { has, allPass, isNil, not, compose } from 'ramda';
import get from 'lodash/get';

window.devLog = function() {
  if (window.APP_ENV !== 'production' && console) {
    console.log.apply(console, arguments); // eslint-disable-line
  } else {
    return false;
  }
};

const scrollBindCache = [];
const notNil = compose(not, isNil);
const hasDocument = has('document');
const hasLocation = has('location');
const hasAlert = has('alert');
const hasSetInterval = has('setInterval');
const isWindow = allPass([notNil, hasDocument, hasAlert, hasLocation, hasSetInterval]);

const emitScroll = el => {
  if (isWindow(el.get(0))) {
    window.lastElementScrollTop = window.elementScrollTop;
    window.elementScrollTop     = $(window).scrollTop();
    window.elementHeight        = $(window).height();
    window.documentHeight       = $(document).height();
  } else {
    window.lastElementScrollTop = window.elementScrollTop;
    window.elementScrollTop     = el.scrollTop();
    window.elementHeight        = el.innerHeight();
    window.documentHeight       = el.get(0).scrollHeight;
  }

  if (window.elementScrollTop > window.lastElementScrollTop &&
     window.elementScrollTop + window.elementHeight >= window.documentHeight) {
    AppStore.emitEvent(window.ELEMENT_SCROLL_EVENT);
  }
};

const tiphive = {
  isPublicDomain() {
    const userDomains = ['', 'my', 'staging'];
    return userDomains.includes(window.currentDomainName);
  },

  isSupportDomain() {
    return window.currentDomainName === 'support';
  },

  userIsGuest() {
    // we don't have guest role on public domain
    if (this.isPublicDomain()) return false;

    // This is a very broad permission based on domain masks
    // If we don't have a currentDomain defined,
    // then we don't want to assume the user is NOT a guest
    if (window.currentDomain === undefined || window.currentDomain === '' ) return true;

    // created check throws error `Cannot read property 'masks' of undefined`
    const isGuest = window.currentDomain.relationships
      && window.currentDomain.relationships.masks.data.is_guest;

    // may need if (isGuest && Ability.can('create','topics', currentGroup))
    if (isGuest) return true;
  },

  userIsOwner() {
    if (window.currentDomain !== undefined && window.currentDomain !== '')
    {
      return get( window, 'currentDomain.relationships.masks.data.is_owner', true );
    }
    else
    {
      return false;
    }
  },

  detectScrollEnd() {
    $(window).scroll(function() {
      window.lastWindowScrollTop = window.windowScrollTop;
      window.windowScrollTop     = $(window).scrollTop();
      window.windowHeight        = $(window).height();
      window.documentHeight      = $(document).height();

      if(window.windowScrollTop > window.lastWindowScrollTop &&
         window.windowScrollTop + window.windowHeight >= window.documentHeight - window.bottomOffset) {
        AppStore.emitEvent(window.SCROLL_EVENT);
      }
    });
  },

  detectModalScrollEnd() {
    let selector = '#primary-modal';
    $(selector).scroll(function() {
      window.lastModalScrollTop = window.modalScrollTop;
      window.modalScrollTop     = $(selector).scrollTop();
      window.modalHeight        = $(selector).height();
      window.documentHeight     = $('.modal-content').height();

      if(window.modalScrollTop > window.lastModalScrollTop &&
         window.modalScrollTop + window.modalHeight >= window.documentHeight - window.bottomOffset) {
        AppStore.emitEvent(window.MODAL_SCROLL_EVENT);
      }
    });
  },

  addDetectElementScrollEnd(element) {
    const position = scrollBindCache.findIndex(el => el === element);
    const el = $(element);

    if (position === -1) {
      el.on('scroll.tiphive', function onScroll() { emitScroll(el); });
      scrollBindCache.push(element);
    }
  },

  removeDetectElementScrollEnd(element) {
    const position = scrollBindCache.findIndex(el => el === element);
    const el = $(element);

    if (position !== -1) {
      el.off('scroll.tiphive');
      scrollBindCache.splice(position, 1);
    }
  },

  detectElemScrollEnd(elemID, elemContentID, callback) {
    const ELEM_SCROLL_EVENT = elemID + '-scroll';

    const lastElemScrollTop = localStorage.getItem('last-' + elemID + '-scroll-top') || 0;
    const elemScrollTop     = $('#' + elemID).scrollTop();
    const elemHeight        = $('#' + elemID).height();
    const elemContentHeight = $('#' + elemContentID).height();
    const bottomOffset = 0;

    localStorage.setItem('last-' + elemID + '-scroll-top', elemScrollTop);

    if (elemScrollTop > lastElemScrollTop && elemScrollTop + elemHeight >= elemContentHeight - bottomOffset) {
      AppStore.emitEvent(ELEM_SCROLL_EVENT);
      if (callback) callback();
    }
  },

  detectDropboxCallback() {
    let dropboxAccess = this.parseQueryString(window.location.hash);

    let accessToken = dropboxAccess.access_token;
    let accountID   = dropboxAccess.account_id;
    let state       = dropboxAccess.state;
    let uid         = dropboxAccess.uid;

    if (accessToken && accountID && uid) {
      // is it safe to store accessToken into localStorage?
      localStorage.setItem('dropboxAccessToken', accessToken);

      // state was meant to be a pathname before redirect
      if (state) {
        window.location.href = this.currentProtocol() + window.currentHost + state + '?dropbox_connected=true';
      }
    }
  },

  hideTutorialElements() {
    $('#tutorialize-elements').hide();
  },

  showTutorialElements() {
    $('#tutorialize-elements').show();
  },

  hideAllModals() {
    let $allModalDialogs = $('.modal');
    $allModalDialogs.modal('hide');
  },

  hidePrimaryModal() {
    let $primaryModal = $('#primary-modal');
    $primaryModal.modal('hide');
  },

  hideSecondaryModal() {
    let $secondaryModal = $('#secondary-modal');
    $secondaryModal.modal('hide');
  },

  baseName(url) {
    if (!url) {
      return null;
    }

    let base = new String(url).substring(url.lastIndexOf('/') + 1);
    // if(base.lastIndexOf('.') != -1)
    //   base = base.substring(0, base.lastIndexOf('.'));
    return base;
  },

  currentProtocol() {
    return 'https:' === document.location.protocol ? 'https://' : 'http://';
  },

  parseQueryString(str) {
    let ret = Object.create(null);

    if (typeof str !== 'string') {
      return ret;
    }

    str = str.trim().replace(/^(\?|#|&)/, '');

    if (!str) {
      return ret;
    }

    str.split('&').forEach(function (param) {
      let parts = param.replace(/\+/g, ' ').split('=');
      // Firefox (pre 40) decodes `%3D` to `=`
      // https://github.com/sindresorhus/query-string/pull/37
      let key = parts.shift();
      let val = parts.length > 0 ? parts.join('=') : undefined;

      key = decodeURIComponent(key);

      // missing `=` should be `null`:
      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
      val = val === undefined ? null : decodeURIComponent(val);

      if (ret[key] === undefined) {
        ret[key] = val;
      } else if (Array.isArray(ret[key])) {
        ret[key].push(val);
      } else {
        ret[key] = [ret[key], val];
      }
    });

    return ret;
  }
};

export default tiphive;
