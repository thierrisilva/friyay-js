/* global Promise, Messenger */
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { isEmpty, sortBy } from 'underscore';
import PageModal from './page_modal';
import APIRequest from '../../lib/ApiRequest';
import analytics from '../../lib/analytics';
import ReactSelectCustom from 'Components/shared/ReactSelectCustom';
import tiphive from '../../lib/tiphive';
import inflection from 'inflection';

//MH connected to redux to get userId and dismiss func only on 17Mar18. Haven't changed anything else
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { setUserInvitationModalOpen } from 'Src/newRedux/interface/modals/actions';
import TopicsListDropdown from 'Components/shared/topics_list_dropdown';

const userRoles = [
  { value: 'guest', label: 'Guest' },
  { value: 'domain', label: 'Member' }
];

const SPACEBAR_KEY = 32;
const ENTER_KEY = 13;

const sortByLabel = toSort => sortBy(toSort, 'label');
const defaultEntry = {
  cards: [{ value: -1, label: 'All cards', isClearable: false }]
};
const loadTipsByHiveId = (hiveId, domain) => {
  return new Promise((resolve, reject) => {
    APIRequest.get({
      resource: `topics/${hiveId}/tips`,
      domain
    })
      .done(({ data }) => {
        const tips = data.map(({ id, attributes: { title } }) => ({
          value: id,
          label: title
        }));
        resolve(sortByLabel(tips));
      })
      .fail((xhr, status, error) => {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load teams');
        }
        reject(error);
      });
  });
};

const loadAllHives = (searchValue, domain) => {
  return new Promise((resolve, reject) => {
    APIRequest.get({
      resource: 'topics',
      domain,
      data: {
        filter: {
          title: searchValue || null
        },
        search_all_hives: searchValue ? true : null,
        page: {
          size: 999
        }
      }
    })
      .done(({ data }) => {
        const hives = data.map(({ id, attributes: { title } }) => ({
          value: id,
          label: title
        }));
        resolve(sortByLabel(hives));
      })
      .fail((xhr, status, error) => {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load yays');
        }
        reject(error);
      });
  });
};

const loadAllGroups = (searchValue, domain) => {
  return new Promise((resolve, reject) => {
    APIRequest.get({
      resource: 'groups',
      domain,
      data: {
        filter: {
          title: searchValue || null
        },
        page: {
          size: 999
        }
      }
    })
      .done(({ data }) => {
        const groups = data.map(({ id, attributes: { title } }) => ({
          value: id,
          label: title
        }));
        resolve(sortByLabel(groups));
      })
      .fail((xhr, status, error) => {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load teams');
        }
        reject(error);
      });
  });
};

const loadAllUsers = (searchValue, domain) => {
  return new Promise((resolve, reject) => {
    APIRequest.get({
      resource: 'users',
      domain,
      data: {
        filter: {
          first_name: searchValue || null,
          last_name: searchValue || null,
          users: 'all'
        },
        page: {
          size: 999
        }
      }
    })
      .done(({ data }) => {
        const users = data.map(
          ({ id, attributes: { first_name, last_name } }) => ({
            value: id,
            label: `${first_name} ${last_name}`
          })
        );
        resolve(users);
      })
      .fail((xhr, status, error) => {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load users');
        }
        reject(error);
      });
  });
};

const isValidEmail = email => {
  const REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
  return REGEX_EMAIL.test(email);
};

