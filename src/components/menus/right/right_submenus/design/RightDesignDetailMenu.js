import React from 'react';
import { connect } from 'react-redux';
import { func, array, number, bool } from 'prop-types';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import IconButton from 'Components/shared/buttons/IconButton';
import DesignDetailRow from '../elements/DesignDetailRow';
import { SquareButton } from 'Components/shared/buttons/index';
import { changeTopicDesign } from 'Src/newRedux/database/topics/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { updateTopicDesign } from 'Src/newRedux/database/topics/actions';

const designDetails = [
  { id: 'banner_color', name: 'Banner Color', type: 'color' },
  { id: 'banner_color_display', name: 'Banner Color Display', type: 'boolean' },
  { id: 'banner_image_url', name: 'Banner Image', type: 'upload' },
  { id: 'banner_image_display', name: 'Banner Image Display', type: 'boolean' },
  { id: 'card_font_color', name: 'Font Color', type: 'color' },
  { id: 'card_background_color', name: 'Card Color', type: 'color' },
  {
    id: 'card_background_color_display',
    name: 'Card Color Display',
    type: 'boolean'
  },
  { id: 'card_background_image_url', name: 'Card Image', type: 'upload' },
  {
    id: 'card_background_image_display',
    name: 'Card Image Display',
    type: 'boolean'
  },
  {
    id: 'workspace_background_color',
    name: 'Workspace Background',
    type: 'color'
  },
  { id: 'workspace_font_color', name: 'Workspace Font', type: 'color' }
];

const RightDesignDetailMenu = ({
  topic_designs,
  selected,
  canEdit,
  ...props
}) => {
  const updateDesign = () => {
    props.changeTopicDesign(topic_designs[selected]);
  };

  const onChange = (value, id) => {
    props.updateTopicDesign({
      ...topic_designs[selected],
      [id]: value
    });
    switch (id) {
      case 'banner_image_url':
        props.updateTopicDesign({
          ...topic_designs[selected],
          banner_image_display: true
        });
        return;
      case 'card_background_image_url':
        props.updateTopicDesign({
          ...topic_designs[selected],
          card_background_image_display: true
        });
        return;
      case 'banner_color':
        props.updateTopicDesign({
          ...topic_designs[selected],
          banner_color_display: true
        });
        return;
      case 'card_background_color':
        props.updateTopicDesign({
          ...topic_designs[selected],
          card_background_color_display: true
        });
        return;
      default:
        return;
    }
  };

  return (
    <div className="right-submenu">
      <div className="right-submenu_header">
        <IconButton
          fontAwesome
          icon="caret-left"
          onClick={() => props.setRightMenuOpenForMenu('Design')}
        />
        <span className="ml5">{topic_designs[selected].name}</span>
      </div>
      {designDetails.map(designDetail => (
        <DesignDetailRow
          key={designDetail.id}
          detail={designDetail}
          value={topic_designs[selected][designDetail.id]}
          onChange={onChange}
        />
      ))}
      {canEdit && (
        <div className="Right-design-btn-wrapper">
          <SquareButton onClick={updateDesign}>Update</SquareButton>
        </div>
      )}
    </div>
  );
};

RightDesignDetailMenu.propTypes = {
  setRightMenuOpenForMenu: func.isRequired,
  selected: number.isRequired,
  changeTopicDesign: func.isRequired,
  topic_designs: array.isRequired,
  updateTopicDesign: func.isRequired,
  canEdit: bool.isRequired
};

const mapState = state => {
  const sm = stateMappings(state);
  const { topicId } = sm.page;
  return {
    topic_designs: sm.topics[topicId].attributes.topic_designs || []
  };
};

const mapDispatch = {
  setRightMenuOpenForMenu,
  changeTopicDesign,
  updateTopicDesign
};

export default connect(
  mapState,
  mapDispatch
)(RightDesignDetailMenu);
