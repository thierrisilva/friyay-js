import React from 'react';
import IntroTopBar from './intro_top_bar';

const SideAWrapper = (props) => {
  var componentClassName = 'col-sm-12 full-height';
  if (props.fullHeight === false) {
    componentClassName = 'col-sm-12';
  }

  return (
    <div className={componentClassName} style={{ overflow: 'auto' }}>
      <div className="full-height join-section" style={{ backgroundColor: 'white' }}>
        <IntroTopBar message={props.topMessage} title={props.title} subtitle={props.subtitle} />

        <div className="row">
          <div className={props.childrenWrapperClassName}>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

SideAWrapper.defaultProps = {
  fullHeight: true,
  childrenWrapperClassName: "col-sm-6 col-sm-offset-3 col-lg-4 col-lg-offset-4 col-xxlg-3 col-xxlg-offset-5"
};

export default SideAWrapper;