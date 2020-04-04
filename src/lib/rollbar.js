/* global appEnv, Rollbar */

export const logRollBarError = ( error, errorLevel, message = '' ) => {
  if ( appEnv == 'production' ) {
    switch( errorLevel ) {
      case 'critical':
        return Rollbar.critical( message, error );
      case 'warning':
        return Rollbar.warning( message, error );
      case 'info':
        return Rollbar.info( message, error );
      case 'debug':
        return Rollbar.debug( message, error );
      default:
        return Rollbar.error( message, error );
    }
  }
};

export const setRollbarUser = ( user ) => {
  
  if ( appEnv == 'production' && !!user && !!user.attributes ) {
    Rollbar.configure({
      payload: {
        person: {
          id: user.id,
          username: user.attributes.name,
          email: user.attributes.email
        }
      }
    });
  }
}
