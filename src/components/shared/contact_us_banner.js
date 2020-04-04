import React from 'react';
import PropTypes from 'prop-types';

const ContactUsBanner = ({email, msg}) => {
  const mailToUrl = `mailto:${email}`;

  return (
    <div className="row">
      <div className="col-sm-12 contact-us-banner">
        <h4>
          Please <a href={mailToUrl}>contact us</a> {msg}
        </h4>
      </div>
    </div>
  );
};

ContactUsBanner.propTypes = {
  email: PropTypes.string,
  msg: PropTypes.string
};

export default ContactUsBanner;
