import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setEditCardModalOpen } from 'Src/newRedux/interface/modals/actions';

const mapDispatch = { setEditCardModalOpen };

function withPlanTabLink(WrappedComponent) {
  return connect(null, mapDispatch)(
    class extends Component {
      static displayName = 'WithPlanTabLink';

      static propTypes = {
        card: PropTypes.object.isRequired,
        onClick: PropTypes.func,
        setEditCardModalOpen: PropTypes.func.isRequired
      };

      handleClick = () => {
        const modalOptions = { cardId: this.props.card.id, tab: 'Plan' };

        this.props.setEditCardModalOpen(modalOptions);
        this.props.onClick();
      };

      render() {
        const { onClick, setEditCardModalOpen, ...propsToPass } = this.props;

        return <WrappedComponent onClick={this.handleClick} {...propsToPass} />;
      }
    }
  );
}

export default withPlanTabLink;
