import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import IconBtn from 'Components/shared/icon_btn';
import ItemAssignmentPath from 'Components/shared/item_assignment_path';
import ItemOptionsMenu from './item_options_menu';
import Ability from 'Lib/ability';
import UserAvatar from 'Src/components/shared/users/elements/UserAvatar';
import ItemPage from 'Components/pages/item_page';
import MainFormPage from 'Components/pages/MainFormPage';
import CardTopicLink from 'Src/components/shared/cards/elements/CardTopicLink';
import { removeCard, archiveCard } from 'Src/newRedux/database/cards/thunks';
import { addCardToDock, removeCardFromDock } from 'Src/newRedux/interface/dock/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';

class ItemContentHeader extends PureComponent {
  state={
    isMainFormOpen: false,
    action: null,
    isItemPageOpen: false
  }

  static propTypes = {
    tip: PropTypes.object.isRequired,
    cardView: PropTypes.bool,
    editMode: PropTypes.bool,
    routerHistory: PropTypes.object,
    handleSaveClick: PropTypes.func,
    onTopicClick: PropTypes.func,
  };

  static defaultProps = {
    cardView: false,
    editMode: false,
  };

  closeItemPage = () =>
    this.setState(state => ({ ...state, isItemPageOpen: false }));

  handleItemArchiveClick = () => {
    const { props: { routerHistory, archiveItem, tip } } = this;

    vex.dialog.confirm({
      unsafeMessage: `
        Are you sure you want to Archive this Card?
        <br /><br />
        You can use the label filters in the Action Bar to your right to view archived Cards.
      `,
      callback: async value => {
        if (value) {
          await archiveCard(tip);

          const nextUrl = routerHistory.location.pathname.replace(`/cards/${tip.id}`, '');
          routerHistory.push(nextUrl);
        }
      }
    });
  };

  handleMaximizeClick = () => {
    const { props: { tip: { id } } } = this;
    removeCardFromDock(id);
  };

  handleOptionClick = action => {
    this.setState(state => ({ ...state, action, isMainFormOpen: true }));
  }

  handlePrintClick = () => window.print();

  handleItemTrashClick = () => {
    const { props: { routerHistory, removeCard, tip: { id } } } = this;

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this item?',
      callback: async value => {
        if (value) {
          await removeCard(id);

          const nextUrl = routerHistory.location.pathname.replace(`/cards/${id}`, '');
          routerHistory.push(nextUrl);
        }
      }
    });
  };

  closeMainForm = () =>
    this.setState(state => ({ ...state, isMainFormOpen: false, action: null }));

  onMinimize = () => {
    const { props: { tip: { id } } } = this;

    addCardToDock(id);
  };

  render() {
    const {
      props: {
        tip,
        cardView,
        handleEditClick,
        editMode,
        handleSaveClick,
        onTopicClick
      },
      state: {
        action,
        isMainFormOpen,
        isItemPageOpen
      }
    } = this;

    const { attributes } = tip;
    const { creator, updated_at, slug } = attributes;

    let minimizeAction = null,
      maximizeAction = null,
      itemUpdateAction = null,
      itemDeleteAction = null,
      itemSaveAction = null;

    if (cardView && slug) {
      minimizeAction = <a className="btn btn-link btn-minus" onClick={this.handleMinimizeClick} />;
      maximizeAction = (
        <div style={{ transform: 'rotate(270deg)' }}>
          <IconBtn handleClick={this.handleMaximizeClick} materialIcon="launch" />
        </div>
      );
    }

    if (!editMode && Ability.can('update', 'self', tip)) {
      itemUpdateAction = <IconBtn handleClick={handleEditClick} materialIcon="edit" />;
    }

    if (Ability.can('destroy', 'self', tip)) {
      itemDeleteAction = <IconBtn handleClick={this.handleItemTrashClick} materialIcon="delete" />;
    }

    if (editMode) {
      itemSaveAction = <IconBtn handleClick={handleSaveClick} materialIcon="save" />;
    }

    return (
      <div
        className="item-content-header flex-r-center-spacebetween"
      >
        <div className="flex-r-center">
          <UserAvatar user={ creator } showName />
          <CardTopicLink card={tip} fullPath/>
          <span className="ml15">{moment(updated_at).format('DD MMM YY')}</span>
        </div>
        <div className="flex-r-center">
          {minimizeAction}
          {maximizeAction}
          {itemSaveAction}
          {itemUpdateAction}
          {itemDeleteAction}
          <ItemOptionsMenu
            item={tip}
            handlePrintClick={this.handlePrintClick}
            handleItemArchiveClick={this.handleItemArchiveClick}
            handleOptionClick={this.handleOptionClick}
          />
        </div>
        {isItemPageOpen && (
          <ItemPage
            group={group}
            editActive
            editActiveFromCardForm
            onClose={this.closeItemPage}
          />
        )}
        {isMainFormOpen && (
          <MainFormPage
            cardFormOnly
            activeTab={action}
            onClose={this.closeMainForm}
          />
        )}
      </div>
    );
  }
}

const mapState = (state) => {
  const sm = stateMappings(state);

  return { routerHistory: sm.routing.routerHistory };
};

const mapDispatch = {
  removeCard,
  archiveCard,
  addCardToDock,
  removeCardFromDock
}

export default connect(mapState, mapDispatch)(ItemContentHeader);
