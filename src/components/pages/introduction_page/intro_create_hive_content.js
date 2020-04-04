import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createFirstTopic } from 'Actions/topic';
import { withRouter } from 'react-router';
import isEmpty from 'lodash/isEmpty';
import TipHiveLogo from '../../shared/tiphive_logo';

class IntroCreateHiveContent extends Component {
  static propTypes = {
    isSavingFirstTopic: PropTypes.bool,
    create: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  static defaultProps = {
    isSavingFirstTopic: false
  };

  state = {
    title: ''
  };

  onChange = ({ target: { value } }) =>
    this.setState(state => ({ ...state, title: value }));

  handleFormSubmit = async e => {
    e.preventDefault();

    const {
      state: { title },
      props: { create, history }
    } = this;

    if (isEmpty(title.trim())) {
      return false;
    }

    create(title);
    history.push('/introduction/explain_views');
  };

  handleContinueClick = () =>
    this.props.history.push('/introduction/explain_views');

  render() {
    const {
      props: { isSavingFirstTopic }
    } = this;

    const firstName = localStorage.getItem('user_first_name');

    let topMessage = 'Almost there!';
    if (firstName) {
      topMessage = `Almost there, ${firstName}!`;
    }

    return (
      <div className="row no-gutter full-height width95" id="create-hive">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 full-height">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop30">
              <TipHiveLogo />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-4 col-md-offset-4">
              <div className="join-section">
                <div className="onboarding-heading">
                  <h4 className="title2">Final step!</h4>
                  <h4 className="title2">Create your first yay.</h4>
                  <p className="sub-title">
                    Examples: Marketing, Product, Roadmap,
                    <br /> Project X, Home renovation, Trip to Rome
                  </p>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-xs-12 marginTop20 padding0">
                    <form onSubmit={this.handleFormSubmit}>
                      <div className="createTopicForm" id="hex-hive-form">
                        <div className="form-group">
                          <input
                            type="text"
                            id="topic_title"
                            name="topic[title]"
                            className="form-control"
                            placeholder="Type yay title"
                            required
                            onChange={this.onChange}
                          />
                          <span className="separator" />
                        </div>
                      </div>
                      <button
                        type="submit"
                        value="Create yay"
                        className="createTopicButton"
                        disabled={isSavingFirstTopic}
                      >
                        <p>
                          {isSavingFirstTopic ? 'Creating...' : 'Create yay'}
                          <i className="fa fa-long-arrow-right" />
                        </p>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = ({ topic: { isSavingFirstTopic } }) => ({
  isSavingFirstTopic
});
const mapDispatch = {
  create: createFirstTopic
};

export default connect(
  mapState,
  mapDispatch
)(withRouter(IntroCreateHiveContent));
