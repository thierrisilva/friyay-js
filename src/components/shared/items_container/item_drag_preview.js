import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import StringHelper from '../../../helpers/string_helper';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import { VIEWS_ENUM } from 'Enums';

export const ItemDragPreview = ({item, viewType}) => {
	const cardData = item;
	const { attributes } = cardData;
	const { creator } = attributes;
	const isTaskPreview = viewType === VIEWS_ENUM.TASK;
	const isWikiPreview = viewType === VIEWS_ENUM.WIKI;

	const itemDragPreviewClasses = classNames(
		'item-drag-preview',
		{
			'item-drag-list-preview': isTaskPreview,
			'item-drag-wiki-preview': isWikiPreview
		}
	);

	return(
		<div className={itemDragPreviewClasses}>
			{ isTaskPreview &&
				<UserAvatar user={ creator } />
			}
			{ isWikiPreview &&
				<span className="material-icons pr5">description</span>
			}
			<h3 className="drag-preview-title">{StringHelper.truncate(attributes.title, 40)}</h3>
		</div>
	);
};

ItemDragPreview.propTypes = {
	item: PropTypes.object,
	viewType: PropTypes.number
};

export default ItemDragPreview;
