import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';

import Icon from 'Components/shared/Icon';
import IconButton from 'Components/shared/buttons/IconButton';
import { stateMappings } from 'Src/newRedux/stateMappings';


class MenuGroupIndicator extends PureComponent {

  static propTypes = {
    group: object,
    routerHistory: object,
  };

  handleCloseGroup = () => {
    this.props.routerHistory.push( '/' );
  }

  render() {
    const { group, currentPath } = this.props;
    const currentRootGroup = Boolean(group) && currentPath === `/groups/${group.attributes.slug}`;

    return group ? (
      <div className="left-menu-group-content_element left-menu-group-indicator">
        <Link 
          className={`left-menu-group-name ${currentRootGroup ? 'left-menu-group-name-current' : ''}`}
          to={`/groups/${group.attributes.slug}`}
        >
          <h5 className="flex-r-center">
            <Icon
              additionalClasses='medium'
              fontAwesome
              icon='users' />
            <span className="ml10">{group.attributes.title}</span>
          </h5>
        </Link>
        <IconButton
          additionalClasses='on-yellow-bg'
          icon='close'
          onClick={this.handleCloseGroup} />
      </div>
    ) : false;
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    group: sm.groups[ sm.page.groupId ],
    currentPath: sm.routing.routerHistory.location.pathname,
    routerHistory: sm.routing.routerHistory
  };
};

export default connect(mapState)(MenuGroupIndicator);
