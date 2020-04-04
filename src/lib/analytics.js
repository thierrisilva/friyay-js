
import get from 'lodash/get';
import mixpanel from 'mixpanel-browser';

var analytics = {
  /*
   Call this method in componentDidMount of related component we want to track.

   componentDidMount: function() {
     analytics.track('event name', {});
   }

   We have window.currentUser and currentDomain.

   currentUser: {
     id:        Cookies.get('userID'),
     email:     Cookies.get('userEmail'),
     firstName: Cookies.get('userFirstName'),
     lastName:  Cookies.get('userLastName')
   }

   */

  init: () => {
    if ( window.APP_ENV == 'production') {
      mixpanel.init("8829de30cc33e909b2a049961e45a98b")
    }
  },

  track: function(name, options) {
    if (window.APP_ENV !== 'production') return;

    if (typeof options === 'undefined') {
      options = { domain: document.domain };
    } else {
      options.domain = document.domain;
    }

    if (mixpanel) {
      mixpanel.track(name, options);
    }
    // google analytics could be added here
  },

  identify: function(userParams) {
    if (window.APP_ENV !== 'production') return;

    if (mixpanel) {
      mixpanel.identify(userParams.id);
      mixpanel.people.set({
        '$first_name': userParams.firstName,
        '$last_name': userParams.lastName,
        '$email': userParams.email
      });
    }


  },

  alias: function(userParams) {
    if (window.APP_ENV !== 'production') return;

    if (mixpanel) {
    // SHOULD ONLY BE CALLED ONCE, AND CURRENTLY IS CALLED IN join_page.jsx
      mixpanel.alias(userParams.id);
      mixpanel.people.set({
        '$first_name': userParams.firstName,
        '$last_name': userParams.lastName,
        '$email': userParams.email
      });
    }
  }
};

export default analytics;

//creates a user object for mixPanel from the user record in redux:
export const createUserForMixpanelFromReduxUser = ({ id, attributes = {} }) => ({
  id: id,
  firstName: get( attributes, 'first_name' ),
  lastName: get( attributes, 'last_name' ),
  email: get( attributes, 'email' )
})
