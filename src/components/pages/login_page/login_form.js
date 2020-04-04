import React from 'react';
import Alert from '../../shared/alert';
import Auth from '../../../lib/auth';
import createClass from 'create-react-class';

var LoginForm = createClass({
  getDefaultProps: function() {
    return {
      errors: []
    };
  },

  render: function() {
    const { isLoading } = this.props;
    let inputButton;
    if (isLoading) {
      inputButton = <input type="submit" className="btn btn-default btn-block text-center"  value="Sending..." disabled />;
    } else {
      inputButton = <input type="submit" name="submit" className="btn btn-default btn-block text-center" value="Login" />;
    }
    return (
      <form method="post" className="concise" action="#" onSubmit={this.props.handleSubmit}>
        {this.props.errors.length > 0 && <Alert type="danger"
                                                message="There are login errors:"
                                                errors={this.props.errors} />}
        <div className="form-group">
          <input type="email" name="user[email]" className="form-control" id="user_email" ref="user_email"
                 placeholder="Email address" defaultValue={Auth.getCookie('userEmail')} required />
        </div>

        <div className="form-group">
          <input type="password" name="user[password]" className="form-control" id="user_password" ref="user_password"
                 placeholder="Password" required />
        </div>

        <div className="form-group" style={{ marginTop: 20, width: 100 }}>
          {inputButton}
        </div>
      </form>
    );
  }
});

export default LoginForm;
