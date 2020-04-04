import React from 'react';
import createClass from 'create-react-class';
import Alert from '../../shared/alert';

var ForgotPasswordForm = createClass({
  render: function() {
    return (
      <form method="post" onSubmit={this.props.handleSubmit}>
        {this.props.errors.length > 0 && <Alert type="danger"
                                                message="There are errors:"
                                                errors={this.props.errors} />}
        <div className="form-group">
          <input type="email" name="user[email]" className="form-control" id="user_email" ref="userEmail"
                 placeholder="Email address" required />
        </div>

        <div className="form-group">
          <input type="submit" name="submit" className="btn btn-default btn-lg" data-disable-with="Sending..."
                 value="Send password reset instructions" />
        </div>
      </form>
    );
  }
});

export default ForgotPasswordForm;
