import React from 'react';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';

export default {
  cssModifier: 'links',
  display: 'Links',
  resizableProps: {
    minWidth: '135'
  },
  render: card => {
    const tipLinks = get(card, 'attributes.attachments_json.tip_links', []);

    return (
      <div className="flex-r-wrap-start list-group tip-links-list-group">
        {tipLinks.map(({ url, avatar_url }) => (
          <div
            data-tip=""
            data-for={url}
            key={url}
            className="list-group-item group-item-tip-link"
          >
            <ReactTooltip
              border
              className="tiphive-tooltip"
              id={url}
              type="dark"
              effect="solid"
            >
              {url}
            </ReactTooltip>
            <div>
              <div
                className={classNames({
                  'media-left': true,
                  'active-avatar-url': avatar_url
                })}
              >
                <a className="tip-link-icon" href={url}>
                  <span className="material-icons">link</span>
                </a>
                <a
                  href={url}
                  className="avatar-url"
                  style={{ backgroundImage: `url(${avatar_url})` }}
                  target="_blank"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(
      cards,
      card => get(card, 'attributes.attachments_json.tip_links', []).length,
      order
    );
  }
};
