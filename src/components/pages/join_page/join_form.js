import React, { Component } from 'react';

import Alert from '../../shared/alert';
import { Input } from '../../shared/forms';

class JoinForm extends Component{
  constructor(props) {
    super(props);

    this.state = {
      submitValue: 'Create User',
      submitDisabled: false
    };
  }

  render() {
    const { isLoading } = this.props;
    let createButton;
    if (isLoading) {
      createButton = <button type="submit"
                             className="btn btn-block btn-color-1" disabled>
                       Creating...
                       <i className="fa fa-long-arrow-right pull-right"></i>
                     </button>;
    } else {
      createButton = <button type="submit"
                             className="btn btn-block btn-color-1"
                             value='Create user'>
                        Create User
                        <i className="fa fa-long-arrow-right pull-right"></i>
                     </button>;
    }

    return (
      <div className="row">
        <div className="col-sm-12 col-xxlg-6 col-xxlg-offset-3 concise">
          <form method="post" onSubmit={this.props.handleSubmit}>
            {this.props.errors.length > 0 && <Alert type="danger"
                                                    message="There are errors that prevents this form from being submitted:"
                                                    errors={this.props.errors} />}
            <input type="file" name="user[avatar]" className="hidden" />

            <div className="form-group">
              <Input type="text" id="user_first_name" name="user[first_name]"
                     className="form-control"
                     placeholder="First name"
                     tabIndex={1}
                     required />
            </div>

            <div className="form-group">
              <Input type="text" id="user_last_name" name="user[last_name]"
                     className="form-control"
                     placeholder="Last name"
                     tabIndex={2}
                     required />
            </div>

            <div className="form-group">
              <Input type="email" id="user_email" name="user[email]"
                     className="form-control"
                     placeholder="Email address"
                     tabIndex={3}
                     required />
            </div>

            <div className="form-group">
              <Input type="password" id="user_password" name="user[password]"
                     className="form-control"
                     placeholder="Password"
                     tabIndex={4}
                     required />
            </div>

            <div className="form-group">
              <Input type="password" id="user_password_confirmation" name="user[password_confirmation]"
                     className="form-control"
                     placeholder="Confirm password"
                     tabIndex={5}
                     required />
            </div>

            <div className="form-group">
              {createButton}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default JoinForm;
