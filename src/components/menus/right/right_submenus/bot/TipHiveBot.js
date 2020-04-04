import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { func, array, object } from 'prop-types';
import flatten from 'lodash/flatten';
import moment from 'moment';
import { stateMappings } from 'Src/newRedux/stateMappings';
import {
  getBotPanelData,
  postBotCommands,
  getCommandInputUsersAndTopics
} from 'Src/newRedux/bot/thunk';
import { viewCard } from 'Src/newRedux/database/cards/thunks';

const commandsArray = [
  { statusType: 'status' },
  { statusType: 'cards due' },
  { statusType: 'cards completed' },
  { statusType: 'cards in progress' },
  { statusType: 'this week' }
];

class TipHiveBot extends PureComponent {
  static propTypes = {
    getBotPanelData: func,
    getCommandInputUsersAndTopics: func,
    postBotCommands: func,
    weekly_topic_cards: array,
    card_cleanup: object,
    current_day_status: object,
    weekly_assignee_card: object,
    topics: array,
    users: array,
    commandsResponse: array,
    viewCard: func
  };

  constructor(props) {
    super(props);
    this.commandInput = null;
    this.commandStatuses = null;
  }

  state = {
    showList: [],
    commandInputValue: '',
    topicsOrUsers: {},
    showCommandItemOptions: false,
    showCommandList: false
  };

  componentDidMount = async () => {
    if (this.commandStatuses)
      this.commandStatuses.scrollIntoView({ block: 'end' });
    await this.props.getBotPanelData();
  };

  async componentDidUpdate(prevProps, prevState) {
    if (
      this.commandStatuses &&
      prevState.showList.length === this.state.showList.length
    ) {
      this.commandStatuses.scrollIntoView({ block: 'end' });
    }
    const PrevCurrentDayStatusLength = flatten(
      Object.values(prevProps.current_day_status)
    ).length;
    const currentCurrentDayStatusLength = flatten(
      Object.values(this.props.current_day_status)
    ).length;

    if (PrevCurrentDayStatusLength !== currentCurrentDayStatusLength) {
      await this.props.getBotPanelData();
    }
  }

  handleViewCard = e => {
    this.props.viewCard({ cardId: e.currentTarget.id.split('-')[2] });
  };

  handleHideShowCommand = e => {
    if (e.target.className !== 'bot-input-options') {
      const {
        state: { showCommandItemOptions, showCommandList }
      } = this;
      showCommandItemOptions &&
        this.setState({ showCommandItemOptions: false });
      showCommandList && this.setState({ showCommandList: false });
      document.removeEventListener('click', this.handleHideShowCommand, false);
    }
  };

  getCardNotificationRow = ({ id, assignee = [], title, type, updated_at }) => {
    const notificationType = {
      overdue: 'Card due',
      complete: 'Card completed',
      risk: 'Card at risk',
      started: 'Card Started'
    }[type];
    const typeClass = { overdue: 'danger', complete: 'success' }[type];
    return (
      <div key={`${id}-${type}`} className="bot-notification-row">
        <div
          className={
            type === 'risk'
              ? 'bot-notification-row-type grey'
              : `bot-notification-row-type text-${typeClass}`
          }
        >
          {notificationType}
          {' - '}
        </div>
        <div className="bot-notification-row-assignee">
          {assignee.map((user, i) => (i > 0 ? `, ${user}` : user))}
        </div>
        <small className="bot-notification-time">
          {moment(updated_at).format('h:mm A')}
        </small>
        <div
          id={`card-status-${id}`}
          onClick={this.handleViewCard}
          className="bot-notification-row-card-title"
        >
          {title}
        </div>
      </div>
    );
  };

  setShowListState = currentList => {
    this.setState(prevState => ({
      ...prevState,
      showList: prevState.showList.includes(currentList)
        ? prevState.showList.filter(sl => sl !== currentList)
        : [...prevState.showList, currentList]
    }));
  };

