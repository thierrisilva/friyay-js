import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { sheetConfig } from './sheetConfig/index';

class SheetAddCard extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    configureColumns: PropTypes.bool.isRequired,
    level: PropTypes.number.isRequired,
    onAddCard: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  state = { newCardTitle: '' };

  handleNewCardTitleChange = ev => {
    this.setState({ newCardTitle: ev.target.value });
  };

  handleNewCardTitleKeyDown = ev => {
    if (ev.keyCode === 13 && ev.target.value) {
      this.props.onAddCard(ev.target.value);
      this.setState({ newCardTitle: '' });
    }
  };

  render() {
    const nestingLevelPadding = this.props.level * 20;

    const titleHeader = document.getElementsByClassName('rw--title');

    return (
      <div className="sheet-view__card">
        <div
          className="sheet-view__cell sheet-view__cell--title"
          style={{
            paddingLeft: `${nestingLevelPadding}px`,
            ...(titleHeader[0] && { flexBasis: titleHeader[0].style.width })
          }}
        >
          <input
            className="sheet-view__input"
            autoFocus
            placeholder="Card title"
            style={{ width: '100%' }}
            value={this.state.newCardTitle}
            onBlur={this.props.onCancel}
            onChange={this.handleNewCardTitleChange}
            onKeyDown={this.handleNewCardTitleKeyDown}
          />
        </div>
        {this.props.columns.map(column => {
          const config = sheetConfig[column] || sheetConfig.default;
          const modifier = config.cssModifier;
          const cellClassNames = classNames('sheet-view__cell', {
            [`sheet-view__cell--${modifier}`]: modifier
          });

          const header = document.getElementsByClassName(`rw--${modifier}`);

          return (
            <div
              key={column}
              className={cellClassNames}
              style={{
                ...(header[0] && { flexBasis: header[0].style.width })
              }}
            />
          );
        })}
        {this.props.configureColumns && (
          <div className="sheet-view__cell sheet-view__cell--add" />
        )}
      </div>
    );
  }
}

export default SheetAddCard;
