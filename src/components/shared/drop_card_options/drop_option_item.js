/* globals vex */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from 'Lib/item_types';
import Ability from 'Lib/ability';
import tiphive from 'Lib/tiphive';
import { connect } from 'react-redux';
import { addTipIntoTopic, moveTipFromTopic } from 'Actions/topic';
import { failure } from 'Utils/toast';

const dropOptionItem = {
  drop(props, monitor) {
    const dropItem = monitor.getItem();
    const toTopic = props.topic;
    const fromTopic = dropItem.topic;
    const { item } = dropItem;
    const { type } = props;

    const toTopicPaths = toTopic.attributes.path.map(path => path.slug);
    const fromTopicSlug = fromTopic.attributes.slug;

    const isOwner = Ability.can('update', 'self', item);
    const permisionMessage =
      'You do not have the administrative rights to move this card';
    if (type === 'add') {
      if (!tiphive.userIsGuest() || (tiphive.userIsGuest() && isOwner)) {
        props.addTipIntoTopic(item, fromTopic, toTopic);
      } else {
        failure(permisionMessage, 5);
      }
    } else {
      if (isOwner) {
        props.moveTipFromTopic(item, fromTopic, toTopic);
        const viewedMoveCardAlert = localStorage.getItem('viewedMoveCardAlert');
        if (toTopicPaths.includes(fromTopicSlug) && !viewedMoveCardAlert) {
          vex.dialog.alert(`
						You have moved this card to another yay.
						Note that Cards are currently shown at the parent level of a yay as well.
						Topics work as filters to narrow the cards you see.`);
          localStorage.setItem('viewedMoveCardAlert', true);
        }
      } else {
        failure(permisionMessage, 5);
      }
    }
  }
};

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver()
  };
}

const DropOptionItem = props => {
  const { connectDropTarget, isOver, type } = props;

  let itemClassName = classNames('drop-option-item', `${type}-drop-option`, {
    'is-over': isOver
  });

  return connectDropTarget(
    <div className={itemClassName}>
      <button className="btn btn-drop-target">
        <span>{type}</span> to
      </button>
    </div>
  );
};

DropOptionItem.propTypes = {
  topic: PropTypes.object,
  type: PropTypes.string,
  connectDropTarget: PropTypes.func.isRequired,
  canDrop: PropTypes.bool,
  isOver: PropTypes.bool,
  addTipIntoTopic: PropTypes.func.isRequired,
  moveTipFromTopic: PropTypes.func.isRequired
};

const mapState = store => ({ store });
const mapDispatch = {
  addTipIntoTopic,
  moveTipFromTopic
};

export default connect(
  mapState,
  mapDispatch
)(
  DropTarget(
    [ItemTypes.CARD_ITEM, ItemTypes.FILE_ITEM],
    dropOptionItem,
    collectTarget
  )(DropOptionItem)
);
