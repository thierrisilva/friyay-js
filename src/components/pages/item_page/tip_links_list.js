import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dotdotdot from 'react-dotdotdot';

export default class TipLinksList extends PureComponent {
  static propTypes = {
    tipLinks: PropTypes.array,
    showDescription: PropTypes.bool,
    isGrid: PropTypes.bool
  };

  static defaultProps = {
    tipLinks: [],
    showDescription: false,
    isGrid: false
  };

  render() {
    const {
      props: { tipLinks, showDescription, isGrid }
    } = this;

    return (
      <ul className="list-group tip-links-list-group">
        {tipLinks.map((link, index) => {
          const { url, title, description, avatar_url } = link;

          return (
            <li
              key={`tip-link-item-${index}`}
              className={classNames({
                'list-group-item group-item-tip-link': true,
                'item-grid-link': isGrid
              })}
            >
              <div className="media">
                <div
                  className={classNames({
                    'media-left': true,
                    'active-avatar-url': avatar_url
                  })}
                >
                  <div className="tip-link-icon">
                    <span className="material-icons">link</span>
                  </div>
                  <a
                    href={url}
                    className="avatar-url"
                    style={{ backgroundImage: `url(${avatar_url})` }}
                    target="_blank"
                  />
                </div>
                <div
                  className={classNames({
                    'media-body': true,
                    'active-link-preview': !!title || !!description
                  })}
                >
                  <a href={url} className="tip-link" target="_blank">
                    {url}
                  </a>
                  <div className="link-preview-details">
                    <a href={url} target="_blank">
                      {title}
                    </a>
                    {showDescription && (
                      <Dotdotdot clamp={3}>
                        <p className="text-muted">{description}</p>
                      </Dotdotdot>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}
