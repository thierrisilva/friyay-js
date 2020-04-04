import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';

import FilterLabelChip from 'Components/shared/labels/elements/FilterLabelChip';
import SearchEngine from 'Lib/search_engine';
import withDataManager from 'Src/dataManager/components/withDataManager';

class SearchInput extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    multipleValues: PropTypes.bool,
    placeholder: PropTypes.string,
    type: PropTypes.oneOf(['tips', 'topics', 'users']),
    value: PropTypes.array,
    onChange: PropTypes.func.isRequired
  };

  state = { inputValue: '', isOpen: false };

  componentDidMount() {
    const $searchInput = $(`#${this.props.id}`);

    SearchEngine.clear();

    $searchInput.typeahead(
      {
        classNames: {
          menu: 'search-input__menu tt-menu',
          open: 'search-input__menu--open',
          suggestion: 'search-input__menu-item',
          cursor: 'search-input__menu-item--hover'
        },
        hint: false
      },
      {
        source: SearchEngine.ttAdapter(),
        limit: 20,
        templates: { suggestion: this.renderSuggestion },
        display: item => item.name
      }
    );

    $searchInput.bind('typeahead:select', this.handleSuggestionSelect);
  }

  componentWillReceiveProps({ multipleValues, value }) {
    if (!multipleValues) {
      if (value && value.length) {
        this.setState({ inputValue: value[0].title });
      } else {
        this.setState({ inputValue: '' });
      }
    }
  }

  toggleDropdownState = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleInputChange = ev => {
    this.setState({ inputValue: ev.target.value });
  };

  handleSuggestionSelect = (ev, { id, name: title, resource_type: type }) => {
    let nextValue;

    if (this.props.multipleValues) {
      nextValue = this.props.value
        .filter(val => val.id !== id)
        .concat({ id, title, type });
    } else {
      nextValue = [{ id, title, type }];
    }

    this.handleValueChange(nextValue);
  };

  handleValueChange(value) {
    if (this.props.multipleValues) {
      const $searchInput = $(`#${this.props.id}`);

      $searchInput.typeahead('val', '');
      this.setState({ inputValue: '' });
    }

    this.props.onChange(value);
  }

  removeOption(optionId) {
    const nextValue = this.props.value.filter(({ id }) => id !== optionId);
    this.handleValueChange(nextValue);
  }

  render() {
    const searchClassNames = classNames(this.props.className, 'search-input');
    const inputClassNames = classNames('search-input__input', {
      'search-input__input--single-active-value':
        !this.props.multipleValues &&
        this.props.value &&
        this.props.value.length
    });

    return (
      <div className={searchClassNames}>
        {this.props.multipleValues && (
          <div className="search-input__values">
            {(this.props.value || []).map(({ id, title }) => (
              <FilterLabelChip
                key={id}
                className="search-input__value-chip"
                title={title}
                onRemoveClick={() => this.removeOption(id)}
              />
            ))}
          </div>
        )}
        <input
          id={this.props.id}
          className={inputClassNames}
          disabled={
            !this.props.multipleValues &&
            this.props.value &&
            this.props.value.length
          }
          placeholder={this.props.placeholder}
          value={this.state.inputValue}
          onBlur={this.toggleDropdownState}
          onChange={this.handleInputChange}
          onFocus={this.toggleDropdownState}
        />
        {this.props.multipleValues ? (
          <span className="search-input__chevron material-icons">
            {this.state.isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
          </span>
        ) : (
          <span
            className="search-input__clear material-icons"
            onClick={() => this.removeOption(this.props.value[0].id)}
          >
            {this.props.value && this.props.value.length ? 'close' : ''}
          </span>
        )}
      </div>
    );
  }

  renderSuggestion = item => {
    const isSelected = !!this.props.value.find(val => val.id === item.id);

    if (item.resource_type !== this.props.type || isSelected) {
      return $(document.createDocumentFragment());
    }

    switch (item.resource_type) {
      case 'tips':
        return $(
          renderToString(
            <div className="search-input__suggestion">
              <span className="search-input__suggestion-title">
                {item.name}
              </span>
              <span className="search-input__suggestion-details">
                {item.data.attributes.topic_paths[0].join(' / ')}
              </span>
            </div>
          )
        );
      case 'users':
        return $(
          renderToString(
            <div className="search-input__sugestion">
              <span className="search-input__suggestion-title">
                {item.name}
              </span>
            </div>
          )
        );
      default:
        return $(document.createDocumentFragment());
    }
  };
}

const dataRequirements = () => ({ people: {} });

const mapState = ({ _newReduxTree: { database: db } }, { type, value }) => ({
  value: (value || []).map(val => {
    if (val.title) return val;

    switch (type) {
      case 'tips': {
        const tipId = Object.keys(db.cards).find(id => id == val.id);
        const title = tipId
          ? db.cards[tipId].attributes.title
          : `${type}:${val.id}`;

        return { ...val, title };
      }
      case 'users': {
        const user = db.people[val.id];
        const title = user ? user.attributes.name : `${type}:${val.id}`;

        return { ...val, title };
      }
      default:
        return val;
    }
  })
});

export default withDataManager(
  dataRequirements,
  mapState,
  null,
  { dontShowLoadingIndicator: true }
)(SearchInput);
