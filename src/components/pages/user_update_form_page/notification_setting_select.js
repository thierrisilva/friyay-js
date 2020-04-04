import React from 'react';
import createClass from 'create-react-class';

var NotificationSettingSelect = createClass({
  render: function() {
    var selectLabel = this.props.selectLabel;
    var selectKey   = this.props.selectKey;
    var selectValue = localStorage.getItem(selectKey) || "never";

    return (
      <div className="form-group">
        <div className="row">
          <div className="col-sm-7 control-label">
            <label>{selectLabel}</label>
          </div>

          <div className="col-sm-5">
            <select className="form-control setting-selectize" name={'user[email_notifications[' + selectKey + ']]'}
                    id={'user_email_notifications_' + selectKey} data-select-key={selectKey} defaultValue={selectValue}>

              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="always">Always</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
});

export default NotificationSettingSelect;
