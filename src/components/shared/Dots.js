import React from 'react';

export const GreyDots = ({ color }) => {
  return (
    <div className="dots-layer">
      <div className="dot-container">
        <span
          style={{
            backgroundColor: color ? color : ''
          }}
          className="dot"
        />
      </div>
      <div className="dot-container">
        <span
          style={{
            backgroundColor: color ? color : ''
          }}
          className="dot"
        />
      </div>
      <div className="dot-container">
        <span
          style={{
            backgroundColor: color ? color : ''
          }}
          className="dot"
        />
      </div>
    </div>
  );
};

export const ColouredDots = ({ className, unreadCount, color }) => {
  return (
    <div className={`dots-layer coloured ${className}`}>
      <div className="dot-container">
        <span
          style={{
            backgroundColor: color ? color : ''
          }}
          className="dot"
        />
      </div>
      <div className="dot-container">
        <span
          style={{
            backgroundColor: color ? color : ''
          }}
          className="dot"
        />
      </div>
      <div className="dot-container">
        <span
          style={{
            backgroundColor: color ? color : ''
          }}
          className="dot"
        >
          {unreadCount > 0 && unreadCount}
        </span>
      </div>
      <div className="dot-container">
        <span
          style={{
            backgroundColor: color ? color : ''
          }}
          className="dot"
        />
      </div>
      <div className="dot-container">
        <span
          style={{
            backgroundColor: color ? color : ''
          }}
          className="dot"
        />
      </div>
    </div>
  );
};
