import React, { Component } from 'react';
import TipHiveLogo from '../../shared/tiphive_logo';
import { withRouter } from 'react-router-dom';
import '../../../styles/components/intro/preview.scss';

class IntroductionPreviewImg extends Component {
  render() {
    const { productExplanation } = this.props;
    return (
      <div className="row no-gutter full-height width95 preview-container">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 full-height">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop30">
              <TipHiveLogo />
            </div>
          </div>

          <div className="flex-c-center col-sm-12 col-md-12 col-xs-12">
            <div className="secondaryIconImage">
              <img src={productExplanation.img_url_2} />
            </div>
            {productExplanation &&
              productExplanation.title.map((title, i) => (
                <h4 key={i} className="title">
                  {title}
                </h4>
              ))}
            <img
              className="preview-img"
              src={productExplanation.img_url}
              alt={productExplanation.alt}
            />
            {productExplanation.textContent && (
              <div className="additionalTextContent">
                <h5>{productExplanation.textContent}</h5>
              </div>
            )}
            {productExplanation.actionText &&
              (productExplanation.actionType == 'url' ? (
                <a href={productExplanation.action}>
                  <button className={productExplanation.actionButtonClass}>
                    <p>
                      {productExplanation.actionText}
                      <i className="fa fa-long-arrow-right" />
                    </p>
                  </button>
                </a>
              ) : (
                <a onClick={productExplanation.action}>
                  <button className={productExplanation.actionButtonClass}>
                    <p>
                      {productExplanation.actionText}
                      <i className="fa fa-long-arrow-right" />
                    </p>
                  </button>
                </a>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(IntroductionPreviewImg);
