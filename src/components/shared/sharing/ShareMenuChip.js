import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'Components/shared/Icon';


class ShareMenuChip extends PureComponent {

  handleRemoveItem = () => {
    this.props.onRemove( this.props.item );
  }

  render() {
    const { item } = this.props;

    return (
      <div className='share-menu-table-row'>
        <div className='share-menu-table-row_icon-container'>
          <Icon additionalClasses={`${ topic.attributes.starred_by_current_user ? 'left-menu_topic-element_ghost-star-icon' : 'invisible' }`} fontAwesome icon='star' />

        </div>
        <IconButton
          fontAwesome
          icon='plus'
          onClick={ this.handleRemoveItem } />
      </div>
    )
  }
}



export default ShareMenuChip ;
