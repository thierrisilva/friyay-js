import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import Icon from 'Components/shared/Icon';
import { string, func, any } from 'prop-types';

class RightDesignColorPicker extends Component {
  static propTypes = {
    domain: string.isRequired,
    onChange: func.isRequired,
    value: any
  };

  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
      color: this.rgbaValue(props.value) || ''
    };
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleChange = ({ rgb }) => {
    this.setState({ color: rgb }, () => {
      this.props.onChange(this.torgbaValue(this.state.color));
    });
  };

  torgbaValue = color => {
    if (typeof color === 'object') {
      const converted = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      return converted;
    }
  };

  rgbaValue = color => {
    if (typeof color === 'string') {
      const colorsOnly = color
        .substring(color.indexOf('(') + 1, color.lastIndexOf(')'))
        .split(/,\s*/);
      const components = {};
      components.r = colorsOnly[0];
      components.g = colorsOnly[1];
      components.b = colorsOnly[2];
      components.a = colorsOnly[3];
      return components;
    }
    return color;
  };

  render() {
    return (
      <div>
        <div onClick={this.handleClick}>
          <Icon
            additionalClasses="Right-design-picker-icon"
            fontAwesome
            icon="square"
            color={`rgba(${this.state.color.r}, ${this.state.color.g}, ${
              this.state.color.b
            }, ${this.state.color.a})`}
          />
        </div>
        {this.state.displayColorPicker ? (
          <div className="Right-design-color-popover">
            <div
              className="Right-design-color-cover"
              onClick={this.handleClick}
            />
            <SketchPicker
              // disableAlpha={true}
              color={this.rgbaValue(this.state.color)}
              onChange={this.handleChange}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default RightDesignColorPicker;
