import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEmpty, trim, compose, not } from 'ramda';
import set from 'lodash/set';
const isValid = compose(
  not,
  isEmpty,
  trim
);
import { createTopic } from 'Src/newRedux/database/topics/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import Icon from 'Components/shared/Icon';

class LeftMenuNewTopicInput extends Component {
  static propTypes = {
    handleTopicCreateSubmit: PropTypes.func,
    isSavingTopic: PropTypes.bool
  };

  state = {
    title: '',
    submitted: false
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown, true);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown, true);
  }

  handleKeyDown = e => {
    (e.key == 'Escape' || e.keyCode == 27) && this.props.onDismiss();
  };

  handleSubmit = async e => {
    e.preventDefault();
    const {
      props: { createTopic, onDismiss, parentTopicId, rootUrl, routerHistory },
      state: { title }
    } = this;
    const baseUrl = rootUrl == '/' ? rootUrl : rootUrl + '/';

    if (isValid(title)) {
      const newTopic = {
        attributes: {
          title: title,
          parent_id: parentTopicId
        }
      };
      const serverTopic = await createTopic(newTopic);
      routerHistory.push(
        `${baseUrl}yays/${serverTopic.data.data.attributes.slug}`
      );
    } else {
      this.setState(state => ({ ...state, submitted: true }));
    }

    onDismiss();
  };

  render() {
    const {
      props: { isSavingTopic },
      state: { submitted }
    } = this;

    return (
      <div
        className={classNames({
          'left-menu-add-topic-form': true,
          disabled: isSavingTopic
        })}
      >
        <form
          className="form-inline"
          method="post"
          onSubmit={this.handleSubmit}
        >
          <div className="form-group">
            <input
              type="text"
              name="topic[title]"
              className="form-control form-control-minimal text-center left-menu-add-topic-form_input"
              placeholder="Type yay name"
              id="topic_title"
              autoFocus
              onFocus={({ target }) => {
                target.selectionStart = target.selectionEnd =
                  target.value.length;
                target.setSelectionRange(
                  target.value.length,
                  target.value.length
                );
                target.scrollLeft = target.scrollWidth;
              }}
              onBlur={() =>
                this.setState(state => ({ ...state, submitted: false }))
              }
              required={submitted}
              onChange={({ target: { value } }) =>
                this.setState(state => ({ ...state, title: value }))
              }
            />
            <button
              style={{ color: '#A0A0A0', backgroundColor: 'transparent' }}
              type="submit"
              className="btn btn-default"
              data-disable-with="..."
            >
              <Icon fontAwesome icon={isSavingTopic ? '...' : 'check'} />
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    rootUrl: sm.page.rootUrl,
    routerHistory: sm.routing.routerHistory
  };
};

const mapDispatch = {
  createTopic
};

export default connect(
  mapState,
  mapDispatch
)(LeftMenuNewTopicInput);
