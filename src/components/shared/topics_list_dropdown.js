import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import TopicsSelectMenu from './topics_select_menu';

const TopicsListDropdown = ({
  additionalClasses,
  hasInput,
  path,
  startAt,
  actionButtonClass,
  actionButtonLabel,
  actionButtonHandler,
  isCollapsed,
  hideHeader,
  hideTopicsSelectMenuInput,
  inputMode,
  disallowCreate,
  multiple,
  isRequired,
  hideAddTopicLink,
  hideTopicSelector,
  skipConfirmation,
  onInputFocus,
  onInputBlur,
  domain
}) => (
  <div
    className={cx(
      'dropdown-menu',
      'topics-list-dropdown',
      'stay-open',
      additionalClasses
    )}
  >
    <div className="panel-body">
      <TopicsSelectMenu
        selectTitle="Select a destination yay to move to"
        multiple={multiple}
        hasInput={hasInput}
        path={path}
        startAt={startAt}
        selectedTopics={[]}
        actionButtonLabel={actionButtonLabel}
        actionButtonHandler={actionButtonHandler}
        actionButtonClass={actionButtonClass}
        isCollapsed={isCollapsed}
        hideHeader={hideHeader}
        hideTopicsSelectMenuInput={hideTopicsSelectMenuInput}
        inputMode={inputMode}
        disallowCreate={disallowCreate}
        hideAddTopicLink={hideAddTopicLink}
        isRequired={isRequired}
        hideTopicSelector={hideTopicSelector}
        skipConfirmation={skipConfirmation}
        onInputBlur={onInputBlur}
        onInputFocus={onInputFocus}
        domain={domain}
      />
    </div>
  </div>
);

TopicsListDropdown.propTypes = {
  actionButtonLabel: PropTypes.string,
  actionButtonHandler: PropTypes.func,
  actionButtonClass: PropTypes.string,
  hasInput: PropTypes.bool,
  path: PropTypes.array,
  startAt: PropTypes.string,
  isCollapsed: PropTypes.bool
};

TopicsListDropdown.defaultProps = {
  hasInput: true,
  startAt: null,
  path: [],
  isCollapsed: false
};

export default TopicsListDropdown;
