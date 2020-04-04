import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { inc } from 'ramda';

import ColorBlock from 'Components/shared/color_block';
import { createLabel } from 'Src/newRedux/database/labels/thunks';

class LabelForm extends Component {
  static defaultProps = {
    label: null
  };

  static propTypes = {
    label: PropTypes.object,
    handleLabelChange: PropTypes.func.isRequired,
    createLabel: PropTypes.func.isRequired,
    labelsCategory: PropTypes.array,
    selected_category: PropTypes.string
  };

  state = {
    colorIndex: 1,
    name: '',
    kind: '',
    label_category_ids: [],
    flag: false
  };

  componentDidMount() {
    if (this.state.kind != '') return;
    const { kind, selected_category } = this.props;
    this.setState({ kind, label_category_ids: [selected_category] });
  }

  handleLabelFormSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();
    const { handleLabelChange, createLabel } = this.props;
    const { name, kind, colorIndex, label_category_ids } = this.state;

    if (!label_category_ids.length) {
      vex.dialog.alert({
        message: 'Please select the label categories.'
      });
      return;
    }
    const newLabel = await createLabel({
      attributes: { name, kind, color: colorIndex, label_category_ids }
    });
    if (newLabel) {
      handleLabelChange(newLabel.id, true);
      this.setState({ flag: true });
      this.props.toggleLabelForm(this.props.selected_category, this.props.kind);
    }
  };

  handleChange = e => {
    const {
      target: { name, value }
    } = e;
    this.setState(state => ({ ...state, [name]: value }));
  };

  handleSelectChange = selectedOptions => {
    this.setState({
      label_category_ids: selectedOptions.map(option => option.value)
    });
  };

  handleColorSelect = colorIndex =>
    this.setState(state => ({ ...state, colorIndex }));

  render() {
    if (this.state.flag == true) return true;
    const {
      props: { labelsCategory, selected_category },
      state: { colorIndex, name }
    } = this;

    let defaultIndex;
    const options = labelsCategory.map((category, index) => {
      if (category.id == selected_category) defaultIndex = index;
      return {
        label: category.attributes.name,
        value: category.id
      };
    });

    return (
      <div className="grid-item-menu">
        <form
          className="label-form label-tab-form"
          method="post"
          onSubmit={this.handleLabelFormSubmit}
        >
          <div className="label-tab-form-body p15">
            <div className="form-group row">
              <div className="col-md-12">
                <div className="col-md-4">
                  <input
                    type="text"
                    name="name"
                    onChange={this.handleChange}
                    value={name}
                    placeholder="Type label name"
                    className="form-control text-center label-main-input label-form-LC-view"
                    required
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="submit"
                    className="btn label-main-submit-btn submit-LC-form"
                    value="Save"
                  />
                </div>
                <div className="col-md-6 colors-LC-set">
                  <div className="colors-collection colors-LC-form">
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
              </div>
              <div className="col-md-6 select-LC-dropdown">
                <Select
                  defaultValue={[options[defaultIndex]]}
                  isMulti
                  onChange={this.handleSelectChange}
                  options={options}
                  placeholder="Select label categories"
                  className="select-label-category"
                />
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
  createLabel
};

export default connect(
  mapState,
  mapDispatch
)(LabelForm);
