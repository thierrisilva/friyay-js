import React, { Component } from 'react';

class Switch extends Component{
  constructor(props) {
    super(props);

    this.handleOnClick = this.handleOnClick.bind(this);
  } 

  handleOnClick(e) {
    e.preventDefault();
    const { handleOnClick, clickParams } = this.props;
    handleOnClick(...clickParams);
  }

  render() {
    const { text, isChecked } = this.props;
    return(
      <div className="flex-r-center mb10">
        <label className="switch" onClick={this.handleOnClick}>
          <input type="checkbox" checked={isChecked} onChange={()=>{}} />
          <div className="slider round"></div>
        </label>
        <span className="ml5">{text}</span>
      </div>
    );
  }
}

export default Switch;