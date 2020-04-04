/* global vex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { inc } from 'ramda';
import toSafeInteger from 'lodash/toSafeInteger';
import { SCREEN } from 'Enums';

import {
  createLabel,
  updateLabel,
  removeLabel,
  getLabels
} from 'Src/newRedux/database/labels/thunks';
import ColorBlock from 'Components/shared/color_block';

class ItemLabelForm extends Component {
  static propTypes = {
    label: PropTypes.object,
    switchScreen: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
    handleLabelChange: PropTypes.func.isRequired,
    labelsCategory: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.state = {
      colorIndex: 1,
      name: '',
      kind: 'private',
      label_category_ids: []
    };

    if (!props.label) return;
    const { color, name, kind, label_category_ids } = props.label.attributes;
    this.state = {
      colorIndex: toSafeInteger(color) || 1,
      name: name || '',
      kind: kind || 'private',
      label_category_ids: label_category_ids || []
    };
  }

  handleChange = e => {
    const {
      target: { name, value }
    } = e;
    this.setState(state => ({ ...state, [name]: value }));
  };

  handleMenuCloseClick = e => {
    e.preventDefault();
    this.props.switchScreen(SCREEN.LABEL_LISTING);
  };

  handleLabelFormSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();
    const {
      props: { label, update, save, get, handleLabelChange, switchScreen },
      state: { name, kind, colorIndex, label_category_ids }
    } = this;
    const attributes = {
      name,
      kind,
      color: colorIndex,
      label_category_ids
    };

    if (!label_category_ids.length) {
      vex.dialog.alert({
        message: 'Please select the label categories.'
      });
      return;
    }

    if (label) {
      const { id } = label;
      await update({ id, attributes });
      get();
      switchScreen(SCREEN.LABEL_LISTING);
    } else {
      const newLabel = await save({ name, attributes });
      if (newLabel) {
        handleLabelChange(newLabel.id, true);
        switchScreen(SCREEN.LABEL_LISTING);
      }
    }
  };

  handleColorSelect = colorIndex =>
    this.setState(state => ({ ...state, colorIndex }));

  handleLabelDelete = e => {
    e.preventDefault();
    const {
      props: { label, remove, switchScreen }
    } = this;

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this label?',
      callback: value => {
        if (value) {
          remove(label.id);
          switchScreen(SCREEN.LABEL_LISTING);
        }
      }
    });
  };

  handleSelectChange = selectedOptions => {
    this.setState({
      label_category_ids: selectedOptions.map(option => option.value)
    });
  };

  handleSelectKindChange = selectedOption => {
    this.setState({
      kind: selectedOption.value
    });
  };

  render() {
    const {
      props: { label, labelsCategory },
      state: { colorIndex, name, kind, label_category_ids }
    } = this;
    const options = labelsCategory.map(label_categories => {
      return {
        label: label_categories.attributes.name,
        value: label_categories.id
      };
    });
    const kindOptions = [
      { label: 'Private', value: 'private' },
      { label: 'Public', value: 'public' }
    ];
    const kindOption = kindOptions.filter(option => option.value == kind)[0];
    const selectedOptions = options.filter(option =>
      label_category_ids.includes(Number.parseInt(option.value))
    );

    return (
      <div className="flex-1">
        <form
          className="label-form label-tab-form"
          method="post"
          onSubmit={this.handleLabelFormSubmit}
        >
          <div className="list-group list-options mb10">
            <div className="list-group-item grid-item-menu-header flex-r-center-spacebetween">
              {label ? 'Edit label' : 'Add label'}
              <div>
                <button
                  type="button"
                  className="close"
                  onClick={this.handleMenuCloseClick}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          </div>
          <div className="label-tab-form-body p15">
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
              <Select
                onChange={this.handleSelectKindChange}
                options={kindOptions}
                placeholder="Select label kind"
                className="select-label-category"
                value={kindOption}
              />
            </div>
            <div className="form-group">
              <Select
                defaultValue={selectedOptions}
                isMulti
                onChange={this.handleSelectChange}
                options={options}
                placeholder="Select label categories"
                className="select-label-category"
              />
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
          <div className="clearfix" />
          <div className="panel-footer flex-r-center-start pt15 mt20">
            <div className="row">
              <div className="col-sm-4">
                {label !== null && (
                  <a className="mr15" onClick={this.handleLabelDelete}>
                    Delete
                  </a>
                )}
              </div>
              <div className="col-sm-4 col-sm-offset-4">
                <div className="pull-right">
                  <input
                    type="submit"
                    className="btn btn-primary btn-sm"
                    value="Save"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapState = () => ({});

const mapDispatch = {
  save: createLabel,
  update: updateLabel,
  remove: removeLabel,
  get: getLabels
};

export default connect(
  mapState,
  mapDispatch
)(ItemLabelForm);
