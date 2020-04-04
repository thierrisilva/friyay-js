import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Icon from 'Src/components/shared/Icon';
import { IconButton } from 'Src/components/shared/buttons/index';
import CardVersionDetail from './CardVersionDetail';

class CardVersion extends Component {
  constructor(props) {
    super(props);
    this.state = { showComponent: false, active: null };
  }

  toggleVersionsTab = () =>
    this.setState({ showComponent: !this.state.showComponent });

  changeColor = versionId => {
    this.setState({ active: versionId });
  };

  render() {
    const { versions, showComponent, toggleCardVersions } = this.props;
    return (
      (versions || []).length &&
      showComponent && (
        <div className="version-tab">
          <div className="right-submenu_content">
            <div className="heading">
              <span className="card-version"> Card Versions </span>
              <span className="arrow-icon">
                <a href="#" onClick={toggleCardVersions} className="grey-link">
                  <Icon icon="chevron_right" additionalClasses="medium" />
                </a>
              </span>
            </div>
            {versions.map(v => (
              <CardVersionDetail
                key={v.id}
                version={v}
                changeTipByVersion={this.props.changeTipByVersion}
                active={this.state.active}
                changeColor={this.changeColor}
              />
            ))}
          </div>
        </div>
      )
    );
  }
}

export default CardVersion;
