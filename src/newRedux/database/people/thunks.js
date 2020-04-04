import { normalizePerson, normalizePeople } from './schema';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { fetchPeople, fetchPerson, postActionOnPerson } from './apiCalls';
import { addPeople, mergeProfiles } from './actions';
// import { addUserProfiles } from '../userProfiles/actions';
import { changeUser } from 'Src/newRedux/database/user/actions';
import { success, failure } from 'Utils/toast';


export const getPeople = () => async(dispatch, getState) => {

  try {
    const peopleData = await fetchPeople();
    const normalizedResponse = normalizePeople( peopleData );

    dispatch( addPeople( normalizedResponse.people ));
    dispatch( mergeProfiles( normalizedResponse.userProfiles ));
    return peopleData;

  } catch (error) {
    failure('Unable to load people');
    return null;
  }
};

const mapProfile = personData => ({
  ...personData.data.data.attributes,
  relationships: {
    ...personData.data.data.relationships,
    user_profile: {
      data: personData.data.included.find(
        included =>
          included.id === personData.data.data.relationships.user_profile.data.id && included.type === 'user_profiles'
      )
    }
  }
});

export const getPerson = ({ personId }) => async(dispatch, getState) => {
  if(!personId) return null;
  try {
    const personData = await fetchPerson( personId );
    const normalizedPersonData = normalizePerson( { data: { data: mapProfile(personData) } } );
    dispatch( addPeople( normalizedPersonData.person ));
    return personData;

  } catch (error) {
    failure('Unable to load person');
    return null;
  }
};


export const toggleFollowUser = ( userId, follow ) => async(dispatch, getState) => {

  const userFollowings = stateMappings( getState() ).user.relationships.following_users.data;
  const revisedUserFollowings = follow
    ? [ ...userFollowings, userId ]
    : userFollowings.filter( id => id != userId );

  dispatch( changeUser({ relationships: { following_users: { data: revisedUserFollowings } } }) );

  try {
    const personData = await postActionOnPerson( userId, follow ? 'follow' : 'unfollow' );
    return personData;

  } catch (error) {
    failure('Unable to load person');
    return null;
  }
};


export const viewPerson = ( personId ) => (dispatch, getState) => {
  const sm = stateMappings( getState() );
  const history = sm.routing.routerHistory;
  const rootUrl = sm.page.rootUrl;
  const baseUrl = rootUrl == '/' ? rootUrl : rootUrl + '/';
  history.push( `${baseUrl}users/${ personId }` );
}
