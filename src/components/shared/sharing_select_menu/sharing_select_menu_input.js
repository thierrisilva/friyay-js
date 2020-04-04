import React from 'react';
import PropTypes from 'prop-types';

class SharingSelectMenuInput extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.addAndSelectItems = this.addAndSelectItems.bind(this);
  }

  componentDidMount() {
    let {
      id,
      handleSharingItemRemove,
      handleSharingItemsFilter,
      selectedSharingItems
    } = this.props;

    let $tagsInput = $('#' + id);
    $tagsInput.selectize({
      valueField: 'id',
      labelField: 'name',
      searchField: 'name',
      plugins: ['remove_button'],

      onItemRemove(value) {
        handleSharingItemRemove(value);
      },

      load(query, callback) {
        handleSharingItemsFilter(query);
        callback();
      }
    });

    this.addAndSelectItems(id, selectedSharingItems);
  }

  componentDidUpdate = () => {
    let id = this.props.id;

    this.addAndSelectItems(id, this.props.selectedSharingItems);
  };

  addAndSelectItems(id, selectedSharingItems) {
    let $tagsInput = $('#' + id);
    let selectizedInput = $tagsInput[0].selectize;

    // for (let item of selectizedInput.items) {
    //   selectizedInput.removeItem(item);
    // }

    selectizedInput.clear();
    selectizedInput.addOption(selectedSharingItems);
    for (let item of selectedSharingItems) {
      selectizedInput.addItem(item.id, false);
    }
  }

  render() {
    let { name, id, viewAsDropdown } = this.props;

    return (
      <div className="form-group">
        <select
          className="form-control sharing-menu-selectize topics-menu-selectize"
          name={name}
          id={id}
          multiple={true}
          defaultValue={['']}
        >
          <option value="" disabled>
            Search and select people
          </option>
        </select>
        {!viewAsDropdown && (
          <span className="text-muted mt5" style={{ display: 'block' }}>
            Search and select people to share or type email to invite
          </span>
        )}
      </div>
    );
  }
}

SharingSelectMenuInput.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  handleSharingItemRemove: PropTypes.func,
  handleSharingItemsFilter: PropTypes.func,
  selectedSharingItems: PropTypes.array,
  viewAsDropdown: PropTypes.bool
};

SharingSelectMenuInput.defaultProps = {
  name: 'tip[sharing_item_ids]',
  id: 'tip_sharing_item_ids',
  selectedSharingItems: [],
  viewAsDropdown: false
};

export default SharingSelectMenuInput;
