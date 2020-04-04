import React, { useState, Fragment } from 'react';
import Icon from 'Components/shared/Icon';
import IconButton from 'Components/shared/buttons/IconButton';
import SharingSelectMenu from 'Components/shared/sharing_select_menu';
import { removeTopic } from 'Src/newRedux/database/topics/thunks';
import { removeCard, updateCard } from 'Src/newRedux/database/cards/thunks';
import cardViews from 'Src/lib/config/views/cards';
import ViewSelector from 'Src/components/views/card_views/ViewSelector';
import { connect } from 'react-redux';
import DateInput from 'Components/shared/forms/DateInput';
import Select from 'react-select';
import { stateMappings } from 'Src/newRedux/stateMappings';
import moment from 'moment';
import CardDetailsEditor from 'Components/views/card_views/Card/CardDetailsEditor';
import CardDetailsPreview from 'Components/views/card_views/Card/CardDetailsPreview';

import './tab_specific_ui.scss';

const prioritesList = [
  { title: 'Highest', selectedColor: '#7ad39f' },
  { title: 'High', selectedColor: '#b865a8' },
  { title: 'Medium', selectedColor: '#f2994a' },
  { title: 'Low', selectedColor: '#f2c94c' },
  { title: 'Lowest', selectedColor: '#56ccf2' }
];

