/* global vex */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import difference from 'lodash/difference';
import React, { Component } from 'react';
import Resizable from 're-resizable';
import cx from 'classnames';

import { columns, sheetConfig } from './sheetConfig/index';
import Icon from 'Src/components/shared/Icon';

const Handle = () => <Icon icon="arrows-h" fontAwesome />;

const ResizableCustom = ({ className, children, handleResize, ...props }) => (
  <Resizable
    className={cx('resize-wrapper', className)}
    handleComponent={{ left: Handle, right: Handle }}
    handleWrapperClass="resize-wrapper__handle-wrapper"
    enable={{
      top: false,
      right: true,
      bottom: false,
      left: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false
    }}
    defaultSize=""
    onResize={handleResize}
    {...props}
  >
    {children}
  </Resizable>
);

class SheetHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDropdown: false,
      columnsSearchKeywords: ''
    };

    this.columnsSearchKeywordsInputRef = React.createRef();
  }

  static propTypes = {
    columns: PropTypes.array.isRequired,
    configureColumns: PropTypes.bool.isRequired,
    scrollContainerRef: PropTypes.func.isRequired,
    sortColumn: PropTypes.string,
    sortOrder: PropTypes.string,
    onColumnToggle: PropTypes.func.isRequired,
    onSortToggle: PropTypes.func.isRequired
  };

  updateInputValue = evt => {
    this.setState({
      columnsSearchKeywords: evt.target.value
    });
  };

  handleNewColumn = () => {
    vex.dialog.open({
      message: 'Select column name and type',
      input: `
        <input
          class="sheet-view-dialog-input"
          name="name"
          placeholder="Column name"
          required
        />
        <select class="sheet-view-dialog-input" name="type" required>
          <option disabled selected>
            Value type
          </option>
          <option value="text">Text</option>
          <option value="bool">Checkbox</option>
          <option value="num">Number</option>
        </select>
      `,
      callback: ({ name, type }) => {
        if (!name || !type) return;

        const columnId = `custom_${new Date().valueOf()}`;

        columns[columnId] = columnId;
        sheetConfig[columnId] = {
          cssModifier: 'custom',
          display: name,
          render(card, stateValue = null, onChange) {
            switch (type) {
              case 'bool': {
                return (
                  <span
                    className="material-icons sheet-view__check"
                    onClick={() => onChange(!stateValue)}
                  >
                    {stateValue ? 'check_box' : 'crop_din'}
                  </span>
                );
              }
              case 'num': {
                return (
                  <input
                    className="sheet-view__input"
                    min="0"
                    placeholder="0"
                    type="number"
                    value={stateValue}
                    onChange={ev => onChange(ev.target.value)}
                  />
                );
              }
              default: {
                return (
                  <input
                    className="sheet-view__input"
                    placeholder="No value"
                    value={stateValue}
                    onChange={ev => onChange(ev.target.value)}
                  />
                );
              }
            }
          },
          renderSummary: () => null
        };

        this.handleOptionSelect(columnId, false);
      }
    });

    this.toggleDropdown(false);
  };

  handleOptionSelect(column, showDropdown) {
    this.props.onColumnToggle(column);
    this.toggleDropdown(showDropdown);
  }

  handleOutsideClick = ev => {
    if (!this.dropdownRef.contains(ev.target)) {
      this.toggleDropdown();
    }
  };

  saveDropdownRef = ref => {
    this.dropdownRef = ref;
  };

  toggleDropdown = (showDropdown = !this.state.showDropdown) => {
    this.setState({ showDropdown, columnsSearchKeywords: '' }, () => {
      if (this.state.showDropdown) {
        document.addEventListener('click', this.handleOutsideClick, false);
        this.columnsSearchKeywordsInputRef.current.focus();
      } else {
        document.removeEventListener('click', this.handleOutsideClick, false);
      }
    });
  };

  resize = modifier => {
    const col = document.getElementsByClassName(
      'sheet-view__cell--' + modifier
    );
    const header = document.getElementsByClassName('rw--' + modifier);
    for (let element of col) {
      element.style.flexBasis = header[0].style.width;
    }
  };

  render() {
    let options = difference(Object.keys(columns), this.props.columns);
    const { columnsSearchKeywords } = this.state;
    if (!!columnsSearchKeywords) {
      options = options.filter(option =>
        sheetConfig[option].display
          .toLowerCase()
          .includes(columnsSearchKeywords.toLowerCase())
      );
    }

    return (
      <div className="sheet-view__header">
        <div className="sheet-view__grid">
          <ResizableCustom
            className="rw--title"
            handleResize={() => this.resize('title')}
            minWidth="350"
          >
            <div className="sheet-view__cell">Cards</div>
          </ResizableCustom>
          {this.props.columns.map(column => {
            const config = sheetConfig[column] || sheetConfig.default;
            const cellClassNames = classNames('sheet-view__cell', {
              [`sheet-view__cell--${config.cssModifier}`]: config.cssModifier
            });

            const resizableProps = config.resizableProps || {};

            return (
              <ResizableCustom
                className={`rw--${config.cssModifier}`}
                handleResize={() => this.resize(config.cssModifier)}
                key={column}
                {...resizableProps}
              >
                <div className={cellClassNames}>
                  <span
                    className="sheet-view__cell-title"
                    onClick={
                      config.sort && (() => this.props.onSortToggle(column))
                    }
                  >
                    {config.display}
                  </span>
                  {this.props.sortColumn === column && (
                    <span className="material-icons sheet-view__sort-btn">
                      {this.props.sortOrder === 'asc'
                        ? 'arrow_downward'
                        : 'arrow_upward'}
                    </span>
                  )}
                  {this.props.configureColumns && (
                    <span
                      className="material-icons sheet-view__cell-remove-btn"
                      onClick={() => this.handleOptionSelect(column, false)}
                    >
                      clear
                    </span>
                  )}
                </div>
              </ResizableCustom>
            );
          })}
          {this.props.configureColumns && (
            <ResizableCustom
              className="rw--add"
              handleResize={() => this.resize('add')}
            >
              <div className="sheet-view__cell sheet-view__cell--add">
                <span
                  className="material-icons sheet-view__add-column-btn"
                  onClick={() => this.toggleDropdown(!!options.length)}
                >
                  add_box
                </span>
                {this.state.showDropdown && (
                  <ul
                    ref={this.saveDropdownRef}
                    className="sheet-view__dropdown"
                  >
                    {/* <li
                    className="sheet-view__dropdown-item"
                    onClick={this.handleNewColumn}
                  >
                    + New column
                  </li> */}
                    <li className="sheet-view__dropdown-item sheet-view__dropdown-item--search-input">
                      <input
                        className="w100"
                        ref={this.columnsSearchKeywordsInputRef}
                        value={this.state.columnsSearchKeywords}
                        onChange={evt => this.updateInputValue(evt)}
                      />
                    </li>
                    {options.map(option => (
                      <li
                        key={option}
                        className="sheet-view__dropdown-item"
                        onClick={() => this.handleOptionSelect(option, true)}
                      >
                        {sheetConfig[option].display}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ResizableCustom>
          )}
        </div>
      </div>
    );
  }
}

export default SheetHeader;
