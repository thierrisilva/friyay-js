import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ColorBlock from '../color_block';
import { saveLabel } from '../../../actions/labels';
import { inc } from 'ramda';

class AddLabelForm extends Component {
  static propTypes = {
    save: PropTypes.func.isRequired,
    switchView: PropTypes.func.isRequired,
    labelType: PropTypes.string.isRequired
  };

  state = {
    name: '',
    kind: '',
    colorIndex: 1
  };

  handleColorSelect = colorIndex =>
    this.setState(state => ({ ...state, colorIndex }));

  handleLabelFormSubmit = async e => {
    e.preventDefault();
    const {
      props: { switchView, save, labelType: kind },
      state: { name, colorIndex: color }
    } = this;

    save({ name, kind, color });
    switchView('label_list');
  }

  handleLabelNameChange = ({ target: { value } }) =>
    this.setState(state => ({ ...state, name: value }));

  render() {
    const {
      props: { switchView, labelType },
      state: { name, colorIndex }
    } = this;
    return (
      <div className="add-form-label">
        <div className="flex-r-center-spacebetween mb10">
          <label>Add {labelType} Label</label>
          <a href="javascript:void(0)" onClick={() => switchView('label_list')}>
            <i className="fa fa-lg fa-close" />
          </a>
        </div>
        <form
          className="label-form label-tab-form"
          onSubmit={this.handleLabelFormSubmit}
        >
          <div className="panel-body p0">
            <div className="form-group">
              <input
                type="text"
                value={name}
                onChange={this.handleLabelNameChange}
                className="form-control full-border"
                placeholder="Type label name"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <ColorBlock
                    key={`color-block-${i}`}
                    colorIndex={inc(i)}
                    onSelect={this.handleColorSelect}
                    selected={colorIndex === inc(i)}
                  />
                ))}
            </div>
          </div>
          <div className="panel-footer flex-r-center-end pt10 pr0 mt10">
            <button type="submit" className="btn btn-primary btn-sm">
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapState = () => ({});
const mapDispatch = { save: saveLabel };

export default connect(mapState, mapDispatch)(AddLabelForm);
