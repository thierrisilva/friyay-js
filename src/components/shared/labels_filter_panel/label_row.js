import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import tiphive from 'Lib/tiphive';
import { updateLabel } from 'Actions/labels';

class LabelRow extends Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    label: PropTypes.object.isRequired,
    handleLabelSelect: PropTypes.func.isRequired,
    handleLabelDelete: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    labelType: PropTypes.string.isRequired,
    isGuest: PropTypes.bool,
  };

  state = {
    isEditing: false,
    name: ''
  };

  handleLabelEdit = () =>
    this.setState(state => ({
      ...state,
      isEditing: true,
      name: this.props.label.attributes.name
    }));

  handleLabelNameChange = ({ target: { value } }) =>
    this.setState(state => ({ ...state, name: value }));

  handleLabelFormSubmit = async e => {
    e.preventDefault();

    const {
      props: { label, update, labelType },
      state: { name }
    } = this;

    if (labelType === 'system') {
      return false;
    }

    await update({
      id: label.id,
      name,
      kind: label.attributes.kind,
      color: label.attributes.color
    });

    this.setState(state => ({ ...state, isEditing: false, name: '' }));
  };

  handleLabelFormCancel = () =>
    this.setState(state => ({
      ...state,
      isEditing: false,
      name: ''
    }));

  render() {
    const {
      props: {
        label,
        handleLabelSelect,
        isSelected,
        handleLabelDelete,
        labelType,
        isGuest
      },
      state: { isEditing, name: editingName }
    } = this;

    const { attributes: { name, color }, id } = label;
    const labelRowClass = classNames({
      'label-item': true,
      [`color-${color}`]: true,
      selected: isSelected
    });

    if (isEditing) {
      return (
        <div className="label-item-form">
          <form onSubmit={this.handleLabelFormSubmit}>
            <div className="label-input-container">
              <input
                type="text"
                value={editingName}
                onChange={this.handleLabelNameChange}
                className="form-control full-border"
                placeholder="Type label name"
                required
                autoFocus
              />
              <button type="submit" className="label-submit-btn">
                <i className="fa fa-lg fa-check" />
              </button>
              <button
                className="label-cancel-btn"
                onClick={this.handleLabelFormCancel}
              >
                <i className="fa fa-lg fa-close" />
              </button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className={labelRowClass}>
        <a onClick={() => handleLabelSelect(label)}>
          <span>{name}</span>
          <i
            className={classNames({
              'fa fa-lg mr10': true,
              'fa-check': isSelected
            })}
          />
        </a>
        {(!isGuest && labelType !== 'system') && (
          <div className="label-item-action">
            <i
              onClick={() => this.handleLabelEdit(label)}
              className="fa fa-lg fa-pencil"
            />
            <i
              onClick={() => handleLabelDelete(label)}
              className="fa fa-lg ml5 mr5 fa-trash"
            />
          </div>
        )}
      </div>
    );
  }
}

const mapState = () => ({});
const mapDispatch = { update: updateLabel };

export default connect(mapState, mapDispatch)(LabelRow);
