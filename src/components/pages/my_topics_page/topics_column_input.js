import React from 'react';
import createClass from 'create-react-class';

var TopicsColumnInput = createClass({
  render: function() {
    return (
      <li className="list-group-item">
        <form
          className="form-inline"
          method="post"
          onSubmit={this.props.handleTopicCreateSubmit}
        >
          <div className="input-group">
            <input
              type="text"
              name="topic[title]"
              className="form-control"
              placeholder="Type yay name"
              id="topic_title"
              ref="topicTitle"
              required
            />
            <span className="input-group-btn">
              <input
                type="submit"
                name="submit"
                className="btn btn-default"
                value="Create"
              />
            </span>
          </div>
        </form>
      </li>
    );
  }
});

export default TopicsColumnInput;
