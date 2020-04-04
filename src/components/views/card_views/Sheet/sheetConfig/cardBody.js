import React, { PureComponent, Fragment } from 'react';
import orderBy from 'lodash/orderBy';
import get from 'lodash/get';
import TextEditor from 'Components/shared/text_editor';
import Dotdotdot from 'react-dotdotdot';
import StringHelper from 'Src/helpers/string_helper';

class CardBody extends PureComponent {
  state = {
    isInEditMode: false
  };

  toggleEditMode = () =>
    this.setState(prev => ({ isInEditMode: !prev.isInEditMode }));

  handleClickSave = () => {
    const { card, value } = this.props;
    const body = value || get(card, 'attributes.body', '');

    this.props.handleValueUpdate({ attributes: { body } });
    this.toggleEditMode();
  };

  render() {
    const { isInEditMode } = this.state;
    const { value, handleValueChange, card } = this.props;

    const body = value || get(card, 'attributes.body', '');

    return (
      <Fragment>
        {isInEditMode ? (
          <div className="flex-c-start-spacebetween w100" style={{ zIndex: 0 }}>
            <TextEditor
              settings={{ toolbarInline: true, zIndex: 12 }}
              tabIndex={1}
              placeholder="Write your Card content here"
              body={body || 'Write here...'}
              onChange={handleValueChange}
            />
            <button
              className="btn btn-default btn-xs"
              style={{ alignSelf: 'flex-end' }}
              onClick={this.handleClickSave}
            >
              Save
            </button>
          </div>
        ) : (
          <Dotdotdot>
            <div
              onDoubleClick={this.toggleEditMode}
              dangerouslySetInnerHTML={{
                __html: StringHelper.simpleFormat(
                  StringHelper.truncate(
                    body ||
                      '<span class="text-muted">Double click to edit</span>',
                    180
                  )
                )
              }}
            />
          </Dotdotdot>
        )}
      </Fragment>
    );
  }
}

export default {
  cssModifier: 'body',
  display: 'Body',
  resizableProps: {
    minWidth: '140'
  },
  Component: CardBody,
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(cards, card => (card.attributes.body || '').length, order);
  }
};
