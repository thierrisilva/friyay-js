import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from 'Components/shared/buttons/IconButton';
import {
  getSortedFilteredCardsByTopic,
  getSortedFilteredNonNestedCardsByTopicWithoutDescendants
} from 'Src/newRedux/database/cards/selectors';
import { getSortedTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';
import { createTopic, updateTopic } from 'Src/newRedux/database/topics/thunks';
import { createCard, updateCard } from 'Src/newRedux/database/cards/thunks';
import { getClickHandler } from 'Src/lib/utilities';

import TabSpecificUI from './tab_specific_ui';
import './tree_view.scss';

const generateTree = (subTopics, cards) => {
  return [
    ...subTopics.map(st => ({
      id: st.id,
      title: (st.attributes || {}).title,
      type: st.type,
      card: st
    })),
    ...cards.map(st => ({
      id: st.id,
      title: (st.attributes || {}).title,
      type: st.type,
      card: st
    }))
  ];
};

const Row = ({
  hasTree,
  card,
  depth,
  tab,
  showAddIcon,
  onRowChecked,
  parentTopic,
  rootCard,
  subTopics,
  cards,
  createSubtopic,
  updateTopic,
  createCard,
  updateCard,
  selectedId,
  onRowSelect,
  disableOn
}) => {
  const [expand, setExpand] = useState(true);
  const [addInput, setAddInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [title, setTitle] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [type, setType] = useState('');

  if (!hasTree) {
    card = {
      id: rootCard.id,
      title: (rootCard.attributes || {}).title,
      type: rootCard.type,
      children: generateTree(rootCard.type === 'topics' ? subTopics : [], cards)
    };
  }

  const handleCardEdit = e => {
    if (e.key === 'Enter') {
      if (card.type === 'topics') {
        updateTopic({ id: card.id, attributes: { title: editedTitle } });
      } else {
        updateCard({ id: card.id, attributes: { title: editedTitle } });
      }
      setEditedTitle('');
      setIsEditing(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      if (type === 'topics') {
        createSubtopic({
          attributes: {
            title,
            parent_id: card.id
          }
        });
      } else {
        createCard({
          attributes: { title },
          relationships:
            card.type === 'topics'
              ? { topics: { data: [card.id] } }
              : {
                  follows_tip: { data: card.id },
                  topics: { data: [parentTopic.id] }
                }
        });
      }
      setTitle('');
      setAddInput(false);
    }
  };

  return (
    <div className="tree-node">
      <div
        className={`tree-row ${disableOn === card.type && 'disabled-row'}`}
        style={{ paddingLeft: depth ? depth * 25 : 15 }}
      >
        <div className="generic-component">
          {showAddIcon ? (
            <IconButton
              icon="plus"
              fontAwesome
              additionalClasses="green-icon-button"
              onClick={() => {
                if (card.type === 'topics') {
                  setShowMenu(!showMenu);
                } else {
                  setExpand(true);
                  setAddInput(true);
                  setShowMenu(false);
                  setType('tips');
                }
              }}
            />
          ) : (
            <div style={{ paddingLeft: 30 }} />
          )}
          {showMenu && (
            <ul
              className="dropdown-menu"
              id="domain-dropdown"
              style={{ display: showMenu ? 'block' : 'none' }}
            >
              <li>
                <a
                  onClick={() => {
                    setExpand(true);
                    setAddInput(true);
                    setShowMenu(false);
                    setType('tips');
                  }}
                >
                  <strong>Card</strong>
                  <br />
                  For light creating and planning such as a note, task, article
                  or link
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    setExpand(true);
                    setAddInput(true);
                    setShowMenu(false);
                    setType('topics');
                  }}
                >
                  <strong>Yay</strong>
                  <br />
                  For more advanced creating, planning and organizing with
                  views, sort and filters - pages, boards, timelines, sheets,
                  categories
                </a>
              </li>
            </ul>
          )}
          {onRowChecked && !!depth && (
            <input
              type="checkbox"
              name={card.title}
              onChange={() => onRowChecked(card)}
              className="tree-checkbox big-checkbox"
            />
          )}
          <IconButton
            icon={expand ? 'caret-down' : 'caret-right'}
            fontAwesome
            additionalClasses="dark-grey-icon-button"
            style={{ zIndex: 1 }}
            onClick={() => setExpand(!expand)}
          />
          <IconButton
            icon={card.type == 'topics' ? 'square' : 'file-text'}
            fontAwesome
            additionalClasses={
              card.type === 'topics'
                ? 'rectangle-icon'
                : 'file-icon dark-grey-icon-button'
            }
          />
          {!isEditing ? (
            <span
              className={!depth && 'first-row'}
              onClick={getClickHandler(
                () => disableOn !== card.type && onRowSelect(card),
                () => {
                  setEditedTitle(card.title);
                  setIsEditing(true);
                }
              )}
            >
              {card.title}
            </span>
          ) : (
            <input
              type="text"
              value={editedTitle}
              onChange={({ target }) => setEditedTitle(target.value)}
              onKeyPress={handleCardEdit}
              onKeyDown={handleCardEdit}
              className="tree-row add-subtopic-input"
              autoFocus
            />
          )}
        </div>
        <TabSpecificUI
          tab={tab}
          rootCard={rootCard}
          isSelected={selectedId === card.id}
        />
        {disableOn === card.type && <div className="disabled-row-overlay" />}
      </div>
      <div className={`tree-children ${expand ? 'expanded' : 'collapsed'}`}>
        {card.children.map((child, idx) => (
          <RowWrapped
            key={`${child.title}${idx}${depth}`}
            card={child}
            depth={depth + 1}
            hasTree={hasTree}
            parentTopic={
              child.card && child.card.type === 'topics'
                ? child.card
                : parentTopic
            }
            rootCard={child.card}
            tab={tab}
            showAddIcon={showAddIcon}
            onRowChecked={onRowChecked}
            onRowSelect={onRowSelect}
            selectedId={selectedId}
            disableOn={disableOn}
          />
        ))}
        {addInput && (
          <input
            type="text"
            placeholder={`Type${type == 'topics' ? ' Smart' : ''} card title`}
            onChange={({ target }) => setTitle(target.value)}
            onKeyPress={handleKeyPress}
            onKeyDown={handleKeyPress}
            className="tree-row add-subtopic-input"
            style={{ padding: 22, paddingLeft: (depth + 1) * 25 + 20 }} // calculate relevent padding
            autoFocus
          />
        )}
      </div>
    </div>
  );
};

const mapState = (state, props) => {
  if (!props.rootCard) {
    return {
      cards: [],
      subTopics: []
    };
  }

  const nestedCards =
    props.rootCard.type === 'topics'
      ? getSortedFilteredNonNestedCardsByTopicWithoutDescendants(state)[
          props.rootCard.id
        ] || []
      : (
          getSortedFilteredCardsByTopic(state)[props.parentTopic.id] || []
        ).filter(
          card =>
            card.relationships.follows_tip &&
            card.relationships.follows_tip.data === props.rootCard.id
        );

  return {
    cards: nestedCards,
    subTopics: getSortedTopicsByParentTopic(state)[props.rootCard.id] || []
  };
};

const mapDispatch = {
  createSubtopic: createTopic,
  updateTopic,
  createCard,
  updateCard
};

const RowWrapped = connect(
  mapState,
  mapDispatch
)(Row);

const TreeView = ({
  tree,
  onRowChecked,
  parentTopic,
  tab,
  showAddIcon,
  disableOn
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const card = {
    id: parentTopic.id,
    title: (parentTopic.attributes || {}).title,
    type: parentTopic.type,
    children: tree
  };
  return (
    <div className={`tree-wrapper ${!tree && 'tree-wrapper-border'}`}>
      <RowWrapped
        card={card}
        hasTree={!!tree}
        parentTopic={parentTopic}
        rootCard={parentTopic}
        depth={0}
        tab={tab}
        onRowChecked={onRowChecked}
        showAddIcon={showAddIcon}
        onRowSelect={selectedCard =>
          setSelectedId(selectedCard.id === selectedId ? null : selectedCard.id)
        }
        selectedId={selectedId}
        disableOn={disableOn}
      />
    </div>
  );
};

TreeView.propTypes = {
  tree: PropTypes.object,
  onRowChecked: PropTypes.func,
  parentTopic: PropTypes.object,
  tab: PropTypes.string,
  showAddIcon: PropTypes.bool,
  disableOn: PropTypes.string
};

export default TreeView;
