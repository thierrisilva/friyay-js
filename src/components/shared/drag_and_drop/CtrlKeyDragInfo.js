import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';
import Icon from 'Components/shared/Icon';

class CtrlKeyDragInfo extends PureComponent {
  state = {
    onScreen: false
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ onScreen: true });
    }, 100);
  }

  render() {
    const { onScreen } = this.state;

    return (
      <div className={`ctrl-key-drag-info ${onScreen && 'on-screen'}`}>
        <Icon
          additionalClasses="ctrl-key-drag-info_icon large"
          fontAwesome
          icon="info-circle"
        />
        Hold the ctrl key when dragging to add a card to a yay rather than move
        it
      </div>
    );
  }
}

export default CtrlKeyDragInfo;
