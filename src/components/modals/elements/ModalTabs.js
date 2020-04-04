import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ModalTabs = ({ onSelectTab, selectedTab, tabs }) => (
  <div className='modal-tabs_container'>
    { tabs.map( tab => (
      <a className={`modal-tab ${ tab == selectedTab && 'active' }`} key={ tab } onClick={ () => onSelectTab( tab ) }>
        { tab }
      </a>
    ))}
  </div>
)

export default ModalTabs;
