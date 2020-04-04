import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IntroSlide from './introduction_slide';
import SlideOrchestrator from './slideshow_orchestrator';
import Auth from 'Lib/auth';
import tiphive from 'Lib/tiphive';
import { withRouter } from 'react-router-dom';
import qs from 'querystringify';

const headerStyle = {
  fontFamily: "'Damion', cursive",
  fontSize: '30pt'
};
var videoSrc =
  'https://www.youtube.com/embed/6Zp6HcplU6w?autoplay=0&controls=0&rel=0&showinfo=0';

const containerStyle = {
  backgroundColor: '#FAFAFA',
  margin: '0 -20px',
  padding: 20,
  minHeight: 630
};

class IntroductionSlideShow extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  componentWillMount() {
    window.currentUser = Auth.getUser();
  }

  componentDidMount() {
    tiphive.detectScrollEnd();

    $('#app-container').css({
      height: '100%',
      backgroundColor: '#FAFAFA'
    });

    setInterval(function() {
      $('#slideshow > img:first')
        .fadeOut(1000)
        .next()
        .fadeIn(1000)
        .end()
        .appendTo('#slideshow');
    }, 3000);
  }

  componentWillUnmount() {
    $('#app-container').css({
      height: '',
      backgroundColor: ''
    });
  }

  finishTour = () => {
    const {
      props: {
        location: { search },
        history
      }
    } = this;
    const queryStrings = qs.parse(search);

    queryStrings.redirect_topic !== undefined
      ? history.push(`/yays/${queryStrings.redirect_topic}`)
      : history.push('/');
  };

  render() {
    return (
      <div className="full-height flex-c-center row" style={containerStyle}>
        <h1 style={headerStyle}>Quick Introduction To Friyay</h1>
        <SlideOrchestrator onSubmit={this.finishTour}>
          <IntroSlide
            title="Cards"
            subtitle="A quick way to share bite-sized information:<br />Text, files, images, tables, links and more"
          >
            <div className="flex-r-center-center">
              <img className="img-responsive" src="/images/intro/card.png" />
            </div>
          </IntroSlide>
          <IntroSlide
            title="Topics"
            subtitle="The easiest and most flexible way to organize cards"
          >
            <div className="flex-r-center-center">
              <img className="img-responsive" src="/images/intro/topic.png" />
            </div>
          </IntroSlide>
          <IntroSlide
            title="Views"
            subtitle="Create, Read, Plan, Collaborate:<br />Easily switch to the best view of your cards"
          >
            <div
              className="flex-r-center-center"
              style={{
                margin: '30px auto',
                position: 'relative',
                width: 500,
                height: 300,
                padding: 10
              }}
              id="slideshow"
            >
              <img
                src="/images/intro/card_list.png"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 75,
                  maxHeight: 250
                }}
              />
              <img
                src="/images/intro/hexagone.png"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 75,
                  display: 'none',
                  maxHeight: 250
                }}
              />
              <img
                src="/images/intro/kanban.png"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 75,
                  display: 'none',
                  maxHeight: 250
                }}
              />
            </div>
          </IntroSlide>
          <IntroSlide title="Getting Started" subtitle="">
            <iframe
              id="ytplayer"
              type="text/html"
              width="640"
              height="390"
              src={videoSrc}
              frameBorder="0"
            />
          </IntroSlide>
        </SlideOrchestrator>
      </div>
    );
  }
}

export default withRouter(IntroductionSlideShow);
