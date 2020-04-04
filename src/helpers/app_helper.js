import htmlEntities from 'he';
import URL from '../../vendor/scripts/url';

import AppStore from '../stores/app_store';

function handleHashtagClick(e) {
  e.preventDefault();

  AppStore.emitEventWithData(window.HASHTAG_CLICK_EVENT, e.target);
}

const AppHelper = {
  autoLink(str) {
    let html = str.autoLink({
      target: '_blank', rel: 'nofollow', callback: (newURL) => {
        let url = htmlEntities.decode(newURL);
        url = URL.normalize(url);
        let parsedURL = URL(url);
        if (!parsedURL.isValid()) {
          return null;
        }

        let domain      = parsedURL.domain();
        let queryString = parsedURL.queryString();
        let path        = parsedURL.path();
        let queryParams = $.deparam(queryString);
        let pattern, matches;

        // Images check
        if (/\.(gif|png|jpe?g)/i.test(url)) {
          return '<img class="fr-fic fr-dib" src="' + url + '" width="500" />';
        }

        // YouTube check
        if (domain === 'youtube.com') {
          return '<span class="fr-video fr-fvc fr-dvb fr-draggable" contenteditable="false" draggable="true"><iframe width="560" height="315" src="//www.youtube.com/embed/' + queryParams.v + '?rel=0&wmode=transparent' + '" frameborder="0" allowfullscreen></iframe></span>';
        }

        // YouTu.be check
        if (domain === 'youtu.be') {
          if (path) {
            pattern = new RegExp(/^\/(.*?)$/i);
            matches = pattern.exec(path);
            if (matches) {
              return '<span class="fr-video fr-fvc fr-dvb fr-draggable" contenteditable="false" draggable="true"><iframe width="560" height="315" src="//www.youtube.com/embed/' + queryParams.v + '" frameborder="0" allowfullscreen></iframe></span>';
            }
          }
        }

        // DailyMotion check
        if (domain === 'dailymotion.com') {
          if (path) {
            pattern = new RegExp(/^\/([\d\w]+_[\d\-\w]+)/i);
            matches = pattern.exec(path);
            if (matches) {
              return '<span class="fr-video fr-fvc fr-dvb fr-draggable" contenteditable="false" draggable="true"><iframe frameborder="0" width="560" height="315" src="http://www.dailymotion.com/embed/video/' + matches[1] + '" allowfullscreen></iframe></span>';
            }
          }
        }

        // Vimeo check
        if (domain === 'vimeo.com') {
          if (path) {
            pattern = new RegExp(/^\/([\d\w]+)/i);
            matches = pattern.exec(path);
            if (matches) {
              return '<span class="fr-video fr-fvc fr-dvb fr-draggable" contenteditable="false" draggable="true"><iframe src="//player.vimeo.com/video/' + matches[1] + '?title=0&amp;byline=0&amp;portrait=0&amp;color=33a352" width="560" height="315" height="358" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></span>';
            }
          }
        }

        // Google Maps check
        let map_match = url.match(/google(\.[a-z]+){1,2}\/maps\/?/i);
        if (map_match) {
          if (queryParams.q) {
            return '<span class="fr-video fr-fvc fr-dvb fr-draggable" contenteditable="false" draggable="true"><iframe width="560" height="315" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=' + queryParams.q + '&zoom=15&&key=AIzaSyB2oQMOU1BattR4gp2aS19TMc0abgxx76I"></iframe></iframe></span>';
          } else if (path) {
            pattern = new RegExp(/^\/maps\/(place|search|preview)\/(.*?)\//i);
            matches = pattern.exec(path);
            if (matches) {
              return '<span class="fr-video fr-fvc fr-dvb fr-draggable" contenteditable="false" draggable="true"><iframe width="560" height="315" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/' + matches[1] + '?q=' + matches[2] + '&zoom=15&key=AIzaSyB2oQMOU1BattR4gp2aS19TMc0abgxx76I"></iframe></span>';
            }
          }
        }

        return `<a href='${url}' target='_blank'>${domain}...</a>`;

        // return null;
      }
    });

    html = twttr.txt.autoLinkUsernamesOrLists(html, {usernameUrlBase: '/users/'});
    html = twttr.txt.autoLinkHashtags(html, {hashtagUrlBase: '/?q=', onClick: 'handleHashtagClick()'});

    return html;
  }
};

export default AppHelper;
