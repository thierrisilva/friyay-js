import React from 'react';
import { connect } from 'react-redux';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';

import IconButton from 'Components/shared/buttons/IconButton';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { getLabelsInAlphaOrder } from 'Src/newRedux/database/labels/selectors';
import { getLabelCategoriesArray } from 'Src/newRedux/database/labelCategories/selectors';
import ReactSelectCustom from 'Components/shared/ReactSelectCustom';
import reactSelectCustomStyles from 'Components/shared/ReactSelectCustom/reactSelectCustomStyles';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import {
  MultiValueLabel,
  MultiValueRemove
} from 'Components/shared/ReactSelectCustom/reactSelectCustomComponents';
import { components } from 'react-select';

class SheetCardLabels extends React.PureComponent {
  render() {
    let {
      handleValueUpdate,
      card,
      labels,
      setRightMenuOpenForMenu
    } = this.props;

    labels = labels.filter(e => e.attributes.kind != 'system');
    const options = labels.map(label => {
      return {
        value: label.id,
        label: label.attributes.name,
        item: label
      };
    });

    const groupedOptions = Object.entries(
      groupBy(options, 'item.attributes.kind')
    ).map(([label, options]) => ({ label, options }));

    const defaultValue = card.relationships.labels.data.map(id =>
      options.find(option => option.value == id)
    );

    return (
      <ReactSelectCustom
        className="sheet-view__card-label-select"
        defaultValue={defaultValue}
        onChange={labels => {
          handleValueUpdate({
            relationships: {
              labels: { data: labels.map(label => label.value) }
            }
          });
        }}
        styles={{
          ...reactSelectCustomStyles,
          control: provided => ({
            ...reactSelectCustomStyles.control(provided),
            border: 'none'
          })
        }}
        components={{
          MultiValueLabel,
          MultiValueRemove,
          NoOptionsMessage: props => (
            <div className="flex-c-center-spacebetween">
              <div className="text-light-muted">
                <components.NoOptionsMessage {...props} />
              </div>
              <button
                className="btn btn-default btn-sm"
                onClick={() => setRightMenuOpenForMenu('Filters_Labels')}
              >
                Create Label
              </button>
            </div>
          )
        }}
        options={groupedOptions}
        isMulti
        isSearchable
      />
    );
  }
}

const mapState = state => ({
  labels: getLabelsInAlphaOrder(state),
  labelsCategory: getLabelCategoriesArray(state)
});

const mapDispatch = {
  setRightMenuOpenForMenu
};

const SheetCardLabelsConnected = connect(
  mapState,
  mapDispatch
)(SheetCardLabels);

export default {
  cssModifier: 'label',
  display: 'Label',
  resizableProps: {
    minWidth: '200'
  },
  Component: SheetCardLabelsConnected,
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(
      cards,
      card => card.relationships.labels.data.length || 0,
      order
    );
  }
};
