import React, { Fragment, PureComponent } from 'react';
import { func } from 'prop-types';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import VisibilitySensor from 'react-visibility-sensor';


//A component for placing at the bottom of an incomplete list.  When it enters the viewport it will call its onLoadMore function
class MoreItemsLoader extends React.PureComponent {

  handleVisibilityChange = async( isVisible ) => {
    const { onVisible } = this.props;
    if ( isVisible && onVisible ) {
      onVisible()
    }
  }


  render() {

    return (
       <VisibilitySensor onChange={ this.handleVisibilityChange } >
         <Fragment>
           <LoadingIndicator />
         </Fragment>
       </VisibilitySensor>
    )
  }
}



MoreItemsLoader.propTypes = {
  onVisible: func.isRequired
}

export default MoreItemsLoader;
