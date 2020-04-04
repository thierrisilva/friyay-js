/* global vex */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import StringHelper from '../../../../../helpers/string_helper';
import tiphive from '../../../../../lib/tiphive';
import { removeLabel } from 'Src/newRedux/database/labels/thunks';
import { SCREEN } from 'Enums';

class GroupItemLabel extends Component {
  static propTypes = {
    label: PropTypes.object.isRequired,
    switchScreen: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    handleLabelChange: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    kind: PropTypes.string.isRequired
  };

  static defaultProps = {
    label: {}
  };

  handleLabelSelect = e => {
    const {
      props: { label, handleLabelChange }
    } = this;
    const {
      target: { checked }
    } = e;

    handleLabelChange(label.id, checked);
  };

  handleLabelEdit = e => {
    e.preventDefault();
    const {
      props: { kind, switchScreen, label }
    } = this;
    kind !== 'system' && switchScreen(SCREEN.LABEL_FORM, label);
  };

  handleLabelDelete = e => {
    e.preventDefault();
    const {
      props: { label, remove }
    } = this;
    remove(label.id);
  };

  render() {
    if (tiphive.userIsGuest()) {
      return null;
    }

    const {
      props: { label, selected, kind }
    } = this;
    const { name, color } = label.attributes;
    const key = `label-${label.id}`;

    return (
      <div className="list-group-item pl0">
        <input
          type="checkbox"
          id={key}
          checked={selected}
          onChange={this.handleLabelSelect}
        />
        &nbsp;
        <label htmlFor={key} className={'color-' + color} />
        <label htmlFor={key}>{name}</label>
        {kind !== 'system' && (
          <span className="pull-right">
            <a
              className="label-action text-muted"
              onClick={this.handleLabelEdit}
            >
              <i className="glyphicon glyphicon-pencil" />
            </a>
            <a
              className="label-action text-muted"
              onClick={this.handleLabelDelete}
            >
              <i className="glyphicon glyphicon-trash" />
            </a>
          </span>
        )}
      </div>
    );
  }
}

const mapState = ({ labels: { collection } }) => ({ labels: collection });
const mapDispatch = { remove: removeLabel };

export default connect(
  mapState,
  mapDispatch
)(GroupItemLabel);
