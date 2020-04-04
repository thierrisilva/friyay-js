import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import colours from 'Lib/colours';
import IconHex from 'Components/svg_icons/icon_hex';
import { FormInput, FormTextArea } from 'Components/shared/forms';

class TopicSharingEditor extends PureComponent {
  handleSetTopicDescription = description => {
    const { topic, onChangeTopic } = this.props;
    const attributes = {
      ...topic.attributes,
      description
    };
    onChangeTopic({ attributes });
  };

  handleSetTopicTitle = title => {
    const { topic, onChangeTopic } = this.props;
    const attributes = {
      ...topic.attributes,
      title
    };
    onChangeTopic({ attributes });
  };

  render() {
    const { topic, onUpdate } = this.props;

    return (
      <div className="topic-details-editor">
        <div className="topic-details-editor_title-container">
          <IconHex
            width="100%"
            height="100%"
            fill="rgb(245,245,245)"
            scaleViewBox={false}
            strokeWidth="0"
          />

          <div className="topic-details-editor_title">
            <FormInput
              autoFocus
              centreText
              defaultValue={topic.attributes.title}
              onChange={this.handleSetTopicTitle}
              placeholder="yay title"
            />
          </div>
        </div>
        <div className="topic-details-editor_description-container">
          <FormTextArea
            className="topic-details-editor_description"
            defaultValue={topic.attributes.description}
            placeholder="Optional: Describe what this yay is about"
            onChange={this.handleSetTopicDescription}
          />
        </div>
      </div>
    );
  }
}

export default TopicSharingEditor;
