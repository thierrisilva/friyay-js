import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ItemContentLabels from '../item_content_labels';
import CardAssigneeLabel from 'Components/shared/cards/elements/CardAssigneeLabel';
import CardDueDateLabel from 'Components/shared/cards/elements/CardDueDateLabel';
import CardWorkEstimationLabel from 'Components/shared/cards/elements/CardWorkEstimationLabel';

const ItemContentFooter = ({ handleStarClick, handleLikeClick, tip, labels }) => {

	const {
		attributes: {
			comments_count,
			likes_count,
			starred_by_current_user,
			liked_by_current_user
		},
		relationships: {
			labels: {
				data
			}
		}
	} = tip;


  let labelsContent;

  if (data && data.length > 0) {
    labelsContent = (
      <ItemContentLabels
        tip={tip}
        labels={data.map( labelId => labels[ labelId ] )}
      />
    );
  }

  const likeIconType = liked_by_current_user
		? 'favorite'
		: 'favorite_border';

  const starIconType = starred_by_current_user
		? 'star'
		: 'star_border';

  const labelClass = classNames({
    'labels-list-root': true,
    'labels-more': data.length > 1
  });

  return (
    <div className="flex-r-center-spacebetween item-content-footer">
      <div className={labelClass}>
        {labelsContent}
      </div>
      <div className="flex-r-center">

        <CardAssigneeLabel
          card={tip}
          className="item-content-footer__item"
          showTooltip
        />

        <CardDueDateLabel
          card={tip}
          className="item-content-footer__item"
          hideOnUndefinedValue={false}
          showTooltip
        />

        <CardWorkEstimationLabel
          card={tip}
          className="item-content-footer__item"
          hideOnUndefinedValue={false}
          showTooltip
        />

        <a
          className={classNames('btn btn-link flex-r-center', likeIconType)}
          onClick={handleLikeClick}
        >
          <i className="material-icons">favorite</i>
          <span className="ml5">{likes_count}</span>
        </a>

        <a
          className={classNames('btn btn-link flex-r-center', starIconType)}
          onClick={handleStarClick}
        >
          <i className="material-icons">star</i>
        </a>
      </div>
    </div>
  );
};

ItemContentFooter.propTypes = {
  tip: PropTypes.object.isRequired,
  handleLikeClick: PropTypes.func.isRequired,
  handleStarClick: PropTypes.func.isRequired,
};

const mapState = (state, props) => ({
	labels: state._newReduxTree.database.labels
})


export default connect( mapState)( ItemContentFooter );
