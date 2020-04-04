export const getCommandStatusAttributes = att => ({
  cardCompleteForAssignee:
    (att.any_assignee_cards_weekly_status || null) &&
    att.any_assignee_cards_weekly_status.card_complete_weekly &&
    `${att.any_assignee_cards_weekly_status.card_complete_weekly.length}/${
      att.any_assignee_cards_weekly_status.card_overdue_weekly.length
    }`,
  cardCompleteForTopics:
    (att.topic_based_cards_status || null) &&
    att.topic_based_cards_status.card_complete_weekly &&
    `${att.topic_based_cards_status.card_complete_weekly.length}/${
      att.topic_based_cards_status.card_overdue_weekly.length
    }`,
  headingType: att.commandType,
  title: att.title,
  statusType: att.statusType,
  cardsCompletedList: att.any_assignee_cards_weekly_status
    ? att.any_assignee_cards_weekly_status.card_complete_weekly
    : att.topic_based_cards_status
    ? att.topic_based_cards_status.card_complete_weekly
    : att.card_complete_weekly,
  cardsOverdueList: att.any_assignee_cards_weekly_status
    ? att.any_assignee_cards_weekly_status.card_overdue_weekly
    : att.topic_based_cards_status
    ? att.topic_based_cards_status.card_overdue_weekly
    : att.card_overdue_weekly || att.card_due_this_week,
  cardsUnstartedList: att.any_assignee_cards_weekly_status
    ? att.any_assignee_cards_weekly_status.card_unstarted_weekly
    : att.topic_based_cards_status
    ? att.topic_based_cards_status.card_unstarted_weekly
    : att.card_unstarted_weekly,
  cardsInProgress: att.topic_based_cards_status
    ? att.topic_based_cards_status.card_in_progress
    : att.any_assignee_cards_weekly_status
    ? att.any_assignee_cards_weekly_status.card_in_progress
    : att.card_in_progress_weekly
});
