import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { sheetConfig } from './sheetConfig/index';

class SheetFooter extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    configureColumns: PropTypes.bool.isRequired,
    scrollContainerRef: PropTypes.func.isRequired
  };

  render() {
    return (
      <Fragment>
        {['card', 'yay'].map(type => (
          <div className="sheet-view__footer" key={type}>
            <div className="sheet-view__grid">
              <div className="sheet-view__cell sheet-view__cell--title">
                <input
                  type="text"
                  placeholder={`Type ${type} title`}
                  onChange={({ target }) =>
                    this.props.changeTitle({ [`${type}Title`]: target.value })
                  }
                  value={this.props[`${type}Title`]}
                  onKeyPress={this.props.handleKeyPress(type)}
                  className="add-subtopic-input sheet-view-add-card-input"
                />
              </div>
              {this.props.columns.map(column => {
                const config = sheetConfig[column] || sheetConfig.default;
                const cellClassNames = classNames('sheet-view__cell', {
                  [`sheet-view__cell--${
                    config.cssModifier
                  }`]: config.cssModifier
                });

                return <div key={column} className={cellClassNames} />;
              })}
              {this.props.configureColumns && (
                <div className="sheet-view__cell sheet-view__cell--add" />
              )}
            </div>
          </div>
        ))}
        <div ref={this.props.scrollContainerRef} className="sheet-view__footer">
          <div className="sheet-view__grid">
            <div className="sheet-view__cell sheet-view__cell--title">
              Summary
            </div>
            {this.props.columns.map(column => {
              const config = sheetConfig[column] || sheetConfig.default;
              const cellClassNames = classNames('sheet-view__cell', {
                [`sheet-view__cell--${config.cssModifier}`]: config.cssModifier
              });

              return (
                <div key={column} className={cellClassNames}>
                  {config.renderSummary(this.props.cards)}
                </div>
              );
            })}
            {this.props.configureColumns && (
              <div className="sheet-view__cell sheet-view__cell--add" />
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SheetFooter;
