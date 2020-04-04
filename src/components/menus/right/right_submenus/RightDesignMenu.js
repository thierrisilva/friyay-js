import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';
import FormInput from 'Components/shared/forms/FormInput';
import {
  createTopicDesign,
  changeTopicDesign,
  removeTopicDesign,
  selectTopicDesign,
  activateDefaultDesign
} from 'Src/newRedux/database/topics/thunks';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import IconButton from 'Components/shared/buttons/IconButton';
import RightDesignDetailMenu from './design/RightDesignDetailMenu';
import DefaultBadge from 'Components/shared/badges/DefaultBadge';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import OptionsDropdownButton from 'Components/shared/buttons/OptionsDropdownButton';

class RightDesignMenu extends Component {
  static propTypes = {
    displaySubmenu: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
      .isRequired,
    setOpenMenu: PropTypes.func.isRequired,
    topicId: PropTypes.string,
    createTopicDesign: PropTypes.func,
    topic_designs: PropTypes.array.isRequired,
    active_design: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    removeTopicDesign: PropTypes.func.isRequired,
    selectTopicDesign: PropTypes.func.isRequired,
    changeTopicDesign: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    topic: PropTypes.object,
    activateDefaultDesign: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      inInputMode: false,
      title: '',
      selected: null
    };

    this.setOpenMenu = props.setOpenMenu;
  }

  clickDesignDetail = index => {
    this.setState({
      selected: index
    });
    this.setOpenMenu('Design_Sub');
  };

  handleKeyDown = e => {
    if (e.key == 'Escape' || e.keyCode == 27) {
      this.handleToggleInputMode();
    }
  };

  handleToggleInputMode = () => {
    this.state.inInputMode
      ? window.removeEventListener('keydown', this.handleKeyDown, true)
      : window.addEventListener('keydown', this.handleKeyDown, true);
    this.setState(state => ({ inInputMode: !state.inInputMode }));
  };

  handleDesignTitle = title => {
    this.setState({ title });
  };

  createDesign = async () => {
    this.setState({
      inInputMode: false
    });
    const design = await this.props.createTopicDesign({
      topic_id: Number(this.props.topicId),
      name: this.state.title
    });
    if (this.isOwner && !this.props.topic.attributes.default_design_id) {
      // Set topic default
      this.setDefault({
        topic_id: this.props.topicId,
        design_id: design.data.data.id
      });
    }
    this.setState({ title: '' });
  };

  setDefault = async ({ topic_id, design_id }) => {
    await this.props.activateDefaultDesign({
      topic_id,
      design_id
    });
  };

  isOwner = () => {
    const {
      topic: {
        relationships: {
          abilities: {
            data: {
              self: { can_edit, can_delete }
            }
          }
        }
      }
    } = this.props;
    if (can_edit && can_delete) {
      return true;
    }
    return false;
  };

  deleteDesign = async (id, topic_id) => {
    await this.props.removeTopicDesign(id, topic_id);
  };

  selectDesign = async (id, topic_id) => {
    await this.props.selectTopicDesign(id, topic_id);
  };

  canEdit = user_id => {
    return Number(this.props.userId) === Number(user_id);
  };

  render() {
    const {
      displaySubmenu,
      topic_designs,
      active_design,
      isLoading,
      topic
    } = this.props;
    const { selected, inInputMode, title } = this.state;
    return (
      <div className="right-submenu">
        <div className="right-submenu_header">
          <IconButton
            fontAwesome
            icon="caret-left"
            onClick={() => this.setOpenMenu(true)}
          />
          <span className="ml5">Design</span>
        </div>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <Fragment>
            {topic_designs &&
              topic_designs.map((design, index) => (
                <div className="Right-design" key={design.id}>
                  <a
                    className="right-submenu_item option Right-design-name"
                    onClick={() => this.clickDesignDetail(index)}
                  >
                    <span>{design.name}</span>
                    <span>
                      {Number(active_design) === Number(design.id) && (
                        <DefaultBadge text="active" />
                      )}
                      {Number(topic.attributes.default_design_id) ===
                        Number(design.id) && <DefaultBadge text="default" />}
                    </span>
                  </a>
                  <OptionsDropdownButton>
                    <a
                      className="dropdown-option-item"
                      onClick={() => {
                        this.selectDesign(design.id, design.topic_id);
                      }}
                    >
                      Activate
                    </a>
                    {this.isOwner() && (
                      <a
                        className="dropdown-option-item"
                        onClick={() => {
                          this.setDefault({
                            design_id: design.id,
                            topic_id: design.topic_id
                          });
                        }}
                      >
                        Default
                      </a>
                    )}
                    {this.canEdit(design.user_id) && (
                      <a
                        className="dropdown-option-item"
                        onClick={() => {
                          this.deleteDesign(design.id, design.topic_id);
                        }}
                      >
                        Delete
                      </a>
                    )}
                  </OptionsDropdownButton>
                </div>
              ))}

            {!isLoading && inInputMode && (
              <div className="Right-design-add-wrapper">
                <FormInput
                  autoFocus
                  defaultValue={title}
                  onChange={this.handleDesignTitle}
                  onSubmit={this.createDesign}
                  placeholder="Design Title"
                />
                <div className="add-card-input-footer">
                  <p>hit enter to create</p>
                  <a onClick={() => {}}>Create</a>
                </div>
              </div>
            )}
            {!isLoading && !inInputMode && (
              <a
                className="right-submenu_item Right-design-add-color option"
                onClick={this.handleToggleInputMode}
              >
                <span>Add new design</span>
              </a>
            )}
            <div
              className={`${
                typeof displaySubmenu === 'string' &&
                displaySubmenu === 'Design_Sub'
                  ? 'right-submenu_option-container presented'
                  : 'right-submenu_option-container'
              }`}
            >
              {displaySubmenu == 'Design_Sub' && (
                <RightDesignDetailMenu
                  canEdit={this.canEdit(topic_designs[selected].user_id)}
                  selected={selected}
                />
              )}
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const topicId = sm.page.topicId;
  const topic = sm.topics[topicId];
  let topic_designs, active_design;
  if (topic) {
    topic_designs = sm.topics[topicId].attributes.topic_designs;
    active_design =
      sm.topics[topicId].attributes.topic_design_id_for_current_user;
  }
  return {
    topic,
    topicId,
    userId: sm.user.id,
    displaySubmenu: sm.menus.displayRightSubMenuForMenu,
    topic_designs,
    active_design,
    isLoading: sm.views.topicDesignLoading
  };
};

const mapDispatch = {
  setOpenMenu: setRightMenuOpenForMenu,
  createTopicDesign,
  changeTopicDesign,
  removeTopicDesign,
  selectTopicDesign,
  activateDefaultDesign
};

export default connect(
  mapState,
  mapDispatch
)(RightDesignMenu);