const TabSpecificUI = ({
  tab,
  isSelected,
  rootCard,
  removeTopic,
  removeCard,
  updateCard,
  people,
  labels
}) => {
  const [showView, setShowView] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [assignees, setAssignees] = useState(undefined);
  const [selectedLabels, setselectedLabels] = useState(undefined);
  const peopleOptions = Object.values(people).map(p => ({
    value: p.id,
    label: p.attributes.first_name
  }));
  const labelOptions = Object.values(labels).map(l => ({
    value: l.id,
    label: l.attributes.name
  }));

  const updateItem = item => {
    updateCard({
      id: rootCard.id,
      ...item
    });
  };

  switch (tab) {
    case 'Structure':
      return (
        <IconButton
          icon="times"
          fontAwesome
          additionalClasses="red-icon-button"
          onClick={() =>
            rootCard.type === 'topics'
              ? removeTopic(rootCard.id)
              : removeCard(rootCard.id)
          }
        />
      );
    case 'Content':
      return (
        isSelected && (
          <div
            className="ts-ui-editor-wrapper"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {showEditor ? (
              <CardDetailsEditor
                card={rootCard}
                onToggleEditMode={() => setShowEditor(false)}
              />
            ) : (
              <CardDetailsPreview
                card={rootCard}
                onDoubleClick={e => setShowEditor(true)}
              />
            )}
          </div>
        )
      );
    case 'Views': {
      // if (rootCard.type !== 'topics') {
      //   return null;
      // }
      const topicView = cardViews[rootCard.attributes.default_view_id];
      return (
        <div className="ts-ui-view-tab">
          <div className="icon-wrapper view-carousel-icon-button-wrapper">
            <Icon icon="view_carousel" additionalClasses="icon-adjustment" />
          </div>

          <div
            className="view-name-wrapper"
            style={rootCard.type === 'topics' ? {} : { visibility: 'hidden' }}
            onClick={() => setShowView(!showView)}
          >
            <div className="view-name">
              {topicView ? (
                <Fragment>
                  <Icon
                    icon={topicView.icon}
                    fontAwesome={topicView.fontAwesomeIcon}
                    additionalClasses="dark-grey-icon-button"
                  />
                  {`  ${topicView.name}`}
                </Fragment>
              ) : (
                <div style={{ color: '#a2a2a2', marginLeft: '5px' }}>
                  Select view
                </div>
              )}
            </div>
            <IconButton
              icon="caret-down"
              fontAwesome
              additionalClasses="dark-grey-icon-button"
            />
          </div>
          {showView && (
            <ViewSelector
              topic={rootCard}
              plainView
              onUpdateComplete={() => setShowView(false)}
            />
          )}
        </div>
      );
    }
    case 'Share': {
      const selectedSharingItems = (
        (rootCard.relationships.share_settings || {}).data || []
      ).map(item => ({
        id: `${item.sharing_object_type}-${item.sharing_object_id}`,
        name: item.sharing_object_name
      }));
      return (
        <div className="ts-ui-view-tab">
          <div className="icon-wrapper share-icon-button-wrapper">
            <Icon icon="share" additionalClasses="icon-adjustment" />
          </div>
          <SharingSelectMenu
            sharingFor={rootCard.type === 'topics' ? 'topic' : 'tip'}
            uniqueId={rootCard.id}
            selectedSharingItems={selectedSharingItems}
            viewAsDropdown
            onUpdateComplete={items =>
              updateItem({
                relationships: {
                  share_settings: {
                    data: items
                      .map(i => {
                        const [
                          sharing_object_type,
                          sharing_object_id
                        ] = i.id.split('-');
                        return {
                          sharing_object_id,
                          sharing_object_type
                        };
                      })
                      .filter(i => i.sharing_object_id !== 'everyone')
                  }
                }
              })
            }
          />
        </div>
      );
    }
    case 'Priorities':
      return (
        <div className="ts-ui-view-tab">
          <div className="icon-wrapper priority-flag-icon-button-wrapper">
            <Icon icon="flag" additionalClasses="icon-adjustment" />
          </div>
          {prioritesList.map(p => (
            <div
              key={p.title}
              className="priority-item"
              style={
                rootCard.attributes.priority_level === p.title
                  ? { color: p.selectedColor }
                  : {}
              }
              onClick={() =>
                updateItem({ attributes: { priority_level: p.title } })
              }
            >
              {p.title}
            </div>
          ))}
        </div>
      );
    case 'Timelines':
      return (
        <Fragment>
          <div className="ts-ui-view-tab">
            <div className="icon-wrapper timeline-start-wrapper">
              <span>Start</span>
            </div>
            <DateInput
              className="start-date"
              date={rootCard.attributes.start_date}
              isOutsideRange={date =>
                rootCard.attributes.due_date &&
                +date > rootCard.attributes.due_date
              }
              placeholder=""
              onChange={value =>
                updateItem({
                  attributes: { start_date: moment(value).format() }
                })
              }
            />
          </div>
          <div className="ts-ui-view-tab">
            <div className="icon-wrapper timeline-due-wrapper">
              <span>Due</span>
            </div>
            <DateInput
              className="due-date"
              date={rootCard.attributes.due_date}
              isOutsideRange={date =>
                rootCard.attributes.start_date &&
                +date < rootCard.attributes.start_date
              }
              placeholder=""
              onChange={value =>
                updateItem({ attributes: { due_date: moment(value).format() } })
              }
            />
          </div>
        </Fragment>
      );
    case 'Assignees':
      return (
        <div className="ts-ui-view-tab">
          <div className="icon-wrapper assignment-icon-button-wrapper">
            <Icon icon="assignment_ind" additionalClasses="icon-adjustment" />
          </div>
          <Select
            isMulti
            className="select-input"
            placeholder=""
            value={(
              assignees ||
              (rootCard.relationships.tip_assignments || {}).data ||
              []
            ).map(a => peopleOptions.find(p => p.value == a))}
            onChange={list => setAssignees(list.map(l => l.value))}
            onBlur={() =>
              updateItem({
                relationships: {
                  tip_assignments: {
                    data: assignees
                  }
                }
              })
            }
            options={peopleOptions}
          />
        </div>
      );
    case 'Label':
      return (
        <div className="ts-ui-view-tab">
          <div className="icon-wrapper label-icon-button-wrapper">
            <Icon icon="local_offer" additionalClasses="icon-adjustment" />
          </div>
          <Select
            isMulti
            className="select-input"
            placeholder=""
            value={(
              selectedLabels ||
              (rootCard.relationships.labels || {}).data ||
              []
            ).map(sl => labelOptions.find(l => l.value === sl))}
            onChange={list => {
              setselectedLabels(list.map(l => l.value));
            }}
            onBlur={() =>
              updateItem({
                relationships: {
                  labels: {
                    data: selectedLabels
                  }
                }
              })
            }
            options={labelOptions}
          />
        </div>
      );
    case 'Design':
      return null;
    default:
      return null;
  }
};

const mapStateToProps = state => {
  const sm = stateMappings(state);
  return {
    people: sm.people,
    labels: sm.labels
  };
};

export default connect(
  mapStateToProps,
  { removeTopic, removeCard, updateCard }
)(TabSpecificUI);
