import React from 'react';
import PropTypes from 'prop-types';

const MenuCloseSideBar = ({ left, onClick, right }) => (

  <div className={`menu-close-sidebar ${ left && 'left' } ${ right && 'right' }`}>
    <a className='menu-close-sidebar_button' onClick={ onClick }></a>
  </div>
)

export default MenuCloseSideBar;
