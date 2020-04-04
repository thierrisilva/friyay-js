import React from 'react';
import { Link } from 'react-router-dom';
import createClass from 'create-react-class';
import APIRequest from '../../../lib/ApiRequest';

var IntroInviteFriendsContent = createClass({
  componentDidMount: function() {
    $('#invitation_emails').selectize({
      plugins: ['remove_button'],
      delimiter: ',',
      persist: false,
      create: function(input) {
        return {
          value: input,
          text: input
        };
      }
    });
  },

  handleFormSubmit: function(e) {
    e.preventDefault();
    var $invitationForm = $(e.target);

    var invitationEmails = $('#invitation_emails')
      .val()
      .trim();
    var invitationMessage = $('#invitation_message')
      .val()
      .trim();

    var $invitationXHR = APIRequest.post({
      resource: 'invitations',
      data: {
        data: {
          emails: invitationEmails.split(','),
          custom_message: invitationMessage,
          invitation_type: 'account',
          invitable_type: 'User',
          invitable_id: window.currentUser.id
        }
      }
    });

    $invitationXHR
      .done(function(response, status, xhr) {
        APIRequest.showSuccessMessage('Invitation sent');
        var $selectizedEmails = $('#invitation_emails').selectize();
        $selectizedEmails[0].selectize.clearOptions();
        $('#invitation_emails').val('');
        $('#invitation_message').val('');
      })
      .fail(function(xhr, status, error) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail);
      });
  },

  render: function() {
    var nextSectionLink;
    if (window.isSubdomain) {
      nextSectionLink = (
        <Link to="/" className="btn btn-default btn-next">
          &#8594;
        </Link>
      );
    } else {
      nextSectionLink = (
        <Link
          to="/introduction/explore_people"
          className="btn btn-default btn-next"
        >
          &#8594;
        </Link>
      );
    }

    return (
      <div className="intro-content intro-invite-friends">
        <div className="row">
          <div className="col-sm-12">
            <h1 className="intro-heading">
              Who can help you build these yays?
              <span className="pull-right">{nextSectionLink}</span>
            </h1>
          </div>

          <div className="col-sm-6 col-sm-offset-3">
            <form onSubmit={this.handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="invitation_emails">
                  Type email addresses of people you want to invite
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="invitation[emails]"
                  id="invitation_emails"
                  placeholder="Email addresses"
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  className="form-control"
                  name="invitation[message]"
                  id="invitation_message"
                  rows="10"
                  placeholder="Type personal message"
                />
              </div>

              <div className="form-group">
                <input
                  type="submit"
                  className="btn btn-default"
                  value="SEND INVITE"
                  data-disable-with="SENDING..."
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

export default IntroInviteFriendsContent;