  getWeeklyStatusRow = ({
    date,
    title = [],
    cardComplete = [],
    cardOverdue = [],
    cardUnstarted = [],
    cardInProgress = [],
    statusType
  }) => {
    const {
      state: { showList }
    } = this;
    return (
      <div className="bot-notification-row-weekly text-muted">
        <div className="bot-notification-weekly-header">
          Weekly Status {statusType === 'userList' ? '' : 'yay'} {title}
        </div>
        <small className="bot-notification-time">{'12:00 AM'}</small>
        <div className="bot-notification-weekly-body">
          <div className="bot-notification-weekly-completed">
            {cardComplete.length}
            <span className="bot-notification-weekly-info">Completed</span>
            {showList.includes(statusType) &&
              this.getShowListCards(cardComplete)}
          </div>
          <div className="bot-notification-weekly-overdue">
            {cardInProgress.length}
            <span className="bot-notification-weekly-info">In progress</span>
            {showList.includes(statusType) &&
              this.getShowListCards(cardInProgress)}
          </div>
          <div className="bot-notification-weekly-overdue">
            {cardOverdue.length}
            <span className="bot-notification-weekly-info">Overdue</span>
            {showList.includes(statusType) &&
              this.getShowListCards(cardOverdue)}
          </div>
          <div className="bot-notification-weekly-unstarted">
            {cardUnstarted.length}
            <span className="bot-notification-weekly-info">Unstarted</span>
            {showList.includes(statusType) &&
              this.getShowListCards(cardUnstarted)}
          </div>
          <div className="bot-notification-weekly-complete">
            {`${cardComplete.length}/${cardOverdue.length}`}
            <span className="bot-notification-weekly-info-complete">
              Complete
            </span>
          </div>
          <a
            className="text-muted"
            onClick={() => this.setShowListState(statusType)}
          >
            Show list
          </a>
        </div>
      </div>
    );
  };

  getWeeklyNotificationRow = props => (
    <Fragment>
      {this.dateRow(props.date)}
      {this.getWeeklyStatusRow(props)}
    </Fragment>
  );

  dateRow = (date = Date()) => (
    <div className="bot-notification-date-row text-muted">
      {moment(new Date(date)).format('dddd, MMMM Do')}
    </div>
  );

  getCardCleanupRow = () => {
    const {
      state: { showList },
      props: {
        card_cleanup: {
          card_created_older_than_year__title: olderThenYear = [],
          card_without_activity_for_six_month_title: sixMonthInactivity = []
        }
      }
    } = this;

    return (
      <div className="bot-notification-cleanup">
        <div className="bot-notification-cleanup-header">Card clean up</div>
        <small className="bot-notification-time">{'12:00 AM'}</small>
        <div className="bot-notification-cleanup-body">
          <div className="bot-notification-cleanup-year-old">
            {`${olderThenYear.length} Older than 1 year`}
            {showList.includes('cleanUp') &&
              this.getShowListCards(olderThenYear)}
          </div>
          <div className="bot-notification-cleanup-inactivity">
            {`${sixMonthInactivity.length} No activity since 6 month`}
            {showList.includes('cleanUp') &&
              this.getShowListCards(sixMonthInactivity)}
          </div>
          <a
            className="text-muted"
            onClick={() => this.setShowListState('cleanUp')}
          >
            Show list
          </a>
        </div>
      </div>
    );
  };

  getDailyStatus = () => {
    const {
      card_at_risk_today,
      card_complete_today,
      card_overdue_today,
      card_started
    } = this.props.current_day_status;
    let dailyStatuses = [
      ...card_at_risk_today.map(item => ({
        ...item,
        type: 'risk',
        updated_at: moment().startOf('day')
      })),
      ...card_complete_today.map(item => ({ ...item, type: 'complete' })),
      ...card_overdue_today.map(item => ({
        ...item,
        type: 'overdue',
        updated_at: moment().startOf('day')
      })),
      ...card_started.map(item => ({ ...item, type: 'started' }))
    ];

    dailyStatuses = dailyStatuses.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return (
      <div className="bot-daily-notification text-muted">
        {this.dateRow()}
        {dailyStatuses.map(item => this.getCardNotificationRow(item))}
      </div>
    );
  };

  getShowListCards = cardTitles => (
    <div
      className={
        cardTitles.length !== 0 ? 'bot-notification-card-title-list' : ''
      }
    >
      {cardTitles.map(({ title, id }, index) => (
        <div
          key={index}
          id={`showlist-card-${id}`}
          onClick={this.handleViewCard}
          className="bot-notification-card-title"
        >
          {title}
        </div>
      ))}
    </div>
  );

