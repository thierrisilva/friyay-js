import get from 'lodash/get';

var Ability = {
  /*
   Determine if current user is allowed to do something.
   Params:
   - action: (string) create, update, destroy, like, comment
   - target: (string) self, topic, tip, question
   - object: (json object) topic, tip, question
   */
  can: function(action, target, object) {

    // can not check abilities if there is no object to check
    if ( !object || object.id == 0 || !get(object, 'relationships.abilities') ) { //MH added object.id == 0 check to use in stage
      return true;
    }

    var objectRelationships = object.relationships || {};
    // can not check if object doesn't have roles or ability to check
    if (!objectRelationships.masks || !objectRelationships.abilities) {
      return false;
    }

    if (window.isSubdomain && window.currentDomain) {
      // var domainRelationships = window.currentDomain.relationships;
      //
      // // can not check if domain doesn't have roles or ability to check
      // if (!objectRelationships.masks || !objectRelationships.abilities) {
      //   return false;
      // }
      //
      // var domainMasks = domainRelationships.masks.data;
      //
      // var isDomainOwner = domainMasks.is_owner;
      // var isDomainAdmin = domainMasks.is_admin;
      //
      // var isDomainOwnerOrAdmin = isDomainOwner === true || isDomainAdmin === true;
      //
      // if (isDomainOwnerOrAdmin) {
      //   return true;
      // }
      if ( get(window, 'currentDomain.relationships.masks.data.is_owner' ) || get(window, 'currentDomain.relationships.masks.data.is_admin' ) ) {
        return true;
      }
    }

    // var objectMasks     = objectRelationships.masks.data;
    // var objectAbilities = objectRelationships.abilities.data;
    var objectAbilities = get( object, 'relationships.abilities.data', {} );
    //
    // var isObjectOwner = objectMasks.is_owner;
    // var isObjectAdmin = objectMasks.is_admin;

    var isObjectOwner = get( object, 'relationships.masks.data.is_owner' );
    var isObjectAdmin = get( object, 'relationships.masks.data.is_admin' );

    var isObjectOwnerOrAdmin = isObjectOwner === true || isObjectAdmin === true;

    var isUpdateOrDestroy = ['update', 'destroy'].indexOf(action) > -1;

    if (target === 'self' && isUpdateOrDestroy && isObjectOwnerOrAdmin) {
      return true;
    }

    if (!objectAbilities[target]) {
      return false;
    }

    var hasPermission = objectAbilities[target]['can_' + action];
    return hasPermission;
  },

  cannot: function(action, target, object) {
    return !Ability.can(action, target, object);
  }
};

export default Ability;
