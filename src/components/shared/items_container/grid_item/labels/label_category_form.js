/* global vex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createLabelCategory } from 'Src/newRedux/database/labelCategories/thunks';

class ItemLabelCategoryForm extends Component {
  state = {
    name: '',
    flag: false
  };

  handleLabelCategoryChange = ({ target: { value } }) => {
    this.setState(state => ({ ...state, name: value }));
  };

  cancelLabelCategory = () => {
    this.setState({ flag: true });
    this.props.toggleLabelCategoryForms(this.props.kind);
  };

  handleLabelCategoryFormSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();
    const { name } = this.state;
    const { createLabelCategory } = this.props;

    if (name) {
      await createLabelCategory(name);
      this.setState({ flag: true });
      this.props.toggleLabelCategoryForms(this.props.kind);
    }
  };

  render() {
    if (this.state.flag == true) {
      return true;
    }

    const {
      state: { name }
    } = this;

    return (
      <div>
        <form
          className="form-inline"
          method="post"
          onSubmit={this.handleLabelCategoryFormSubmit}
        >
          {/* <div className="form-group"> */}
          <input
            type="text"
            name="name[title]"
            value={name}
            onChange={this.handleLabelCategoryChange}
            className="form-control text-center label-category-input"
            placeholder="Type label category"
            id="label_category_name_id"
          />
          <button type="submit" className="btn label-category-submit-btn">
            Save
          </button>
          <button
            className="btn label-category-cancel-btn"
            onClick={() => this.cancelLabelCategory()}
          >
            Cancel
          </button>
          {/* </div> */}
        </form>
      </div>
    );
  }
}

ItemLabelCategoryForm.propTypes = {
  createLabelCategory: PropTypes.func.isRequired
};

const mapState = () => ({});

const mapDispatch = {
  createLabelCategory
};

export default connect(
  mapState,
  mapDispatch
)(ItemLabelCategoryForm);
