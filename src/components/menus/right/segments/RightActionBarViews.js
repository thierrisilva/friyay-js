import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { func, number } from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { selectView } from 'Src/newRedux/interface/views/thunks';
import { getRelevantViewForPage } from 'Src/newRedux/interface/views/selectors';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import viewConfig, { pageViewMappings } from 'Lib/config/views/views';

import IconButton from 'Components/shared/buttons/IconButton';
const visibleViewOptions = Object.values(viewConfig.cards);


class RightActionBarViews extends PureComponent {

  static propTypes = {
    currentlySelectedView: number
  };

  // static contextTypes = {
  //   addTourSteps: func.isRequired
  // };
  //
  // componentDidMount() {
  //   if (this.tourPoint !== null) {
  //     this.context.addTourSteps({
  //       title: 'Views',
  //       text: 'Select views to change how you want to see your Cards.',
  //       selector: '#tour-step-10',
  //       position: 'left'
  //     });
  //   }
  // }

  handleToggleViewsMenu = () => {
    const { displaySubmenu, setRightMenuOpenForMenu } = this.props
    setRightMenuOpenForMenu( displaySubmenu == 'Views' ? null : 'Views' );
  }

  render() {
    const { currentPage, displaySubmenu, selectView, viewKey } = this.props
    const viewOptions = pageViewMappings[ currentPage ];

    const visibleViewOptions = Object.values( viewOptions ).slice( 0, 4 );

    return (
      <div
        className="right-action-bar_segment"
        id="tour-step-10"
        ref={div => (this.tourPoint = div)}
      >
        { visibleViewOptions.map(( view, index ) => (
          <div className={`right-action-bar_button-container link-tooltip-container ${ index == 2 && 'min-height-1' } ${ index > 2 && 'min-height-2' }`} key={ view.name }>
            {/* <IconButton additionalClasses={ view.key == viewKey ? 'active' : ''} icon={ view.icon } onClick={ () => selectView( view ) } /> */}
            <IconButton
              additionalClasses={ view.key == viewKey ? 'active' : ''}
              color='#CCCCCC'
              icon={ view.icon }
              onClick= { () => selectView( view )} />
            <div className="link-tooltip" >{view.name} View</div>
          </div>
        )) }
        <div className='rab-item link-tooltip-container'>
          <IconButton additionalClasses={ displaySubmenu == 'Views' ? 'active' : ''} icon='more_horiz' onClick={ this.handleToggleViewsMenu } />
          <div className="link-tooltip" >All Views</div>
        </div>
      </div>
    )
  }
}


const mapState = (state, props) => {
  const sm = stateMappings(state);
  const currentPage = sm.page.page
  return {
    currentPage,
    displaySubmenu: sm.menus.displayRightSubMenuForMenu,
    viewKey: getRelevantViewForPage( state )
  }

}

const mapDispatch = {
  selectView,
  setRightMenuOpenForMenu
}

export default connect(mapState, mapDispatch)(RightActionBarViews);
