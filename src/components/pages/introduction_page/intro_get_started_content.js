import React from 'react';
import { Link } from 'react-router-dom';
import createClass from 'create-react-class';

var IntroGetStartedContent = createClass({
  render: function() {
    var videoSrc =
      'https://www.youtube.com/embed/6Zp6HcplU6w?autoplay=0&controls=0&rel=0&showinfo=0';

    return (
      <div className="intro-content intro-get-started">
        <div className="row intro-section" id="what-you-can-do">
          <div className="intro-subheading">
            <Link to="/introduction/create_hive" className="skip-link">
              SKIP
            </Link>
          </div>

          <iframe
            id="ytplayer"
            type="text/html"
            width="640"
            height="390"
            src={videoSrc}
            frameBorder="0"
          />
        </div>

        <div className="row intro-section" id="follow-or-create">
          <div className="col-sm-6 col-lg-4 col-lg-offset-2 intro-text">
            <div className="step-number">1</div>
            <h1>
              Follow or
              <br />
              Create yays
            </h1>
            <p>
              Each yay can contain more yays or Cards.
              <br />
              Follow or create yays you want to share.
            </p>
          </div>

          <div className="col-sm-6 col-lg-4 intro-graphic">
            <img src="/images/intro/public-intro-01.png" />
          </div>
        </div>

        <div className="row intro-section" id="collaborate">
          <div className="col-sm-6 col-lg-4 col-lg-offset-2 intro-text">
            <div className="step-number">2</div>
            <h1>Collaborate</h1>
            <p>
              Quickly gather people <em>in</em> the know and
              <br />
              fill a yay with <em>what</em> they know.
              <br />
              Cards are any type of information you share.
            </p>
          </div>

          <div className="col-sm-6 col-lg-4 intro-graphic">
            <img src="/images/intro/public-intro-02.png" />
          </div>
        </div>

        <div className="row intro-section" id="search-and-learn">
          <div className="col-sm-6 col-lg-4 col-lg-offset-2 intro-text">
            <div className="step-number">3</div>
            <h1>Search &amp; Learn</h1>
            <p>
              The best cards from the best,
              <br />
              at your fingertips!
            </p>
          </div>

          <div className="col-sm-6 col-lg-4 intro-graphic">
            <img src="/images/intro/public-intro-03.png" />
          </div>
        </div>

        <div className="row intro-section" id="next-section">
          <h3 className="intro-heading">
            Good learning! You are now ready to unlock the power.
          </h3>

          <Link
            to="/introduction/create_hive"
            className="btn btn-default btn-next"
          >
            &#8594;
          </Link>
        </div>
      </div>
    );
  }
});

export default IntroGetStartedContent;
