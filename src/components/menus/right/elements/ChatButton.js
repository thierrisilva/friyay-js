/* global $crisp, appEnv */
import React from 'react';

const ChatButton = () => {

  const handleChatClick = (e) => {
    e.preventDefault();

    $crisp.push(['do', 'chat:open']);
    $crisp.push(['do', 'chat:show']);

    $crisp.push([
      'on',
      'chat:closed',
      () => {
        $crisp.push(['do', 'chat:hide']);
        $crisp.push(['off', 'chat:closed']);
      }
    ]);
  }


  return (
    <div className="rab-group">
      <a
        href="#javascript"
        className="rab-item link-tooltip-container"
        onClick={ handleChatClick }
      >
        <i className="fa fa-comments fa-lg" />
        <div className="link-tooltip">Chat with us!</div>
      </a>
    </div>
  )
}

export default ChatButton;
