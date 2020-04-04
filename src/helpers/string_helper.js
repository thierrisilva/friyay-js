import AppHelper from './app_helper';

const StringHelper = {
  truncate(str, length) {
    return str.length > length ? str.substring(0, length - 3) + '...' : str;
  },

  simpleFormat(str) {
    let $str;
    // replace search name atwho attr with empty string
    str = str.replace(/data-atwho-at-query="@/g, '');

    let formatted_str = AppHelper.autoLink(str);
    formatted_str = $.trim(formatted_str);
    $str = $('<div class=\'tip-body\'>' + formatted_str + '</div>');
    $str.find('style, script').remove();

    $str.find('a').map(function() {
      const noLinkText = this.href === this.innerHTML || this.href === `${this.innerHTML}/`;
      const isCurrentDomainLink = this.host === window.location.host;

      // find the last slug in href and split it into an id and a title
      const [, id, title] = this.href.match(/^.*\/(\d+)-(.*)$/) || [];

      if (noLinkText && isCurrentDomainLink && id && title) {
        const formattedTitle = title.split('-').join(' ');
        const capitalizedTitle = formattedTitle[0].toUpperCase() + formattedTitle.slice(1);

        return this.innerHTML = `#${id} ${capitalizedTitle}`;
      } else if (noLinkText) {
        return this.innerHTML = StringHelper.truncate(this.innerHTML, 50);
      }
    });
    str = $str.html();
    return str;
  },
};

export default StringHelper;
