/* global navigator */

import React from 'react';

const disclaimerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  marginTop: '15%',
  marginBottom: '15%'
};

const paragraphStyle = {
  maxWidth: 400
};

const gridStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
  maxWidth: 400
};

const isWindows = navigator.appVersion.indexOf('Win') !== -1;
const isMac = navigator.appVersion.indexOf('Mac') !== -1;

const defaultText = `
  Hi! It looks like you are using Internet Explorer, which has not been able to keep 
  up with the latest technology Friyay uses. Please use
`;

let disclaimer = null;

if (isWindows) {
  disclaimer = [defaultText, 'Chrome, Firefox or Edge.'].join(' ');
} else if (isMac) {
  disclaimer = [defaultText, 'Chrome, Firefox or Safari.'].join(' ');
} else {
  disclaimer = [defaultText, 'Chrome or Firefox.'].join(' ');
}

const NotSupported = () => (
  <div style={disclaimerStyle}>
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 81.86 81.86"
      height="64"
      width="64"
    >
      <title>Friyay_logo</title>
      <circle cx="40.93" cy="40.93" r="40.93" style={{ fill: '#1d9ad6' }} />
      <path
        d="M45.7,40.89a9.91,9.91,0,0,0,0-19.83"
        transform="translate(-4.07 -4.07)"
        style={{ fill: '#ededed' }}
      />
      <path
        d="M44.2,40.85a6.13,6.13,0,0,0-12.27,0"
        transform="translate(-4.07 -4.07)"
        style={{ fill: '#ededed' }}
      />
      <path
        d="M26.89,43.28a19.61,19.61,0,0,0,3,10.43l-7.07,5.67,12-.3a20.16,20.16,0,0,0,32.38-15.8H26.89Zm4.39,1.48,5.1,0s0.94,12.09,1.48,12.81Zm7.31,0,5.13,0s0.91,12.05,1.45,12.78Zm6.87,0,5.08,0s1,12.09,1.5,12.81Zm15,5.51a1.7,1.7,0,1,1,1.71-1.7A1.7,1.7,0,0,1,60.42,50.27Z"
        transform="translate(-4.07 -4.07)"
        style={{ fill: '#ededed' }}
      />
    </svg>
    <p style={paragraphStyle}>
      {disclaimer}
      <label style={{ display: 'block', marginTop: 10 }}>Continue with:</label>
    </p>
    <div style={gridStyle}>
      <a href="https://www.google.com/chrome/browser/desktop/index.html">
        <img src="/images/browsers/chrome.png" />
      </a>
      {isMac && <img src="/images/browsers/safari.png" />}
      <a href="https://www.mozilla.org/en-US/firefox/new/">
        <img src="/images/browsers/firefox.png" />
      </a>
      {isWindows && (
        <a href="https://www.microsoft.com/en-us/windows/microsoft-edge">
          <img src="/images/browsers/edge.png" />
        </a>
      )}
    </div>
  </div>
);

export default NotSupported;
