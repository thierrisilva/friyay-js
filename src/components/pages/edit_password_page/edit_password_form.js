import React from 'react';
import Alert from '../../shared/alert';
import createClass from 'create-react-class';

var EditPasswordForm = createClass({
  render: function() {
    return (
      <form method="post" onSubmit={this.props.handleSubmit}>
        {this.props.errors.length > 0 && <Alert type="danger"
                                                message="There are errors:"
                                                errors={this.props.errors} />}
        <div className="form-group">
          <input type="password" name="user[password]" className="form-control" id="user_password" ref="userPassword"
                 placeholder="Enter new password" required />
        </div>

        <div className="form-group">
          <input type="password" name="user[password_confirmation]" className="form-control"
                 id="user_password_confirmation" ref="userPasswordConfirmation"
                 placeholder="Confirm new password" required />
        </div>

        <div className="form-group">
          <input type="submit" name="submit" className="btn btn-default btn-lg" data-disable-with="Sending..."
                 value="Reset" />
        </div>
      </form>
    );
  }
});

export default EditPasswordForm;
