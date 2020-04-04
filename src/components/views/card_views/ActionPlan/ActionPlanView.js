import React from 'react';
import SheetView from '../Sheet/SheetView';

const ActionPlan = props => {
  return (
    <div className="h100 ActionPlan">
      <SheetView {...props} additionalClasses="ActionPlan-view" />
    </div>
  );
};

export default ActionPlan;
