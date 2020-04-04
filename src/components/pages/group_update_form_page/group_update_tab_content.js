import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SharingSelectMenu from '../../shared/sharing_select_menu';
import { TextArea, Input } from '../../shared/forms';

import get from 'lodash/get';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';


class GroupUpdateTabContent extends PureComponent {
  static propTypes = {
    group: PropTypes.object.isRequired,
    handleGroupUpdateFormSubmit: PropTypes.func.isRequired,
    handleGroupFormNext: PropTypes.func.isRequired,
    handleGroupFormBack: PropTypes.func.isRequired
  };

  render() {
    const {
      props: {
        people,
        group: { attributes: { title, description }, relationships: { user_followers = { data: [] } } },
        handleGroupFormBack,
        handleGroupFormNext,
        handleGroupUpdateFormSubmit
      }
    } = this;

    const selectedSharingItems = user_followers.data
      .map( userId => ({
        id: `users-${userId}`,
        name: people[ userId ] ? get(people[ userId ], 'attributes.name', 'Unknown User') : 'Unknown User'
      }));

    return (
      <div className="tab-pane active" role="tabpanel" id="group-pane">
        <form
          className="main-form"
          id="main-group-form"
          method="post"
          onSubmit={handleGroupUpdateFormSubmit}
        >
          <div
            id="carousel-group-form"
            className="carousel"
            data-ride="carousel"
            data-interval="false"
            data-keyboard="false"
          >
            <ul className="slide-indicators nav nav-pills main-form-content-nav">
              <li
                role="presentation"
                className="active"
                data-target="#carousel-group-form"
                data-slide-to="0"
              >
                <a>General settings</a>
              </li>
              <li
                role="presentation"
                data-target="#carousel-group-form"
                data-slide-to="1"
              >
                <a>Members</a>
              </li>
            </ul>

            <div className="carousel-inner" role="listbox">
              <div className="item active">
                <div className="panel-body">
                  <div className="form-group group-title-input-group">
                    <Input
                      type="text"
                      id="group_title"
                      name="group[title]"
                      className="form-control form-control-minimal"
                      placeholder="Type Team Title"
                      autoComplete="off"
                      defaultValue={title}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <TextArea
                      id="group_description"
                      className="form-control main-form-description"
                      name="group[description]"
                      defaultValue={description}
                      placeholder="Optional: Describe what this Team is about"
                    />
                  </div>
                </div>
                <div className="navbar navbar-fixed-bottom">
                  <div className="pull-right">
                    <a
                      className="btn btn-link btn-next"
                      onClick={handleGroupFormNext}
                    >
                      NEXT
                    </a>
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-save mr10"
                      value="SAVE & CLOSE"
                      data-disable-with="Saving..."
                    />
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="panel-body">
                  <SharingSelectMenu
                    selectTitle="Team members"
                    sharingFor="group"
                    sharableTypes={['User']}
                    hasDefaultSharingItems={false}
                    selectedSharingItems={selectedSharingItems}
                  />
                </div>
                <div className="navbar navbar-fixed-bottom">
                  <div className="pull-right">
                    <a
                      className="text-muted mr10"
                      onClick={handleGroupFormBack}
                    >
                      Back
                    </a>
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-save mr10"
                      value="SAVE & CLOSE"
                      data-disable-with="Saving..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}


const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    people: sm.people,
  }
}


export default connect(mapState)(GroupUpdateTabContent);
