/* global vex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ColorBlock from 'Components/shared/color_block';
import { inc } from 'ramda';
import {
  assignLabel
} from 'Actions/labels';
import {
  createLabel,
  updateLabel,
  removeLabel
} from 'Src/newRedux/database/labels/thunks';
import { SCREEN } from 'Enums';
import toSafeInteger from 'lodash/toSafeInteger';

class ItemLabelForm extends Component {
  static defaultProps = {
    label: null
  };

  static propTypes = {
    label: PropTypes.object,
    item: PropTypes.object.isRequired,
    switchScreen: PropTypes.func,
    save: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    assign: PropTypes.func.isRequired
  };

  state = {
    colorIndex: 1,
    name: '',
    kind: 'private'
  };

  componentDidMount() {
    const { props: { label } } = this;

    if (label !== null) {
      this.setState(state => ({
        ...state,
        colorIndex: toSafeInteger(label.attributes.color),
        name: label.attributes.name,
        kind: label.attributes.kind
      }));
    }

    $(this.selectField).selectize({
      onChange: kind => this.setState(state => ({ ...state, kind }))
    });
  }

  handleChange = e => {
    const { target: { name, value } } = e;
    this.setState(state => ({ ...state, [name]: value }));
  };

  handleMenuCloseClick = e => {
    e.preventDefault();
    this.props.switchScreen(SCREEN.LABEL_LISTING);
  };

  handleLabelFormSubmit = async e => {
    e.preventDefault();
    const { props: { item, label, update, save, assign, switchScreen } } = this;
    const { state: { name, kind, colorIndex } } = this;

    if (label !== null) {
      const { id } = label;
      await update({ id, name, kind, color: colorIndex });
      switchScreen(SCREEN.LABEL_LISTING);
    } else {
      const newLabel = await save({ attributes: { name, kind, color: colorIndex }});
      if (newLabel !== null) {
        assign(newLabel, item.id);
        switchScreen(SCREEN.LABEL_LISTING);
      }
    }
  };

  handleColorSelect = colorIndex =>
    this.setState(state => ({ ...state, colorIndex }));


  render() {
    const {
      props: { label, remove, handleCloseClick },
      state: { colorIndex, name, kind }
    } = this;

    const labelFormHeader = label == null ? 'Add label' : 'Edit label';

    return (
      <div
        className="grid-card-menu z2 full-height"
      >
        <form
          className="label-form"
          method="post"
          onSubmit={this.handleLabelFormSubmit}
        >
          <div className="list-group list-options">
            <div className="list-group-item grid-item-menu-header flex-r-center-spacebetween">
              {labelFormHeader}
                <button
                  style={{marginTop: -5}}
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCloseClick || this.handleMenuCloseClick}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
            </div>
          </div>
          <div
            className="panel-body"
            style={{ height: 250 }}
          >
            <div className="form-group">
              <input
                type="text"
                name="name"
                onChange={this.handleChange}
                value={name}
                className="form-control full-border"
                placeholder="Type label name"
                required
              />
            </div>

            <div className="form-group">
              <select
                ref={input => (this.selectField = input)}
                name="kind"
                defaultValue={kind}
                className="form-control selectize-full-border"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="form-group">
              {Array(7)
                .fill(0)
                .map((_, index) => (
                  <ColorBlock
                    key={`color-block-${index}`}
                    colorIndex={inc(index)}
                    onSelect={this.handleColorSelect}
                    selected={colorIndex === inc(index)}
                  />
                ))}
            </div>
          </div>
          <div
            className="panel-footer flex-r-center"
            style={{
              height: 'auto',
              width: '100%',
              borderTop: '1px solid #f0f0f0',
              justifyContent: 'space-between'
            }}
          >
            {label !== null && (
              <a className="mr15" onClick={() => remove(label.id)}>
                Delete
              </a>
            )}
            <input
              type="submit"
              style={{ margin: 0, marginLeft: 'auto' }}
              className="btn btn-primary btn-sm"
              value="Save"
            />
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatch = {
  save: createLabel,
  update: updateLabel,
  remove: removeLabel,
  assign: assignLabel
};

export default connect(null, mapDispatch)(ItemLabelForm);
