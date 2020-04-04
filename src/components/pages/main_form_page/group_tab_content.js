import React from 'react';
import PropTypes from 'prop-types';
import SharingSelectMenu from '../../shared/sharing_select_menu';
import { TextArea, Input } from '../../shared/forms';

class GroupTabContent extends React.Component {
  static propTypes = {
    onGroupSlide: PropTypes.func,
    handleGroupFormSubmit: PropTypes.func,
    handleGroupFormNext: PropTypes.func,
    handleGroupFormBack: PropTypes.func,
    hasDescription: PropTypes.bool
  };

  static defaultProps = {
    hasDescription: false
  };

  componentDidMount() {
    const $groupCarousel = $('#carousel-group-form').carousel({
      interval: false,
      keyboard: false
    });

    $groupCarousel.on('slide.bs.carousel', this.props.onGroupSlide);
  }

  render() {
    const {
      props: {
        hasDescription,
        handleGroupFormNext,
        handleGroupFormSubmit,
        handleGroupFormBack
      }
    } = this;

    return (
      <div className="tab-pane" role="tabpanel" id="group-pane">
        <form
          className="main-form"
          id="main-group-form"
          method="post"
          onSubmit={handleGroupFormSubmit}
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
                      required
                    />
                  </div>
                  <div className="form-group">
                    {hasDescription && (
                      <TextArea
                        id="group_description"
                        className="form-control main-form-description"
                        name="group[description]"
                        placeholder="Optional: Describe what this Team is about"
                      />
                    )}
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
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="panel-body">
                  <SharingSelectMenu
                    selectTitle="Team members"
                    sharingFor="group"
                    sharableTypes={['User']}
                    selectedSharingItems={[]}
                    hasDefaultSharingItems={false}
                  />
                </div>
                <div className="navbar navbar-fixed-bottom">
                  <div className="pull-right">
                    <a
                      className="text-muted mr15"
                      onClick={handleGroupFormBack}
                    >
                      Back
                    </a>
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-save"
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

export default GroupTabContent;
