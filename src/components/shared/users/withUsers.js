import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getMembers } from 'Actions/members';

function mapState({ members: { collection: users = [], isLoading } }) {
  return { users, isLoading };
}

const mapDispatch = { getMembers };

function withUsers(WrappedComponent) {
  return connect(mapState, mapDispatch)(
    class extends Component {
      static displayName = 'WithUsers';

      static propTypes = {
        isLoading: PropTypes.bool,
        users: PropTypes.array,
        getMembers: PropTypes.func
      };

      componentDidMount() {
        if (!this.props.users.length && !this.props.isLoading) {
          this.props.getMembers();
        }
      }

      render() {
        const { isLoading, getMembers, ...propsToPass } = this.props;

        return <WrappedComponent {...propsToPass} />;
      }
    }
  );
}

export default withUsers;
