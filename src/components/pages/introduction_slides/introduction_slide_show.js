import React, { Component } from 'react';
import TipHiveLogo from '../../shared/tiphive_logo';
import { withRouter } from 'react-router-dom';
import '../../../styles/components/intro/preview.scss';

class IntroductionSlideShow extends Component {
  render() {
    return (
      <div className="row no-gutter full-height width95 preview-container">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 full-height">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop30">
              <TipHiveLogo />
            </div>
          </div>

          <div className="flex-c-center col-sm-12 col-md-12 col-xs-12">
            <div className="text-center">
              <h4 className="title">
                Add cards to your yay to add a note, task, file, link, image and
                so forth.
              </h4>
              <h4 className="title">
                Visualize the cards with +30 different yay views.
              </h4>
            </div>
            <div
              id="intoSliderCarousel"
              className="carousel"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="item active">
                  <img
                    src="/images/topicExamples/card_example_onboarding.png"
                    alt="notes"
                  />
                </div>
              </div>
            </div>

            <a href="/introduction/create_hive">
              <button className="showCreateTopicPageButton">
                <p>
                  Ok let’s create your first yay
                  <i className="fa fa-long-arrow-right" />
                </p>
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(IntroductionSlideShow);
