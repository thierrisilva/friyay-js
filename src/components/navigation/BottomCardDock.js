import React, { PureComponent } from 'react';
import { array, bool, func, object } from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import compact from 'lodash/compact';
import { ifElse, identity, length, gt, __, join, append, slice, compose } from 'ramda';
import { createSelector } from 'reselect';
import withDataManager from 'Src/dataManager/components/withDataManager';
import { removeCardFromDock } from 'Src/newRedux/interface/dock/thunks';
import { viewCard } from 'Src/newRedux/database/cards/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import MoreIcon from 'Components/shared/more_icon';
import { setDockContents } from 'Src/newRedux/interface/dock/actions';
import { updateUserUiSettings } from 'Src/newRedux/database/user/thunks';


const titleOrTruncated = ifElse(
  gt(length(__, 20)),
  compose(join(''), append('...'), slice(0, 20)),
  identity
);

class BottomCardDock extends PureComponent {
  static propTypes = {
    dockCards: array.isRequired,
    displayDock: bool,
    group: object,
    removeCardFromDock: func.isRequired
  };

  static defaultProps = {
    cardsInDock: [],
    displayDock: false,
  };

  // Maybe this should actually run, but at some point on page loading cards are set to empty,
  // and docked cards are lost
  // componentDidMount () {
  //   const { cardsInDock, cards, setDockContents, updateUserUiSettings } = this.props;
  //   const cleanCardsInDock = cardsInDock.filter( cardId => !!cards[ cardId ]);
  //   if (cleanCardsInDock != cardsInDock) {
  //     setDockContents( cleanCardsInDock );
  //     updateUserUiSettings({ newSettings: { minimize_dock: cleanCardsInDock }});
  //   }
  // }


  truncateTitle = titleOrTruncated;

  handleItemClick = ( item ) => {
    const { removeCardFromDock, viewCard } = this.props;
    viewCard({ cardId: item.id });
    removeCardFromDock( item.id );
  };



  render() {
    const { dockCards, displayDock } = this.props;

    const minimizeList = dockCards.slice(0, 5);
    const dropDownList = dockCards.slice(5);

    const navItems = minimizeList.map( item => (
      <span
        key={ item.id }
        className="bottom-card-dock_item"
        onClick={ () => this.handleItemClick(item) }
      >
        {item.attributes.title}
      </span>
    ));

    const dropDownItems = dropDownList.map( item => (
      <li key={item.id}>
        <a onClick={() => this.handleItemClick(item)}>
          {this.truncateTitle(item.attributes.title)}
        </a>
      </li>
    ));


    let dropDownMenu = null;


    if (dropDownList.length > 0) {
      dropDownMenu = (
        <div className="dropup card-actions-dropdown">
          <a
            className="dropdown"
            data-toggle="dropdown"
            role="button"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span>
              <MoreIcon />
            </span>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="dLabel"
          >
            {dropDownItems}
          </ul>
      </div>
      );
    }


    return (
      <div className={`bottom-card-dock ${ displayDock && 'presented' }`}>
        <div className="bottom-card-dock_items-container">
          {navItems}
        </div>
        {dropDownMenu}
      </div>
    );
  }
}



const dockCardsSelector = createSelector([ //recomputes every time, but returns same object if ids haven't changed, to prevent rerender
  (state, cardsInDock) => cardsInDock.map( cardId => stateMappings( state ).cards[ cardId ] ),
], ( cardsInDock ) => compact( cardsInDock )
)


const mapState = ( state, props ) => {
  const sm = stateMappings( state );
  const filteredCards = sm.dock.cardsInDock.filter( cardId => !!sm.cards[ cardId ]);
  return {
    cards: sm.cards,
    dockCards: dockCardsSelector( state, filteredCards ),
    cardsInDock: filteredCards,
    displayDock: sm.dock.displayDock,
    history: sm.routing.routerHistory
  }
}

const mapDispatch = {
  removeCardFromDock,
  viewCard,
  setDockContents,
  updateUserUiSettings
}

const dataRequirements = ( props ) => {
  return {
    cardsWithAttributes: { cardIds: props.cardsInDock }, //TODO: waiting n API to have 'include card Ids' filter
  }
}

export default withDataManager( dataRequirements, mapState, mapDispatch )(BottomCardDock);
