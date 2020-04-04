import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Icon from 'Src/components/shared/Icon';
import { IconButton } from 'Src/components/shared/buttons/index';

class CardVersionDetail extends Component {
  changeTipVersion = () => {
    const { changeTipByVersion, version, changeColor } = this.props;
    changeTipByVersion(version.id);
    changeColor(version.id);
  };

  activeColor = versionId => {
    const { active } = this.props;
    if (active === versionId) {
      return '#f7f5f5';
    }
    return '';
  };

  render() {
    const { version } = this.props;

    return version ? (
      <ul
        key={version.id}
        className="left-menu-custom"
        onClick={this.changeTipVersion}
        style={{ background: this.activeColor(version.id) }}
      >
        <li className="date">
          <span className="li-arrow">
            <IconButton fontAwesome icon={'caret-right'} />
          </span>
          {moment(version.created_at).format('hh:mm A MMM Do')}
        </li>
        <li className="saved-by">Saved by {version.changed_by}</li>
      </ul>
    ) : (
      <div />
    );
  }
}

export default CardVersionDetail;
