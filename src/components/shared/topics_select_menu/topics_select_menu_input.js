import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TopicsSelectMenuInput extends Component {
  constructor() {
    super();

    this.state = {
      selectedTopicOptions: []
    };
  }

  componentDidMount() {
    const {
      props: { id, disallowCreate }
    } = this;
    let selectizeOptions = {
      valueField: 'id',
      labelField: 'title',
      searchField: 'title',
      plugins: ['remove_button'],
      persist: false,

      onItemRemove: value => {
        this.props.handleTopicRemove(value);
      },

      load: (query, callback) => {
        this.props.handleTopicsFilter(query, this.props.parentID);
        callback();
      }
    };

    if (!disallowCreate) {
      selectizeOptions.create = (input, callback) => {
        this.props.handleTopicAdd(input, this.props.parentID);
        callback({ id: input, title: input });
      };
    }

    const $tagsInput = $(this.ref);
    $tagsInput.selectize(selectizeOptions);
    // const $input = $tagsInput.next().find('.selectize-input');
    // this.$dropdown = $tagsInput.parents('.topics-list-dropdown');
    // $input.on('focus',this.onInputFocus);
    // $input.on('blur', this.onInputBlur);
    document.addEventListener('click', this.onInputBlur);

    this.addAndSelectItems(id, this.props.selectedTopics);
  }

  componentDidUpdate(prevProps) {
    this.addAndSelectItems(this.props.id, this.props.selectedTopics);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onInputBlur);
  }

  addAndSelectItems(id, selectedTopics) {
    const $tagsInput = $(this.ref); // safer than by id
    const selectizedInput = $tagsInput[0].selectize;

    selectizedInput.clearOptions();
    selectizedInput.clear();
    selectizedInput.addOption(selectedTopics);

    for (let i = 0; i < selectedTopics.length; i++) {
      const topic = selectedTopics[i];
      selectizedInput.addItem(topic.id, false);
    }
  }

  onInputFocus = e => {
    const { onInputFocus } = this.props;
    onInputFocus && onInputFocus(e);
  };

  onInputBlur = e => {
    const userHives = e.path.filter(function(p) {
      return p.className && p.className.indexOf('user-hives') > -1;
    });
    if (userHives.length < 1) {
      const { onInputBlur } = this.props;
      onInputBlur && onInputBlur();
    }
  };

  render() {
    const {
      props: { name, id, multiple, inputMode }
    } = this;

    let defaultValue = '';
    if (multiple) {
      defaultValue = [''];
    }

    return (
      <div className="form-group" tabIndex="0" onFocus={this.onInputFocus}>
        <select
          ref={input => (this.ref = input)}
          className="form-control topics-menu-selectize"
          name={name}
          id={id}
          required={this.props.isRequired}
          multiple={multiple}
          defaultValue={defaultValue}
          // onFocus={this.onInputFocus}
        />
      </div>
    );
  }
}

TopicsSelectMenuInput.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  selectedTopics: PropTypes.array,
  multiple: PropTypes.bool,
  handleTopicRemove: PropTypes.func,
  handleTopicAdd: PropTypes.func,
  parentID: PropTypes.any,
  handleTopicsFilter: PropTypes.func
};

TopicsSelectMenuInput.defaultProps = {
  name: 'tip[topic_ids]',
  id: 'tip_topic_ids',
  selectedTopics: [],
  multiple: true
};

export default TopicsSelectMenuInput;
