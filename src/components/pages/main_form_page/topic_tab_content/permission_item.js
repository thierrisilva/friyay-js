import React, { Component } from 'react';
import PropTypes from 'prop-types';

const hasRoles = domainPermission =>
  domainPermission === undefined ||
  domainPermission['roles'] === undefined ||
  domainPermission['roles'].length === 0;

export default class PermissionItem extends Component {
  static propTypes = {
    model: PropTypes.string,
    action: PropTypes.string,
    permissionFor: PropTypes.string,
    objectName: PropTypes.string,
    permissionLabel: PropTypes.string,
    permissionKey: PropTypes.string,
    permission: PropTypes.object,
    domainPermission: PropTypes.object
  };

  static defaultProps = {
    permission: null
  };

  field = null;

  componentDidMount() {
    if (this.field !== null) {
      $(this.field).selectize({
        plugins: ['remove_button'],
        allowEmptyOption: true
      });
    }
  }

  render() {
    const {
      props: {
        model,
        action,
        permissionFor,
        objectName,
        permissionLabel,
        permissionKey,
        permission,
        domainPermission
      }
    } = this;

    if (
      (window.APP_ENV === 'production' && model === 'Question') ||
      (model === 'Topic' && permissionFor !== 'domain')
    ) {
      return null;
    }

    let permissionId = null;
    let existingValues = null;
    let hiveAdministrator = null;
    let tipOwner = null;

    if (permission) {
      permissionId = permission.id;

      if (permissionFor === 'topic') {
        hiveAdministrator = (
          <label className="mockSelect">Topic Administrators</label>
        );
      }

      if (model === 'Tip' && action !== 'create') {
        tipOwner = <label className="mockSelect">Card Creator</label>;
      }

      existingValues = permission.roles;
    }

    let permissionPicker = (
      <div className="row">
        <div className="col-sm-6">
          <label className="mockSelect">Workspace Administrators</label>
          {hiveAdministrator}
          {tipOwner}
        </div>
        <div className="col-sm-6">
          <select
            className="form-control permission-selectize"
            data-model={model}
            data-action={permissionKey}
            name={`${permissionFor}-permissions[${permissionKey}]`}
            id={`${permissionFor}-permissions-${permissionKey}`}
            ref={select => (this.field = select)}
            multiple="multiple"
            data-permission-id={permissionId}
            defaultValue={existingValues || []}
          >
            <option value="member">All {objectName} members</option>
          </select>
        </div>
      </div>
    );

    if (permissionFor !== 'domain' && hasRoles()) {
      const domainPermissionAsText =
        action === 'create'
          ? 'Workspace & yay Administrators Only.'
          : 'Workspace & yay Administrators and Card Creators Only.';

      permissionPicker = (
        <div className="form-control">
          <i>{domainPermissionAsText}</i>
        </div>
      );
    }

    return (
      <div className="form-group">
        <div className="row">
          <div className="col-sm-3 control-label text-right">
            <label>{permissionLabel}</label>
          </div>

          <div className="col-sm-9">{permissionPicker}</div>
        </div>
      </div>
    );
  }
}
