import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const slideStyle = {
  transition: 'transform .3s',
  width: '100%',
  flex: '0 0 100%'
};

const titleStyle = {
  fontFamily: '\'Helvetica Neue\', sans-serif',
  fontWeight: 700, 
  textAlign: 'center',
  fontSize: '48pt',
  color: '#369ad6'
};

const subtitleStyle = {
  textAlign: 'center', 
  fontWeight: 400, 
  fontSize: 22
};

export default class IntroductionSlide extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]).isRequired,
    tfStyle: PropTypes.object
  }

  static defaultProps = {
    tfStyle: {}
  };

  render() {
    const { props: { title, subtitle, children, tfStyle } } = this;

    return (
      <div className="flex-c-center" style={{...tfStyle, ...slideStyle}}>
        <h2 style={titleStyle}>{title}</h2>
        <h4
          className="mb20"
          style={subtitleStyle}
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
        {children}
      </div>
    );
  }
}
