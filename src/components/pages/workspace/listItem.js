import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import DomainLogo from 'Components/shared/DomainLogo';
import IconButton from 'Components/shared/buttons/IconButton';
import GenericDragContainer from 'Src/components/shared/drag_and_drop/GenericDragContainer';
import { getClickHandler } from 'Src/lib/utilities';

const ListItem = ({
  text,
  onExpand,
  selected,
  logo,
  url,
  fontAwesome,
  additionalClasses,
  rounded,
  item,
  itemType,
  dragDisabled,
  domain,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(text);

  const handleTitleChange = ({ target }) => {
    setTitle(target.value);
  };
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onEdit(title);
    }
  };
  return (
    <GenericDragContainer
      dragClassName={`ws-item ${selected && 'ws-item-selected'}`}
      item={item}
      itemType={itemType}
      onDropElsewhere={() => {}} // eslint-disable-line
      dragDisabled={dragDisabled}
      dragPreview={<div className="ws-drag-preview">{text}</div>}
    >
      {onEdit && isEditing ? (
        <input
          type="text"
          onChange={handleTitleChange}
          placeholder="Title"
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyPress}
          value={title}
          className="add-subtopic-input flex-1"
          autoFocus
        />
      ) : (
        <Fragment>
          <span>
            {logo ? (
              <IconButton
                additionalClasses={`${additionalClasses} dark-grey-icon-button`}
                icon={logo}
                fontAwesome={fontAwesome}
              />
            ) : (
              <DomainLogo
                name={text}
                color={domain && domain.attributes.color}
                componentClass={`left-menu__domain-icon ${rounded &&
                  'rounded-icon'}`}
              />
            )}
          </span>
          <a
            style={{ flex: 1 }}
            onClick={getClickHandler(
              () => {
                if (url) window.location.href = url;
              },
              () => setIsEditing(true)
            )}
          >
            {title}
          </a>
          {onExpand && (
            <IconButton
              additionalClasses="dark-grey-icon-button"
              icon="chevron_right"
              onClick={onExpand}
              tooltip="Expand"
            />
          )}
        </Fragment>
      )}
    </GenericDragContainer>
  );
};

ListItem.propTypes = {
  text: PropTypes.string,
  onExpand: PropTypes.func,
  selected: PropTypes.bool,
  logo: PropTypes.string,
  url: PropTypes.string,
  fontAwesome: PropTypes.bool,
  additionalClasses: PropTypes.string,
  rounded: PropTypes.bool,
  item: PropTypes.object,
  itemType: PropTypes.itemType,
  dragDisabled: PropTypes.bool,
  domain: PropTypes.object,
  onEdit: PropTypes.func
};

export default ListItem;
