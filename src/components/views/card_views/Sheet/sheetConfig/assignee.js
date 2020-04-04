import React from 'react';
import { connect } from 'react-redux';
import orderBy from 'lodash/orderBy';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import SearchInput from 'Components/shared/SearchInput';
import IconButton from 'Components/shared/buttons/IconButton';

const SheetCardAssignee = ({ card, setEditCardModalOpen }) => {
  const { tip_assignments } = card.relationships;

  return (
    <div className="flex-r-start">
      {tip_assignments.data.map(userId => (
        <UserAvatar key={userId} userId={userId} readonly />
      ))}
      <IconButton
        additionalClasses="sheet-view__card-title-edit-btn"
        fontAwesome
        icon="pencil"
        onClick={() => setEditCardModalOpen({ cardId: card.id, tab: 'Plan' })}
      />
    </div>
  );
};

export default {
  cssModifier: 'assignee',
  display: 'Assignee',
  Component: SheetCardAssignee,
  resizableProps: {
    minWidth: '150'
  },
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(
      cards,
      card => card.relationships.tip_assignments.data.length,
      order
    );
  }
};
