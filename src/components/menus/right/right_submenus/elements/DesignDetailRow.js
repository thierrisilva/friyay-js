import React, { PureComponent } from 'react';
import { object, func, any } from 'prop-types';
import RightDesignColorPicker from '../design/RightDesignColorPicker';
import RightDesignSetImageDisplay from '../design/RightDesignSetImageDisplay';
import RightDesignFileUpload from '../design/RightDesignFileUpload';

class DesignDetailRow extends PureComponent {
  static propTypes = {
    detail: object.isRequired,
    value: any,
    onChange: func.isRequired
  };

  constructor(props) {
    super(props);
  }

  onChange = value => {
    const { onChange, detail } = this.props;
    onChange(value, detail.id);
  };

  render() {
    const { detail, value } = this.props;

    return (
      <div className="right-submenu_item option no-hover" key={detail.id}>
        <span className="ml5">{detail.name}</span>
        {detail.type == 'color' && (
          <RightDesignColorPicker
            onChange={this.onChange}
            domain={detail.name}
            value={value}
          />
        )}
        {detail.type === 'upload' && (
          <RightDesignFileUpload onChange={this.onChange} />
        )}
        {detail.type == 'boolean' && (
          <RightDesignSetImageDisplay
            onChange={this.onChange}
            value={value}
            domain={detail.name}
          />
        )}
      </div>
    );
  }
}

export default DesignDetailRow;
