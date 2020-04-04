import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import inflection from 'inflection';
import flatten from 'lodash/flatten';

import GroupItemLabel from './group_item_label';
import ItemLabelCategoryForm from '../../../../shared/items_container/grid_item/labels/label_category_form';
import LabelForm from '../../../../shared/items_container/grid_item/labels/label_form';
import ItemLabelForm from './item_label_form';

const labelGroupHelpText = key =>
  key.toUpperCase() === 'PUBLIC'
    ? 'Labels everyone will see'
    : 'Labels only you will see';

let selectedItem = '';

function onClickCaretChange(kind, index) {
  let label_category_id = '#add_label_category_collapse-' + kind + '-' + index;
  if ($(label_category_id).hasClass('glyphicon-triangle-right')) {
    $(label_category_id).removeClass('glyphicon-triangle-right');
    $(label_category_id).addClass('glyphicon-triangle-bottom');
  } else {
    $(label_category_id).removeClass('glyphicon-triangle-bottom');
    $(label_category_id).addClass('glyphicon-triangle-right');
  }
}

function mouseOver(data, kind) {
  let label_id = '#add_label_' + data + '_' + kind;
  if (selectedItem != '' && selectedItem != label_id) {
    $(selectedItem).css('display', 'none');
  }
  $(label_id).css('display', 'block');
  selectedItem = label_id;
}

const GroupItemLabels = ({
  labels,
  label_categories_hash,
  labelsCategory,
  switchScreen,
  handleLabelChange,
  selectedLabels,
  removeLabelCategory,
  privateLabelCategoryForm,
  publicLabelCategoryForm,
  handleToggleLabelCategoryForms,
  handleToggleLabelForms
}) => {
  const handleRemoveLabelCategory = categoryId => {
    vex.dialog.confirm({
      message: 'Are you sure you want to delete this label category?',
      callback: async value => value && removeLabelCategory(categoryId)
    });
  };
  const groups = flatten(
    labels
      .reduce(
        (sum, next) =>
          sum.includes(next.attributes.kind)
            ? sum
            : [...sum, next.attributes.kind],
        []
      )
      .sort((kind_option1, kind_option2) => kind_option1 > kind_option2)
      .filter(kind => kind !== 'system')
      .map(kind => {
        const labelsOfKind = labels.filter(
          label => label.attributes.kind === kind
        );

        return [
          <div
            className="list-group-item list-group-header"
            key={`label-header-${kind}`}
          >
            <label>{inflection.titleize(kind)} Labels</label>
            <span className="small ml50">{labelGroupHelpText(kind)}</span>
            <a
              className="label-category-header"
              onClick={() => handleToggleLabelCategoryForms(kind)}
            >
              +Add label category
            </a>
          </div>,
          <div
            className="labels-box pb25"
            id={'labels-' + kind}
            key={`${kind}-labels-box`}
          >
            {kind == 'private' ? (
              <div>
                {privateLabelCategoryForm && (
                  <ItemLabelCategoryForm
                    toggleLabelCategoryForms={handleToggleLabelCategoryForms}
                    kind={kind}
                  />
                )}
              </div>
            ) : (
              <div>
                {publicLabelCategoryForm && (
                  <ItemLabelCategoryForm
                    toggleLabelCategoryForms={handleToggleLabelCategoryForms}
                    kind={kind}
                  />
                )}
              </div>
            )}
            {labelsOfKind.map(label => (
              <GroupItemLabel
                kind={kind}
                selected={selectedLabels.includes(label.id)}
                label={label}
                key={`kind-${kind}-group-label-${label.id}`}
                switchScreen={switchScreen}
                handleLabelChange={handleLabelChange}
              />
            ))}
          </div>,
          <div className="labels-box pb25" key={`${kind}-labels-category-box`}>
            {labelsCategory.map((category, index) => (
              <div key={'labels-category-' + index}>
                <div className="label-category-main">
                  <div>
                    <span
                      className="glyphicon glyphicon-triangle-right glyphicon-custom-set"
                      id={'add_label_category_collapse-' + kind + '-' + index}
                      data-toggle="collapse"
                      data-target={`.demo_${category.id}_${kind}`}
                      aria-hidden="true"
                      onClick={() => onClickCaretChange(kind, index)}
                    />
                  </div>
                  <div
                    className="label-category-name"
                    onMouseOver={() => mouseOver(category.id, kind)}
                  >
                    {category.attributes.name}
                  </div>
                  <div
                    id={`add_label_${category.id}_${kind}`}
                    className="add-label-header"
                  >
                    <a
                      onClick={() => handleToggleLabelForms(category.id, kind)}
                    >
                      <i class="glyphicon glyphicon-plus" />
                    </a>
                    <a onClick={() => handleRemoveLabelCategory(category.id)}>
                      <i class="glyphicon glyphicon-trash" />
                    </a>
                  </div>
                </div>
                {label_categories_hash[category.id + kind] == true ? (
                  <div class="label-category-add-label-form">
                    <LabelForm
                      labelsCategory={labelsCategory}
                      kind={kind}
                      handleLabelChange={handleLabelChange}
                      selected_category={category.id}
                      toggleLabelForm={handleToggleLabelForms}
                    />
                  </div>
                ) : (
                  ''
                )}
                <div className={`collapse demo_${category.id}_${kind}`}>
                  {labels.map(label => (
                    <div key={label.id}>
                      {label.attributes.kind == kind &&
                      label.relationships.label_categories.data.length > 0 &&
                      label.relationships.label_categories.data.filter(
                        label_category => label_category == category.id
                      ).length > 0 ? (
                        <GroupItemLabel
                          kind={label.attributes.kind}
                          selected={selectedLabels.includes(label.id)}
                          label={label}
                          key={`kind-${
                            label.attributes.kind
                          }-group-label-category-${label.id}`}
                          switchScreen={switchScreen}
                          handleLabelChange={handleLabelChange}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ];
      })
  );

  return <div className="list-group-menu-content">{groups}</div>;
};

GroupItemLabels.propTypes = {
  labels: PropTypes.array,
  switchScreen: PropTypes.func.isRequired,
  label_categories_hash: PropTypes.object,
  handleLabelChange: PropTypes.func,
  removeLabelCategory: PropTypes.func,
  selectedLabels: PropTypes.array,
  privateLabelCategoryForm: PropTypes.bool.isRequired,
  publicLabelCategoryForm: PropTypes.bool.isRequired
};

export default GroupItemLabels;
