/* global vex */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import StringHelper from '../../../../../helpers/string_helper';
import { removeLabel } from 'Src/newRedux/database/labels/thunks';
import { addRemoveLabelsOnCard } from 'Src/newRedux/database/cards/thunks';
import { SCREEN } from 'Enums';
import { stateMappings } from 'Src/newRedux/stateMappings';

class GroupItemLabel extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    label: PropTypes.object.isRequired,
    switchScreen: PropTypes.func,
    addRemoveLabels: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    kind: PropTypes.string.isRequired
  };

  static defaultProps = {
    label: {}
  };

  state = {
    checked: false
  };

  componentDidMount() {
    const isChecked = this.props.item.relationships.labels.data.find(
      item => Number.parseInt(item.id) === Number.parseInt(this.props.label.id)
    );
    this.setState(state => ({ ...state, checked: isChecked !== undefined }));
  }

  handleLabelSelect = e => {
    const {
      props: { item, label, addRemoveLabels }
    } = this;
    const {
      target: { checked }
    } = e;

    checked
      ? addRemoveLabels(item, [label.id])
      : addRemoveLabels(item, [], [label.id]);

    this.setState(state => ({ ...state, checked }));
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

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this label?',
      callback: async value => value && remove(label.id)
    });
  };

  render() {
    const {
      props: { label, item, kind },
      state: { checked }
    } = this;
    const { name, color } = label.attributes;

    return (
      <div className="list-group-item">
        <input
          type="checkbox"
          id={`item-${item.id}-label-${label.id}`}
          checked={checked}
          onChange={this.handleLabelSelect}
        />
        &nbsp;
        <label
          htmlFor={`item-${item.id}-label-${label.id}`}
          className={'color-' + color}
        />
        <label htmlFor={`item-${item.id}-label-${label.id}`}>
          {StringHelper.truncate(name, 15)}
        </label>
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

const mapState = (state, props) => {
  const sm = stateMappings(state);

  return {
    labels: Object.values(sm.labels)
  };
};
const mapDispatch = {
  addRemoveLabels: addRemoveLabelsOnCard,
  remove: removeLabel
};

export default connect(
  mapState,
  mapDispatch
)(GroupItemLabel);