  getFilteredStatus = ({
    cardCompleteForAssignee,
    cardCompleteForTopics,
    headingType,
    index,
    title,
    statusType,
    cardsCompletedList = [],
    cardsOverdueList = [],
    cardsUnstartedList = [],
    cardsInProgress = []
  }) => {
    return (
      <div className="bot-notification-row-weekly text-muted">
        <div className="bot-notification-weekly-header">
          {headingType === 'user'
            ? `Assignee Status ${title}`
            : `Topic Status ${title}`}
        </div>
        <small className="bot-notification-time">
          {moment().format('h:mm A')}
        </small>
        <div className="bot-notification-weekly-body">
          {(statusType === 'status' || statusType === 'cards completed') && (
            <div className="bot-notification-weekly-completed">
              {cardsCompletedList.length}
              <span className="bot-notification-weekly-info">Completed</span>
              {this.state.showList.includes(`filterStatus-${index}`) &&
                this.getShowListCards(cardsCompletedList)}
            </div>
          )}
          {(statusType === 'status' ||
            statusType === 'cards due' ||
            statusType === 'this week') && (
            <div className="bot-notification-weekly-overdue">
              {cardsOverdueList.length}
              <span className="bot-notification-weekly-info">Overdue</span>
              {this.state.showList.includes(`filterStatus-${index}`) &&
                this.getShowListCards(cardsOverdueList)}
            </div>
          )}
          {(statusType === 'status' || statusType === 'cards in progress') && (
            <div className="bot-notification-weekly-complete">
              {cardsInProgress.length}
              <span className="bot-notification-weekly-info">In progress</span>
              {this.state.showList.includes(`filterStatus-${index}`) &&
                this.getShowListCards(cardsInProgress)}
            </div>
          )}
          {statusType === 'status' && (
            <Fragment>
              <div className="bot-notification-weekly-unstarted">
                {cardsUnstartedList.length}
                <span className="bot-notification-weekly-info">Unstarted</span>
                {this.state.showList.includes(`filterStatus-${index}`) &&
                  this.getShowListCards(cardsUnstartedList)}
              </div>
              <div className="bot-notification-weekly-complete">
                {cardCompleteForAssignee || cardCompleteForTopics}
                <span className="bot-notification-weekly-info-complete">
                  Complete
                </span>
              </div>
            </Fragment>
          )}
          <a
            className="text-muted"
            onClick={() => this.setShowListState(`filterStatus-${index}`)}
          >
            Show list
          </a>
        </div>
      </div>
    );
  };

  commandOptionsList = options => {
    return (
      <ul className="bot-input-options-list">
        {options.map(({ id, title, first_name, last_name, statusType }) => (
          <li
            onClick={this.handleCommandOption}
            className="bot-input-options"
            key={`${id ? id : statusType}-key`}
            id={`${id ? id : statusType}-${
              statusType ? 'status' : title ? 'topic' : 'user'
            }`}
          >
            <span className="bot-option-type-selection">
              {statusType ? 'C' : title ? 'T' : 'U'}
            </span>
            {title ||
              (statusType && `/${statusType} @username/topic`) ||
              first_name + ' ' + last_name}
          </li>
        ))}
      </ul>
    );
  };

  getAssigneeUser = () =>
    localStorage.getItem('user_first_name') +
    ' ' +
    localStorage.getItem('user_last_name');

  handleCommandInput = async event => {
    const { topicsOrUsers, commandInputValue } = this.state;
    const atTheRateindex = event.target.value.lastIndexOf('@');
    const isEnter = event.which === 13 || event.keyCode === 13;
    const newState = { ...this.state };
    this.setState({ commandInputValue: event.target.value });
    newState.commandInputValue = event.target.value;

    const isCommandExist = commandsArray.find(k =>
      event.target.value.includes(k.statusType)
    );
    if (event.which === 191 && !isCommandExist) {
      return this.setState({ showCommandList: true });
    }

    if (event.type === 'keydown') {
      newState.showCommandList = false;
    }

    if (this.state.showCommandList || this.state.showCommandItemOptions) {
      document.addEventListener('click', this.handleHideShowCommand, false);
    }

    if (
      atTheRateindex !== -1 &&
      commandInputValue.charAt(atTheRateindex + 1) &&
      !isEnter
    ) {
      const searchQuery = commandInputValue
        .slice(atTheRateindex + 1, commandInputValue.length)
        .replace('@', ' ');
      this.props.getCommandInputUsersAndTopics(searchQuery);
      newState.showCommandItemOptions = true;
    } else if (isEnter) {
      const textCommand = commandsArray.find(k =>
        event.target.value.includes(k.statusType)
      );

      if (!commandInputValue) return;

      const command = {
        text: textCommand ? textCommand.statusType : '',
        user_id: topicsOrUsers.user_id,
        topic_id: topicsOrUsers.topic_id,
        type: topicsOrUsers.user_id ? 'user' : 'topic'
      };

      command['title'] = topicsOrUsers.topic_id
        ? topicsOrUsers.topic.title
        : '';
      command['title'] = topicsOrUsers.user_id
        ? topicsOrUsers.topic_id
          ? command['title'] +
            ' and ' +
            (topicsOrUsers.user.first_name + ' ' + topicsOrUsers.user.last_name)
          : topicsOrUsers.user.first_name + ' ' + topicsOrUsers.user.last_name
        : command['title'];

      if (command.topic_id || command.user_id) {
        await this.props.postBotCommands({ command });
        newState.showCommandItemOptions = false;
        newState.commandInputValue = '';
        newState.topicsOrUsers = {};
        this.commandInput.value = '';
      }
    }
    this.setState(() => newState);
  };

