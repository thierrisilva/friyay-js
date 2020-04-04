import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PermissionItem from './permission_item';
import get from 'lodash/get';
const defaultPermission = {
  roles: ['member']
};

export default class PermissionsList extends Component {
  static propTypes = {
    permissionFor: PropTypes.string,
    objectName: PropTypes.string,
    permissionID: PropTypes.number,
    existingPermissions: PropTypes.object,
    currentDomain: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string // Personal domain
    ])
  };

  static defaultProps = {
    existingPermissions: {},
    currentDomain: null
  };

  render() {
    const {
      props: {
        permissionFor,
        objectName,
        permissionID,
        existingPermissions,
        currentDomain
      }
    } = this;

    let permissions = {};

    if (currentDomain) {
      permissions = get(
        currentDomain,
        'relationships.domain_permission.data.access_hash',
        {}
      );
    }

    return (
      <div
        className={`permissions-list permissions-${permissionFor} row`}
        data-permission-id={permissionID}
      >
        <div className="row" style={{ padding: 10 }}>
          <div className="col-sm-3 text-center">
            <h4>Action</h4>
          </div>
          <div className="col-sm-9">
            <div className="row">
              <div className="col-sm-6 text-center">
                <h4>Permanent Permissions</h4>
              </div>
              <div className="col-sm-6 text-center">
                <h4>Custom Permissions</h4>
              </div>
            </div>
          </div>
        </div>

        {permissionFor === 'domain' && (
          <div>
            <h4 className="text-center p10" style={{ backgroundColor: '#eee' }}>
              yays
            </h4>
            <PermissionItem
              permissionFor={permissionFor}
              objectName={objectName}
              permissionLabel="Create yays"
              model="Topic"
              action="create"
              permission={
                existingPermissions['create_topic'] || defaultPermission
              }
              permissionKey="create_topic"
            />
          </div>
        )}

        <h4
          className="text-center"
          style={{ padding: 10, backgroundColor: '#eee' }}
        >
          Cards
        </h4>

        <PermissionItem
          permissionFor={permissionFor}
          objectName={objectName}
          permissionLabel="Create a Card"
          model="Tip"
          action="create"
          permission={existingPermissions['create_tip'] || defaultPermission}
          permissionKey="create_tip"
          domainPermission={permissions['create_tip']}
        />
        <PermissionItem
          permissionFor={permissionFor}
          objectName={objectName}
          permissionLabel="Edit a Card"
          model="Tip"
          action="update"
          permission={existingPermissions['edit_tip']}
          permissionKey="edit_tip"
          domainPermission={permissions['edit_tip']}
        />
        <PermissionItem
          permissionFor={permissionFor}
          objectName={objectName}
          permissionLabel="Delete a Card"
          model="Tip"
          action="destroy"
          permission={existingPermissions['destroy_tip']}
          permissionKey="destroy_tip"
          domainPermission={permissions['destroy_tip']}
        />
        <PermissionItem
          permissionFor={permissionFor}
          objectName={objectName}
          permissionLabel="Like a Card"
          model="Tip"
          action="like"
          permission={existingPermissions['like_tip'] || defaultPermission}
          permissionKey="like_tip"
          domainPermission={permissions['like_tip']}
        />
        <PermissionItem
          permissionFor={permissionFor}
          objectName={objectName}
          permissionLabel="Comment on a Card"
          model="Tip"
          action="comment"
          permission={existingPermissions['comment_tip'] || defaultPermission}
          permissionKey="comment_tip"
          domainPermission={permissions['comment_tip']}
        />

        {permissionFor === 'domain' && (
          <div>
            <h4
              className="text-center"
              style={{ padding: 10, backgroundColor: '#eee' }}
            >
              Teams
            </h4>

            <PermissionItem
              permissionFor={permissionFor}
              objectName={objectName}
              permissionLabel="Create a Team"
              model="Group"
              action="create"
              permission={
                existingPermissions['create_group'] || defaultPermission
              }
              permissionKey="create_group"
              domainPermission={permissions['create_group']}
            />
            <PermissionItem
              permissionFor={permissionFor}
              objectName={objectName}
              permissionLabel="Edit a Team"
              model="Group"
              action="update"
              permission={
                existingPermissions['edit_group'] || defaultPermission
              }
              permissionKey="edit_group"
              domainPermission={permissions['edit_group']}
            />
            <PermissionItem
              permissionFor={permissionFor}
              objectName={objectName}
              permissionLabel="Delete a Team"
              model="Group"
              action="destroy"
              permission={
                existingPermissions['destroy_group'] || defaultPermission
              }
              permissionKey="destroy_group"
              domainPermission={permissions['destroy_group']}
            />
          </div>
        )}
      </div>
    );
  }
}
