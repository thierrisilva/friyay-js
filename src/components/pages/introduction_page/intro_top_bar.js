import React from 'react';
import createClass from 'create-react-class';
import TipHiveLogo from '../../shared/tiphive_logo';

var IntroTopBar = createClass({
  render: function() {
    const { message, title, subtitle = null } = this.props;

    return (
      <div className="row intro-top-bar">
        <div className="col-sm-12 intro-logo">
          <TipHiveLogo />
        </div>

        <div className="col-sm-12 intro-message">
          <h4 className='text-muted'>{message}</h4>
        </div>

        <div className="col-sm-12 intro-title text-color-1">
          <h2>{title}</h2>
        </div>

        {subtitle !== null && (
          <div className="col-sm-12 intro-title" style={{color: '#888'}}>
            <h5 style={{
              maxWidth: 350,
              textAlign: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.5
            }}>{subtitle}</h5>
          </div>
        )}
      </div>
    );
  }
});

export default IntroTopBar;