  handleCommandOption = event => {
    const { topics = [], users = [] } = this.props;
    const id = event.target.id.split('-');

    if (id[1] !== 'status') {
      const topicsOrUsersObject = [...topics, ...users].find(
        k => k.id === parseInt(id[0])
      );
      const atTheRateindex = this.state.commandInputValue.lastIndexOf('@');
      const inputValue = this.state.commandInputValue.substr(
        0,
        atTheRateindex + 1
      );
      this.setState(prevState => ({
        ...prevState,
        commandInputValue:
          inputValue +
          (topicsOrUsersObject.title ||
            topicsOrUsersObject.first_name +
              ' ' +
              topicsOrUsersObject.last_name),
        topicsOrUsers: {
          ...prevState.topicsOrUsers,
          [`${
            topicsOrUsersObject.title ? 'topic_id' : 'user_id'
          }`]: topicsOrUsersObject.id,
          [`${
            topicsOrUsersObject.title ? 'topic' : 'user'
          }`]: topicsOrUsersObject
        },
        showCommandItemOptions: false
      }));
    } else {
      this.setState({
        commandInputValue: this.state.commandInputValue + id[0],
        showCommandList: false
      });
    }
    this.commandInput.focus();
  };

  render() {
    const {
      props: {
        current_day_status,
        weekly_topic_cards,
        weekly_assignee_card: {
          card_complete_weekly,
          card_overdue_weekly,
          card_unstarted_weekly,
          week_end_date
        },
        topics,
        users,
        commandsResponse
      },
      getDailyStatus: DailyStatus,
      getWeeklyNotificationRow: WeeklyStatus,
      getFilteredStatus: FilteredStatus
    } = this;
    const commandInputOptions = [...topics, ...users];

    const isUserProfileView = window.location.pathname.includes('users/');

    return (
      <div
        className={`right-submenu ${
          isUserProfileView
            ? 'right-submenu-panel-userview'
            : 'right-submenu-panel'
        }`}
      >
        <h3 className="right-submenu_header mr-1">
          <i
            className="fa fa-android grey active"
            style={{ cursor: 'pointer' }}
          />
          <span className="tiphive-bot-header">Friyay Bot</span>
        </h3>

        <div className="rab-content-body">
          <div className="rab-items-listing" onScroll={this.handleFilesScroll}>
            <div className="rab-items-container">
              <WeeklyStatus
                title={this.getAssigneeUser()}
                cardComplete={card_complete_weekly}
                cardOverdue={card_overdue_weekly}
                cardUnstarted={card_unstarted_weekly}
                statusType="userList"
                date={week_end_date}
              />
              {weekly_topic_cards.map(({ title, card_title }, index) => (
                <WeeklyStatus
                  key={index}
                  title={title}
                  cardComplete={card_title.card_complete_weekly}
                  cardOverdue={card_title.card_overdue_weekly}
                  cardUnstarted={card_title.card_unstarted_weekly}
                  statusType={`topicList${index}`}
                  date={card_title.week_end_date}
                />
              ))}
              {this.getCardCleanupRow()}
              {flatten(Object.values(current_day_status)).length > 0 && (
                <DailyStatus />
              )}
              <div
                className="bot-command-statuses"
                ref={elem => {
                  this.commandStatuses = elem;
                }}
              >
                {commandsResponse.map((res, i) => (
                  <FilteredStatus key={`status-${i}`} {...res} index={i} />
                ))}
              </div>
            </div>
            <div className="bot-command-input-section">
              {this.state.showCommandList &&
                this.commandOptionsList(commandsArray)}
              {this.state.showCommandItemOptions &&
                this.commandOptionsList(commandInputOptions)}
              <input
                ref={elem => {
                  this.commandInput = elem;
                }}
                className="bot-command-input"
                onKeyDown={this.handleCommandInput}
                value={this.state.commandInputValue}
                type="text"
                onChange={this.handleCommandInput}
                placeholder="Type a command"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  return {
    card_cleanup: sm.bot.card_clean_up_status,
    weekly_assignee_card: sm.bot.any_assignee_cards_weekly_status,
    weekly_topic_cards: sm.bot.topic_based_cards_status,
    current_day_status: sm.bot.current_day_tip_status,
    commandsResponse: sm.bot.commandsResponse,
    topics: sm.bot.topics,
    users: sm.bot.users
  };
};

const mapDispatch = {
  getBotPanelData,
  getCommandInputUsersAndTopics,
  postBotCommands,
  viewCard
};

export default connect(
  mapState,
  mapDispatch
)(TipHiveBot);
