import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import tiphive from '../../../lib/tiphive';
import createClass from 'create-react-class';

var GridPlaceholderItem = createClass({
  getInitialState: function() {
    return {
      deleted: false
    };
  },

  onDeleteClick: function(e) {
    e.preventDefault();

    this.setState({
      deleted: true
    });
  },

  render: function() {

    if (tiphive.isSupportDomain()) {
      return null;
    }

    const { tipViewMode } = this.props;
    let gridTypeClassName;

    switch (tipViewMode) {
      case 'list':
        gridTypeClassName = 'list-item';
        break;
      case 'small_grid':
        gridTypeClassName = 'small-grid-item';
        break;
      case 'grid':
        gridTypeClassName = 'grid-item';
        break;
    }

    var deleted   = this.state.deleted;
    var itemClass = classNames('panel', 'panel-default', gridTypeClassName, 'placeholder', { 'fade': deleted });
    var itemTitle = 'Example Card';

    var userAvatarUrl = window.currentUser.avatar_url || 'https://tiphiveupload.s3.amazonaws.com/assets/AvatarBeeThumb.png';

    return (
      <div className={itemClass} id="item-placeholder" key="item-placeholder">
        <div className="panel-heading">
          <img src={userAvatarUrl} className="img-circle item-avatar" width="30" height="30" />
          <Link to={'/users/' + window.currentUser.id} className="item-user-name">{window.currentUser.name}</Link>
          <a href="javascript:void(0)" className="item-user-name pull-right" style={{paddingTop: '5px'}}
             onClick={this.onDeleteClick}>
            delete
          </a>
        </div>
        <div className="panel-body">
          <h3 className="item-title">
            <span className="title-truncated">{itemTitle}</span>
            <span className="title-full">{itemTitle}</span>
          </h3>
          <div className="item-body" onClick={this.handleClick}>
            <p>A card can be anything you want to share: documents, article, link, video, list of tasks, meetings notes, tips, recommendations: Anything!</p>

            <p>Click the card to see a full page, add comments and edit your content</p>
          </div>
        </div>

        <div className="panel-footer">
          <div className="row">
            <div className="col-sm-4">

            </div>

            <div className="col-sm-8">
              <div className="pull-right">
                <a href="javascript:void(0)" className="btn btn-link btn-sm">
                  <i className='fa fa-comment-o'></i>
                </a>

                <a href="javascript:void(0)" className="btn btn-link btn-sm">
                  <i className='fa fa-heart-o'></i>
                </a>

                <a href="javascript:void(0)" className="btn btn-link btn-sm">
                  <i className="glyphicon glyphicon-option-vertical" />
                </a>
              </div>
            </div>
            <div className="col-sm-4"></div>
          </div>
        </div>
      </div>
    );
  }
});

export default GridPlaceholderItem;
