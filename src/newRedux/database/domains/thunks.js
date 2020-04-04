import { addDomains, domainUpdate } from './actions';
import analytics from 'Src/lib/analytics';
import { fetchDomains, postDomain, archiveHive, deleteHive } from './apiCalls';
import { logRollBarError } from 'Lib/rollbar';
import { normalizeDomain, normalizeDomains } from './schema';
import { success, failure } from 'Utils/toast';
import { stateMappings } from 'Src/newRedux/stateMappings';

export const createDomain = ({ attributes = {}, relationships = {} }) => async( dispatch, getState ) => {
  try {
    const newServerDomain = await postDomain({ attributes, relationships });
    const normalizedDomain = normalizeDomain( newServerDomain ).domains;
    dispatch( addDomains( normalizedDomain ));
    analytics.track('Workspace(Domain) Created', {
      id: newServerDomain.data.data.id,
      name: newServerDomain.data.data.attributes.name,
    });
    success('New Workspace created!');
    return newServerDomain;

  } catch (error) {
    failure('Unable to save new Workspace');
    logRollBarError( error, 'warning', 'Create Workspace Error' );
    return null;
  }
};

export const getDomains = () => async(dispatch, getState) => {
  try {
    const domainsData = await fetchDomains();
    dispatch( addDomains( normalizeDomains( domainsData ).domains ) );

    if ( window.location.port == 5000 ) {
      dispatch( addDomains( stageDomain ));
    } else {
      dispatch( addDomains( personalWorkspace ));
    }

  } catch (error) {
    failure('Unable to load domains');
  }
};

export const updateDomain = (updatedDomain) => {
  return (dispatch, getState) => {
    const sm = stateMappings(getState());
    const { domains } = sm;
    const currentDomain = domains[updatedDomain.data.id];
    // Copy, prevent Redux state mutation 
    const domainsCopy = Object.assign(
      {},
      domains,
      { [updatedDomain.data.id]: {
        attributes: {
          ...currentDomain.attributes,
          ...updatedDomain.data.attributes,
        },
        id: currentDomain.id,
        type: currentDomain.type,
        relationships: currentDomain.relationships
      } 
    });

    dispatch(domainUpdate(domainsCopy));
  }
}

export const archiveDomain = (domain) => {
  return async (dispatch, getState) => {
    try {
      await archiveHive(domain);
      
    } catch (err) {
      console.error(err);
    }
  }
}

export const deleteDomain = (domain) => {
  return async (dispatch, getState) => {
    try {
      await deleteHive(domain);
      const url = window.APP_ENV === 'development'
        ? `http://${window.APP_DOMAIN}:${window.APP_PORT}`
        : `http://${window.APP_DOMAIN}`;

      location.assign(`${url}/choose_domain`);
    } catch (err) {
      failure( 'There was a problem deleting this hive, please try again later' );
      console.error(err);
    }
  }
}

const stageDomain = {
  '0': {
    id: '0',
    type: 'domains',
    attributes: {
      name: 'Personal Workspace',
      tenant_name: 'staging'
    }
  }
}

const personalWorkspace = {
  '0': {
    id: '0',
    type: 'domains',
    attributes: {
      name: 'Personal Workspace',
      tenant_name: 'my'
    }
  }
}
