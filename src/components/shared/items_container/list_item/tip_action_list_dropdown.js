/* global vex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MainFormPage from '../../../pages/MainFormPage';
import MoreIcon from '../../../shared/more_icon';
import { filterTipBySlug } from 'Actions/tipsFilter';
import { deleteTipInTaskTopic, archiveTipInTaskTopic } from 'Actions/topic';
import classNames from 'classnames';

const options = ['Plan', 'Label', 'Share', 'Organize', 'Edit', 'Delete', 'Archive'];
import { VIEWS_ENUM } from 'Enums';

class TipActionListDropdown extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    removeItem: PropTypes.func.isRequired,
    archiveItem: PropTypes.func.isRequired,
    handleDeleteItem: PropTypes.bool,
    handleArchiveItem: PropTypes.bool,
    filterBySlug: PropTypes.func.isRequired,
    activeTipView: PropTypes.number,
    topic: PropTypes.object,
    deleteTipInTask: PropTypes.func.isRequired,
    archiveTipInTask: PropTypes.func.isRequired,
    tipViewMode: PropTypes.number,
    path : PropTypes.array,
  };

  static defaultProps = {
    handleDeleteItem: false,
    handleArchiveItem: false
  };

  state = {
    isMainFormOpen: false,
    action: null,
    showActions : true
  };

  handleItemTrashClick(item) {
    const { props: { handleDeleteItem, removeItem, deleteTipInTask, activeTipView, topic, tipViewMode, path  } } = this;
    const tipView = tipViewMode !== null ? tipViewMode : activeTipView;
     const isTaskView = tipView === VIEWS_ENUM.TASK;
    const isWikiView = tipView === VIEWS_ENUM.WIKI;   
    if (handleDeleteItem) {
      (isTaskView)
        ? deleteTipInTask(item.id, topic.id, tipView)
        : removeItem(item.id);
    } else {
      vex.dialog.confirm({
        message: 'Are you sure you want to delete this item?',
        callback: value => {
          if (value) {
           if(isTaskView)
           {
             deleteTipInTask(item.id, topic.id, tipView);
           }
           else if(isWikiView)
           {
             removeItem(item.id, topic.id, path);
           }
           else
           {
            removeItem(item.id);
           }
          }
        }
      });
    }
  }

  handleItemArchiveClick(item) {
    const { props: { handleArchiveItem, archiveItem, archiveTipInTask, topic, activeTipView, tipViewMode, path } } = this;
    const tipView = tipViewMode !== null ? tipViewMode : activeTipView;
    const isTaskView = tipView === VIEWS_ENUM.TASK;
    const isWikiView = tipView === VIEWS_ENUM.WIKI;
    if (handleArchiveItem) {
      (isTaskView)
        ? archiveTipInTask(item.id, topic.id)
        : archiveItem(item);
    } else {
      vex.dialog.confirm({
        unsafeMessage: `
          Are you sure you want to Archive this Card?
          <br /><br />
          You can use the label filters in the Action Bar to your right to view archived Cards.
        `,
        callback: value => {
          if (value) {
            if(isTaskView)
            {
              archiveTipInTask(item.id, topic.id, tipView);
            }
            else if(isWikiView)
            {
              archiveItem(item.id, topic.id, path);
            }
            else
            {
              archiveItem(item.id);
            }
           }
        }
      });
    }
  }

  handleClick = action => {
    const { props: { item, filterBySlug } } = this;

    if (!item) {
      return false;
    }

    this.setState(state => ({
      ...state,
      showActions : false
    }));

    if (action === 'Delete') {
      this.handleItemTrashClick(item);
    } else if (action === 'Archive') {
      this.handleItemArchiveClick(item);
    } else {
      filterBySlug(item.attributes.slug);
      this.setState(state => ({
        ...state,
        isMainFormOpen: true,
        action
      }));
    }
  };

  itemPageClose = () =>
    this.setState(state => ({ ...state, isItemPageOpen: false, action: null }));

  mainFormClose = () =>
    this.setState(state => ({ ...state, isMainFormOpen: false, action: null }));

  render() {
    const {
      state: { isMainFormOpen, action, showActions },
      props: { item, topic, activeTipView, tipViewMode }
    } = this;

   const tipView = tipViewMode !== null ? tipViewMode : activeTipView;
    const isWikiView = tipView === VIEWS_ENUM.WIKI;    
    let toggleLink = "";
    if(!isWikiView)
    {
      toggleLink = <Link
                  to="/"
                  className="dropdown"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                <span>
                  <MoreIcon />
                </span>
              </Link> ;
    }
    else
    {
      toggleLink = <a data-toggle="dropdown" aria-expanded="true"></a>
    }
    return (
      <div className={classNames('dropdown', {'open' : (isWikiView && showActions)})}>
        {toggleLink}
        <ul
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="dLabel"
        >
          {options.map(option => (
            <li key={option}>
              <a onClick={() => this.handleClick(option)}>
                {option}
              </a>
            </li>
          ))}
        </ul>
        {isMainFormOpen && (
          <MainFormPage
            cardFormOnly
            activeTab={action}
            onClose={this.mainFormClose}
            topic={topic}
            updateTip={item}
          />
        )}
      </div>
    );
  }
}

const mapState = ({
  tipsView: { view },
}) => ({
  activeTipView: view
});

const mapDispatch = {
  filterBySlug: filterTipBySlug,
  deleteTipInTask: deleteTipInTaskTopic,
  archiveTipInTask: archiveTipInTaskTopic
};

export default connect(mapState, mapDispatch)(TipActionListDropdown);
