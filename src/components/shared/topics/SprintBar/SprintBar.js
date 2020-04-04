/* eslint-disable react/prop-types */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import AssigneeList from './AssigneeList';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import moment from 'moment';
import get from 'lodash/get';
import { setUpdateTopicModalOpen } from 'Src/newRedux/interface/modals/actions';

const SprintBar = props => {
  const flag = '🏁';
  const calendar = '📅';
  const horse = '🏇';
  const car = '🏎️';
  const turtle = '🐢';
  const snail = '🐌';
  const rocket = '🚀';
  const done = '💯';

  const [cards, setCards] = useState([]);
  const sprintBarRef = useRef(null);

  const onCardData = currentCards => {
    if (currentCards && currentCards.length) {
      const tempCards = cards;
      const temp = currentCards.map(c => {
        const index = cards.findIndex(t => t.id === c.id);
        if (index >= 0) {
          tempCards.splice(index, 1);
        }
        return c;
      });
      setCards([...tempCards, ...temp]);
    }
  };

  useEffect(() => {
    let temp = [];
    const tempCards = cards;
    cards.forEach(c => {
      const {
        relationships: {
          nested_tips: { data }
        }
      } = c;
      if (data.length) {
        data.forEach(nestedCardId => {
          const nestedCard = props.allCardsHash[nestedCardId];
          if (nestedCard) {
            const index = cards.findIndex(t => t.id === nestedCardId);
            if (index < 0) {
              temp.push(nestedCard);
            } else if (
              JSON.stringify(cards[index]) !== JSON.stringify(nestedCard)
            ) {
              tempCards.splice(index, 1);
              temp.push(nestedCard);
            }
          }
        });
      }
    });
    if (temp.length) {
      setCards([...tempCards, ...temp]);
    }
  }, [cards, setCards]);

  const topicId = props.topic ? props.topic.id : '0';

  const countAssignee = () => {
    if (cards.length) {
      const assignees = cards.reduce((data, card) => {
        if (card.relationships.tip_assignments.data.length) {
          card.relationships.tip_assignments.data.map(userId => {
            if (!data[userId]) {
              data[userId] = {
                ...props.people[userId],
                cards: {
                  [card.id]: card
                }
              };
            } else {
              data[userId] = {
                ...data[userId],
                cards: { ...data[userId].cards, [card.id]: card }
              };
            }
          });
        } else {
          data.unassigned = data.unassigned
            ? { cards: { ...data.unassigned.cards, [card.id]: card } }
            : { cards: { [card.id]: card } };
        }
        return data;
      }, {});
      const { unassigned } = assignees;
      delete assignees.unassigned;
      assignees.unassigned = unassigned;
      return assignees;
    }
    return {};
  };

  const assignee = () => {
    const users = countAssignee();
    const completionCount = c => {
      return Object.keys(c).reduce((count, key) => {
        if (Number(c[key].attributes.completed_percentage) === 100) {
          count += 1;
        }
        return count;
      }, 0);
    };
    return (
      <Fragment>
        {Object.keys(users).map(key => {
          return (
            <div className="SprintBar__filter__assignee-data" key={key}>
              {key === 'unassigned' ? (
                <span className="SprintBar__filter__assignee-data-unassigned">
                  Unassigned{' '}
                </span>
              ) : (
                <UserAvatar userId={key} />
              )}
              <span>{users[key] ? completionCount(users[key].cards) : 0}</span>
              <span>/</span>
              <span>
                {users[key] ? Object.keys(users[key].cards).length : 0}
              </span>
            </div>
          );
        })}
      </Fragment>
    );
  };

  const completedCount = () => {
    return cards.reduce((count, card) => {
      if (Number(card.attributes.completed_percentage) === 100) {
        count += 1;
      }
      return count;
    }, 0);
  };

  const createDateArray = () => {
    const dateArray = [];
    if (props.topic && props.topic.attributes) {
      let currentDate = moment(props.topic.attributes.start_date);
      const endDate = moment(props.topic.attributes.due_date);

      while (currentDate <= endDate) {
        dateArray.push(moment(currentDate));
        currentDate = moment(currentDate).add(1, 'days');
      }
    }
    if (moment() > dateArray[dateArray.length - 1]) {
      let currentDate = dateArray[dateArray.length - 1];
      const endDate = moment();
      while (currentDate <= endDate) {
        dateArray.push(moment(currentDate));
        currentDate = moment(currentDate).add(1, 'days');
      }
    }
    return dateArray;
  };

  const dateClasses = date => {
    if (date.format('MM-DD-YYYY') < moment().format('MM-DD-YYYY')) {
      return 'SprintBar__date__date-old';
    } else if (date.format('MM-DD-YYYY') === moment().format('MM-DD-YYYY')) {
      return 'SprintBar__date__date-today';
    } else {
      return '';
    }
  };

  const getDueLeftPos = () => {
    let due_date = get(props.topic, 'attributes.due_date', '');
    if (due_date) {
      due_date = moment(due_date).format('MM-DD-YYYY');
      const dueElement = document.getElementById(`sprint-date-${due_date}`);
      if (dueElement) {
        return `${dueElement.offsetLeft - 30}px`;
      }
      return '60px';
    }
  };

  const getCurrentLeftPos = () => {
    const current = moment().format('MM-DD-YYYY');
    const currentEle = document.getElementById(`sprint-date-${current}`);
    if (currentEle) {
      return `${currentEle.offsetLeft - 35}px`;
    }
    return '40px';
  };

  const completed = completedCount();
  const dateArray = createDateArray();

  const getCurrentEmoji = () => {
    if (props.topic && props.topic.attributes) {
      const start = moment(
        props.topic.attributes.start_date,
        'YYYY-MM-DD'
      ).startOf('day');
      const end = moment(props.topic.attributes.due_date, 'YYYY-MM-DD').endOf(
        'day'
      );
      const totalDuration = Math.abs(start.diff(end, 'days')) + 1;
      const avgDaysPerCard = totalDuration / cards.length;
      const daySpent = Math.ceil(
        Math.abs(moment.duration(start.diff(moment().startOf('day'))).asDays())
      );
      const currentAvg = completed !== 0 ? daySpent / completed : 0;
      const currentSpeed = currentAvg !== 0 ? avgDaysPerCard / currentAvg : 0;

      if (completed === cards.length) {
        return (
          <p>
            <span>{done}</span>
          </p>
        );
      } else if (currentSpeed <= 1.1 && currentSpeed >= 0.9) {
        return (
          <p className="SprintBar__icon-flip">
            <span>{horse}</span>
          </p>
        );
      } else if (currentSpeed < 0.9 && currentSpeed >= 0.4) {
        return (
          <p className="SprintBar__icon-flip">
            <span>{turtle}</span>
          </p>
        );
      } else if (currentSpeed < 0.4) {
        return (
          <p>
            <span>{snail}</span>
          </p>
        );
      } else if (currentSpeed > 1.1 && currentSpeed <= 1.5) {
        return (
          <p className="SprintBar__icon-flip">
            <span>{car}</span>
          </p>
        );
      } else {
        return (
          <p>
            <span>{rocket}</span>
          </p>
        );
      }
    }
  };

  const openTopicModal = () => {
    props.setUpdateTopicModalOpen(props.topic.id, true, 4);
  };

  if (props.sprintBarVisible) {
    return (
      <div className="SprintBar">
        <AssigneeList
          cards={props.cards}
          topicId={topicId}
          onLoad={onCardData}
        />
        <div ref={sprintBarRef} className="SprintBar__date">
          {props.topic &&
          props.topic.attributes &&
          props.topic.attributes.start_date &&
          props.topic.attributes.due_date ? (
            <Fragment>
              <div className="SprintBar__icon__wrapper">
                <div onClick={openTopicModal} className="SprintBar__icon">
                  <p className="SprintBar__icon__emoji">{flag}</p>
                  <p className="SprintBar__icon__title">START</p>
                </div>
                <div
                  style={{ left: getCurrentLeftPos() }}
                  className="SprintBar__icon SprintBar__icon-abs"
                >
                  <div className="SdivrintBar__icon__emoji SprintBar__icon__emoji-status">
                    {getCurrentEmoji()}
                  </div>
                </div>
                <div
                  onClick={openTopicModal}
                  style={{ left: getDueLeftPos() }}
                  className="SprintBar__icon SprintBar__icon-abs"
                >
                  <p className="SprintBar__icon__emoji">{calendar}</p>
                  <p className="SprintBar__icon__title">DUE</p>
                </div>
              </div>
              <div
                style={{
                  width: sprintBarRef.current
                    ? `${sprintBarRef.current.scrollWidth}px`
                    : 'auto'
                }}
                className="SprintBar__date__list"
              >
                {dateArray.map((date, index) => {
                  if (index === 0) {
                    return (
                      <Fragment key={index}>
                        <p
                          id={`sprint-date-${date.format('MM-DD-YYYY')}`}
                          className="SprintBar__date__month"
                          key={index}
                        >
                          {date.format('MMM')}
                        </p>
                        <p
                          id={`sprint-date-${date.format('MM-DD-YYYY')}`}
                          className={`SprintBar__date__date ${dateClasses(
                            date
                          )}`}
                        >
                          {date.format('DD')}
                        </p>
                      </Fragment>
                    );
                  } else if (
                    date.format('MMM') !== dateArray[index - 1].format('MMM')
                  ) {
                    return (
                      <Fragment key={index}>
                        <p className="SprintBar__date__month">
                          {date.format('MMM')}
                        </p>
                        <p
                          id={`sprint-date-${date.format('MM-DD-YYYY')}`}
                          className={`SprintBar__date__date ${dateClasses(
                            date
                          )}`}
                        >
                          {date.format('DD')}
                        </p>
                      </Fragment>
                    );
                  }
                  return (
                    <p
                      id={`sprint-date-${date.format('MM-DD-YYYY')}`}
                      className={`SprintBar__date__date ${dateClasses(date)}`}
                      key={index}
                    >
                      {date.format('DD')}
                    </p>
                  );
                })}
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="SprintBar__icon__wrapper">
                <div onClick={openTopicModal} className="SprintBar__icon">
                  <p className="SprintBar__icon__emoji">{flag}</p>
                  <p className="SprintBar__icon__title">START</p>
                </div>
                <div onClick={openTopicModal} className="SprintBar__icon">
                  <p className="SprintBar__icon__emoji">{calendar}</p>
                  <p className="SprintBar__icon__title">DUE</p>
                </div>
              </div>
              <div className="SprintBar__date__empty">
                Select start and due date
              </div>
            </Fragment>
          )}
        </div>
        <div className="SprintBar__card__wrapper">
          <div className="SprintBar__card__empty">
            {cards.length - completed} Cards to complete
          </div>
        </div>
        <div className="SprintBar__percentage__wrapper">
          <div
            style={{
              width: `${((completed / cards.length) * 100).toFixed(1)}%`
            }}
            className="SprintBar__percentage__complete"
          />
          <div
            style={{
              left:
                (completed / cards.length) * 100 > 5
                  ? `calc(${((completed / cards.length) * 100).toFixed(
                      1
                    )}% - 1.2%)`
                  : '40px',
              color: (completed / cards.length) * 100 > 5 ? '#fff' : '#ddd'
            }}
            className="SprintBar__percentage__percent"
          >
            {((completed / cards.length) * 100).toFixed(1)}%
          </div>
          <div className="SprintBar__percentage__total">
            {completed}/{cards.length}
          </div>
        </div>
        <div className="SprintBar__filter__wrapper">
          {/* <div className="SprintBar__filter__empty">No Filter</div> */}
          <div className="SprintBar__filter__assignee">{assignee()}</div>
        </div>
      </div>
    );
  }
  return null;
};

SprintBar.propTypes = {
  cards: PropTypes.array.isRequired,
  topic: PropTypes.object,
  setUpdateTopicModalOpen: PropTypes.func
};

function mapState(state) {
  const { user, page, cards, people } = stateMappings(state);
  const uiSettings = user.attributes.ui_settings;

  const myTopicsView = uiSettings.my_topics_view.find(
    view => view.id === page.topicId
  );
  const sprintBarVisible = myTopicsView && myTopicsView.sprintbar_panel_visible;
  return { allCardsHash: cards, people, sprintBarVisible };
}

export default connect(
  mapState,
  { setUpdateTopicModalOpen }
)(SprintBar);