const removeQuotes = (email = '') => {
  email = email && email.trim();
  if (email.includes('"')) {
    email = email.replace(/"/g, '');
  }
  return email;
};

const getCardOptionsById = (options, id) =>
  options.filter(topic => topic.parentId === id);

class UsersInvitationPage extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    setUserInvitationModalOpen: PropTypes.func.isRequired,
    domain: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      invitationEmail: '',
      invalidEmails: [],
      loadMore: false,
      loadMoreItem: [],
      invitationType: 'domain',
      hivesOptions: [],
      inviting: false,
      isLoadingHiveOptions: false,
      isLoadingGroupOptions: false,
      isLoadingUserOptions: false,
      isLoadingTipsOptions: null,
      groupsOptions: [],
      usersOptions: [],
      cardsOptions: [],
      selectedHives: [],
      selectedGroups: [],
      selectedUsers: [],
      selectedCards: [],
      allHivesFollow: true,
      allUsersFollow: true,
      hideTopicSelector: true
    };

    this.onSelectizeBlur = this.onSelectizeBlur.bind(this);
    this.onSelectizeType = this.onSelectizeType.bind(this);
    this.onSelectizeInputKeydown = this.onSelectizeInputKeydown.bind(this);
    this.createSelectizeItem = this.createSelectizeItem.bind(this);
    this.createSelectizeItemFilter = this.createSelectizeItemFilter.bind(this);
    this.handleUserRoles = this.handleUserRoles.bind(this);
    this.handleHivesSelect = this.handleHivesSelect.bind(this);
    this.handleUsersSelect = this.handleUsersSelect.bind(this);
    this.handleFollowAllHives = this.handleFollowAllHives.bind(this);
    this.handleFollowAllUsers = this.handleFollowAllUsers.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFocusOnHives = this.handleFocusOnHives.bind(this);
    this.handleFocusOnGroups = this.handleFocusOnGroups.bind(this);
    this.handleFocusOnUsers = this.handleFocusOnUsers.bind(this);
    this.handleHivesInputChange = this.handleHivesInputChange.bind(this);
    this.handleUsersInputChange = this.handleUsersInputChange.bind(this);
    this.buildOptions = this.buildOptions.bind(this);
  }

  componentDidMount() {
    const invitation_emails = $('#invitation_emails').selectize({
      plugins: ['remove_button'],
      splitOn: /[, ]/,
      persist: false,
      maxItems: null,
      create: this.createSelectizeItem,
      createFilter: this.createSelectizeItemFilter,
      selectOnTab: true,
      openOnFocus: false
    });

    this.selectize = invitation_emails[0].selectize;
    this.selectize.on('blur', this.onSelectizeBlur);
    this.selectize.on('type', this.onSelectizeType);

    $('#invitation_emails-selectized').on(
      'keydown',
      this.onSelectizeInputKeydown
    );
  }

  createSelectizeItem(value) {
    value = removeQuotes(value);
    if (isValidEmail(value)) {
      return {
        value,
        text: value
      };
    }
    return false;
  }

  createSelectizeItemFilter(value) {
    value = removeQuotes(value);
    if (value && !isValidEmail(value)) {
      if (!this.state.invalidEmails.includes(value)) {
        this.setState({
          invalidEmails: [].concat(this.state.invalidEmails, [value])
        });
      }
      return false;
    } else if (value && isValidEmail(value)) {
      return true;
    }
  }

  onSelectizeBlur() {
    this.selectize.createItem(this.state.invitationEmail);
    this.setState({
      invitationEmail: ''
    });
  }

  onSelectizeType(value) {
    this.setState({
      invitationEmail: value,
      invalidEmails: []
    });
    this.selectize.close();
  }

  onSelectizeInputKeydown(e) {
    const email = removeQuotes(e.target.value);
    if (e.keyCode === ENTER_KEY) {
      e.preventDefault();
    }

    if (
      (e.keyCode === SPACEBAR_KEY || e.keyCode === ENTER_KEY) &&
      isValidEmail(email)
    ) {
      this.selectize.createItem(e.target.value);
    }
  }

  handleFormSubmit = async e => {
    e.preventDefault();
    const {
      state: { invitationType }
    } = this;
    const invitationEmails = $('#invitation_emails')
      .val()
      .trim();
    const invitationMessage = $('#invitation_message')
      .val()
      .trim();
    this.setState({ inviting: true });

    await APIRequest.post({
      resource: 'invitations',
      domain: this.props.domain,
      data: {
        data: {
          emails: invitationEmails.split(','),
          custom_message: invitationMessage,
          invitation_type: invitationType || 'account',
          invitable_type: 'User',
          invitable_id: this.props.userId,
          options: this.buildOptions()
        }
      }
    })
      .done(() => {
        var $primaryModal = $('#primary-modal');
        $primaryModal.modal('hide');
        APIRequest.showSuccessMessage('Invitation sent');
        analytics.track('Sent Invitations', {
          email_list: invitationEmails.split(',')
        });
        this.props.setUserInvitationModalOpen(null);
      })
      .fail(xhr => {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
      });
    this.setState({ inviting: false });
  };

  buildOptions() {
    // We cannot return options that are nil or empty
    const {
      state: {
        selectedHives,
        selectedGroups,
        selectedUsers,
        selectedCards,
        allHivesFollow,
        allUsersFollow
      }
    } = this;

    const selectedTopicIds = selectedHives.map(topic => topic.id);
    const selectedGroupIds = selectedGroups.map(group => group.value);
    const userIds = selectedUsers.map(topic => topic.id);

    let options = {};

    if (selectedTopicIds.length > 0) {
      options.topics = selectedTopicIds.map(topicId => {
        const { cards } =
          selectedCards.find(topic => topic.id === topicId) || {};

        const isAll = isEmpty(cards.filter(card => card.value !== -1));
        return {
          id: topicId,
          tips: isAll ? ['all'] : cards.map(card => card.value)
        };
      });
    } else if (allHivesFollow) {
      options.topics = [{ id: 'all' }];
    }

    if (userIds.length > 0) {
      options.users = userIds;
    } else if (allUsersFollow) {
      options.users = ['all'];
    }

    if (selectedGroupIds.length > 0) {
      options.groups = selectedGroupIds;
    }

    return options;
  }

  handleFileChange(event) {
    const file = event.target.files[0];
    let reader = new FileReader();
    if (file) {
      // Read file into memory as UTF-8
      reader.readAsText(file);
      // Handle errors load
      reader.onload = this.loadFileHandler.bind(this);
      reader.onerror = this.errorFileHandler;
    }
  }

  loadFileHandler(event) {
    const csv = event.target.result;
    this.processCSV.call(this, csv);
  }

  processCSV(csv) {
    // seprate with new lines
    const allTextLines = csv.split(/\r\n|\n/);
    const lines = [];
    allTextLines.forEach(line => {
      let rowTextLines = [];
      rowTextLines = line.split(',');
      // check if there is more than one email in line
      if (rowTextLines.length > 1) {
        rowTextLines.forEach(columnTextLines => {
          columnTextLines = removeQuotes(columnTextLines);
          if (isValidEmail(columnTextLines)) {
            lines.push(columnTextLines);
          } else if (columnTextLines) {
            this.setState({
              invalidEmails: [].concat(this.state.invalidEmails, [
                columnTextLines
              ])
            });
          }
        });
      } else if (rowTextLines.length) {
        let email = removeQuotes(rowTextLines[0]);
        if (isValidEmail(email)) {
          lines.push(email);
        } else if (email) {
          this.setState({
            invalidEmails: [].concat(this.state.invalidEmails, [email])
          });
        }
      }
    });
    // create a item in selectize
    lines.forEach(email => {
      this.selectize.createItem(email);
    });
  }

  errorFileHandler(evt) {
    if (evt.target.error.name == 'NotReadableError') {
      Messenger().error({
        message: 'Cannot read file!'
      });
    }
  }

  handleUserRoles(seletedRole) {
    const value = seletedRole && seletedRole.value;

    if (value) {
      let allHivesFollow = false;
      let allUsersFollow = false;

      if (value === 'domain') {
        allHivesFollow = true;
        allUsersFollow = true;
      }

      this.setState({
        invitationType: value,
        allHivesFollow,
        allUsersFollow
      });
    } else {
      this.setState({
        invitationType: ''
      });
    }
  }

  handleHivesSelect(selectedHives) {
    let {
      state: { allHivesFollow, selectedCards }
    } = this;

    if (selectedHives && selectedHives.length) {
      allHivesFollow = false;
    }

    const hiveIds = selectedHives.map(topic => topic.id);
    const selectedIds = selectedCards.map(topic => topic.id);
    const added = hiveIds.filter(topicId => !selectedIds.includes(topicId));
    const removed = selectedIds.filter(topicId => !hiveIds.includes(topicId));
    const untouched = selectedCards.filter(
      topic => !removed.includes(topic.id)
    );

    let newCards = [
      ...untouched,
      ...added.map(topicId =>
        Object.assign(
          {},
          selectedHives.find(topic => topic.id === topicId),
          defaultEntry
        )
      )
    ];

    this.setState({
      selectedHives: sortByLabel(selectedHives),
      allHivesFollow,
      selectedCards: sortByLabel(newCards)
    });

    return false;
  }

  handleGroupsSelect = selectedGroups => {
    this.setState({ selectedGroups });
  };

  handleUsersSelect(selectedUsers) {
    this.setState({ selectedUsers });
  }

  handleFollowAllHives(e) {
    this.setState({
      allHivesFollow: e.target.checked,
      selectedHives: [],
      selectedCards: []
    });
  }

  handleFollowAllUsers(e) {
    this.setState({
      allUsersFollow: e.target.checked
    });
  }

  handleFocusOnHives() {
    if (isEmpty(this.state.hivesOptions)) {
      this.setState({
        isLoadingHiveOptions: true
      });

      loadAllHives(null, this.props.domain).then(hivesOptions => {
        this.setState({
          isLoadingHiveOptions: false,
          hivesOptions
        });
      });
    }
  }

  handleHivesInputChange(searchValue) {
    this.setState({
      isLoadingHiveOptions: true
    });

    loadAllHives(searchValue, this.props.domain).then(hivesOptions => {
      this.setState({
        isLoadingHiveOptions: false,
        hivesOptions
      });
    });
  }

  handleFocusOnGroups() {
    this.setState({
      isLoadingGroupOptions: true
    });

    loadAllGroups(null, this.props.domain).then(groupsOptions => {
      this.setState({
        isLoadingGroupOptions: false,
        groupsOptions
      });
    });
  }

  handleGroupsInputChange = searchValue => {
    this.setState({
      isLoadingGroupOptions: true
    });

    loadAllGroups(searchValue, this.props.domain).then(groupsOptions => {
      this.setState({
        isLoadingGroupOptions: false,
        groupsOptions
      });
    });
  };

  handleFocusOnUsers() {
    this.setState({
      isLoadingUserOptions: true
    });

    loadAllUsers(null, this.props.domain).then(usersOptions => {
      this.setState({
        isLoadingUserOptions: false,
        usersOptions
      });
    });
  }

  handleUsersInputChange(searchValue) {
    this.setState({
      isLoadingUserOptions: true
    });

    loadAllUsers(searchValue, this.props.domain).then(usersOptions => {
      this.setState({
        isLoadingUserOptions: false,
        usersOptions
      });
    });
  }

  handleFocusOnCards(id) {
    const {
      state: { cardsOptions }
    } = this;

    if (isEmpty(getCardOptionsById(cardsOptions, id))) {
      this.setState({
        isLoadingTipsOptions: id
      });

      loadTipsByHiveId(id, this.props.domain).then(cards => {
        this.setState({
          cardsOptions: sortByLabel([
            ...cardsOptions,
            ...cards.map(card => Object.assign({}, card, { parentId: id }))
          ]),
          isLoadingTipsOptions: null
        });
      });
    }
  }

  handleCardsSelect(id, value) {
    const { cardsOptions, selectedCards } = this.state;
    if (isEmpty(getCardOptionsById(cardsOptions, id))) {
      this.setState({
        isLoadingTipsOptions: id
      });

      loadTipsByHiveId(id, this.props.domain).then(cards => {
        this.setState({
          cardsOptions: sortByLabel([
            ...cardsOptions,
            ...cards.map(card => Object.assign({}, card, { parentId: id }))
          ]),
          isLoadingTipsOptions: null
        });
      });
    }

    const item = selectedCards.find(topic => topic.id === id);
    const empty = isEmpty(value);

    this.setState({
      selectedCards: sortByLabel([
        ...selectedCards.filter(topic => topic.id !== id),
        Object.assign(
          {},
          item,
          empty
            ? defaultEntry
            : { cards: sortByLabel(value.filter(card => card.value !== -1)) }
        )
      ])
    });
  }

  onInputFocus = () => {
    this.setState({ hideTopicSelector: false });
  };

  onInputBlur = () => {
    this.setState({ hideTopicSelector: true });
  };

  render() {
    const {
      invalidEmails,
      invitationType,
      selectedHives,
      selectedGroups,
      selectedCards,
      allHivesFollow,
      allUsersFollow,
      hivesOptions,
      groupsOptions,
      cardsOptions,
      isLoadingHiveOptions,
      isLoadingGroupOptions,
      isLoadingTipsOptions
    } = this.state;

    let invalidEmailsContent;
    if (invalidEmails.length) {
      const invalidEmailsMsg = invalidEmails.join(', ');
      invalidEmailsContent = (
        <div className="invitation-emails-invalids">
          <strong>Invalid Emails: </strong> <span>{invalidEmailsMsg}</span>
        </div>
      );
    }

    const uploadCSV = (
      <label htmlFor="emails-CSV" className="btn btn-default ml15">
        <span>Upload CSV</span>
      </label>
    );

    const cards = selectedHives.map((hive, index) => {
      const id = hive.id;
      const topic = selectedCards.filter(topicCards => topicCards.id === id)[0];
      return (
        <div
          className="flex-r-center"
          style={{
            marginTop: 10,
            display: 'flex',
            alignItems: 'stretch'
          }}
          key={`input_cards_${index}`}
        >
          <label className="prefix">
            <span>{topic.title}</span>
          </label>

          <ReactSelectCustom
            className="flex-1"
            name="user-hives-value"
            value={topic.cards}
            isMulti
            options={getCardOptionsById(cardsOptions, topic.id)}
            isLoading={isLoadingTipsOptions === topic.id}
            onChange={value => this.handleCardsSelect(topic.id, value)}
            styles={{
              control: (provided, state) => ({
                ...provided,
                'border-top-left-radius': '0px',
                'border-bottom-left-radius': '0px',
                'border-left-color': 'transparent'
              })
            }}
            onFocus={() => this.handleFocusOnCards(topic.id)}
          />
        </div>
      );
    });

    return (
      <PageModal
        size="full"
        keyboard={false}
        onClose={() => this.props.setUserInvitationModalOpen(false)}
      >
        <div className="modal-body explore-modal-body users-invitation-body flex-c">
          <div className="flex-r-center-spacebetween p15 pl50 pr50">
            <h1 className="modal-title">Invite People</h1>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => this.props.setUserInvitationModalOpen(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form
            onSubmit={this.handleFormSubmit}
            className="flex-r-stretch users-invitation-form flex-1"
          >
            <section className="users-details flex-1">
              <div className="form-group invitation-emails-container">
                <div className="invitation-emails">
                  <input
                    type="text"
                    className="form-control"
                    name="invitation[emails]"
                    id="invitation_emails"
                    placeholder="Type or paste email addresses separated by commas"
                    required
                    tabIndex={1}
                    autoFocus
                  />
                  <div className="input-file-box">
                    <input
                      type="file"
                      id="emails-CSV"
                      accept=".csv"
                      onChange={event => this.handleFileChange(event)}
                    />
                    {uploadCSV}
                  </div>
                </div>
                {invalidEmailsContent}
              </div>

              <div className="form-group">
                <textarea
                  className="form-control"
                  name="invitation[message]"
                  id="invitation_message"
                  rows="10"
                  placeholder="Type your message"
                  tabIndex={2}
                />
              </div>

              <div className="form-group">
                <input
                  type="submit"
                  className="btn btn-default"
                  value={this.state.inviting ? 'SENDING' : 'SEND INVITE'}
                />
              </div>
            </section>

            {!tiphive.isPublicDomain() && (
              <section className="user-settings flex-1">
                <h4 style={{ fontSize: '20px' }}>User Settings</h4>
                <div className="user-roles mb15">
                  <label className="fw-xm">
                    What type of membership will the invited users have?
                  </label>
                  <div className="flex-c-center">
                    <div className="w100">
                      <ReactSelectCustom
                        className="flex-1"
                        name="user-roles-value"
                        value={{
                          value: invitationType,
                          label:
                            inflection.titleize(invitationType) === 'Domain'
                              ? 'Member'
                              : inflection.titleize(invitationType)
                        }}
                        options={userRoles}
                        onChange={this.handleUserRoles}
                        styles={{
                          menu: provided => ({ ...provided, zIndex: '1001' })
                        }}
                      />
                    </div>
                    {invitationType === 'guest' && (
                      <div>
                        <p className="role-suggestion p3">
                          A guest user will not be able to see any members,
                          team, yays or content in this Workspace that have not
                          been directly shared with them.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="user-hives">
                  <div className="flex-r-center-spacebetween">
                    <label className="fw-xm">Share yays with this user:</label>
                    <div className="custom-checkbox mt10">
                      <label>
                        <input
                          type="checkbox"
                          onChange={this.handleFollowAllHives}
                          checked={allHivesFollow}
                        />
                        <i className="input-helper" />
                        <span>Make invited users follow all yays</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex-c-center">
                    <TopicsListDropdown
                      additionalClasses="invite-form-dropdown-menu"
                      actionButtonLabel="Share selected yays"
                      actionButtonHandler={this.handleHivesSelect}
                      actionButtonClass="btn-primary"
                      path={null}
                      startAt={null}
                      hideHeader
                      inputMode="list"
                      disallowCreate
                      multiple={true}
                      hideAddTopicLink
                      hideTopicSelector={this.state.hideTopicSelector}
                      skipConfirmation
                      onInputBlur={this.onInputBlur}
                      onInputFocus={this.onInputFocus}
                      domain={this.props.domain}
                    />
                  </div>
                </div>
                {cards.length > 0 && (
                  <div className="user-tips">
                    <div className="flex-r-center-spacebetween">
                      <label className="fw-xm">
                        Invited users should follow these Cards (click to select
                        specific cards):
                      </label>
                    </div>
                    <div className="flex-c" style={{ marginTop: -10 }}>
                      {cards}
                    </div>
                  </div>
                )}
                <div className="user-groups">
                  <div className="flex-r-center-spacebetween">
                    <label className="fw-xm">
                      Add invited users to these teams:
                    </label>
                  </div>
                  <div className="flex-r-center">
                    <ReactSelectCustom
                      className="flex-1"
                      name="user-groups-value"
                      value={selectedGroups}
                      isMulti
                      onInputChange={this.handleGroupsInputChange}
                      options={groupsOptions}
                      isLoading={isLoadingGroupOptions}
                      onChange={this.handleGroupsSelect}
                      allowCreate={true}
                      onFocus={this.handleFocusOnGroups}
                    />
                  </div>
                </div>

                <div className="user-hives">
                  {invitationType === 'domain' && (
                    <div className="flex-r-center-spacebetween">
                      <label className="fw-xm">
                        Should invited users follow all members?
                      </label>
                      <div className="custom-checkbox mt10">
                        <label>
                          <input
                            type="checkbox"
                            defaultChecked={allUsersFollow}
                            onChange={this.handleFollowAllUsers}
                          />
                          <i className="input-helper" />
                          <span>Make invited users follow all members</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </form>
        </div>
      </PageModal>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    groupId: sm.page.groupId,
    userId: sm.user.id
  };
};

const mapDispatch = {
  setUserInvitationModalOpen
};

export default connect(
  mapState,
  mapDispatch
)(UsersInvitationPage);
