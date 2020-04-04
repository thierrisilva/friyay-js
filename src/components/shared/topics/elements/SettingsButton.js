import React, { Component } from 'react';
import {object} from 'prop-types';
import Ability from 'Lib/ability';
import tiphive from 'Lib/tiphive';

import TopicUpdateFormPage from '../../../pages/topic_update_form_page';



export default class SettingsButton extends Component {
  state = {isTopicUpdateOpen: false}

  static propTypes = {
    topic: object.isRequired
  }

  handleTopicEditClick = e => {
    e.preventDefault();
    const { props: { topic } } = this;
    if(topic && Ability.can('update', 'self', topic)) {
      tiphive.hideAllModals();
      this.setState(state => ({ ...state, isTopicUpdateOpen: true }));
    }
  }

  closeTopicUpdate = () =>
    this.setState(state => ({ ...state, isTopicUpdateOpen: false }));

  render() {
    const {topic} = this.props;
    const {isTopicUpdateOpen} = this.state;

    return(
      <div>
        <a className="btn btn-link edit-link" onClick={this.handleTopicEditClick}>
          <i className="fa fa-lg fa-cog" />
        </a>
        {isTopicUpdateOpen && (
          <TopicUpdateFormPage topic={topic} onClose={this.closeTopicUpdate} />
        )}
    </div>
    );
  }
}
