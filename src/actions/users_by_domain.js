import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from 'Lib/ApiRequest';

export function getUsersByDomain(domainId) {
  APIRequest.get({
    resource: 'users?include=user_profile&filter[users]=all',
    data: {
      page: {
        size: 999
      }
    }
  }).then(({ data, included }) => {
    const users = data.map(user => {
      const profileId = user.relationships.user_profile.data.id;
      const profile = included.find(profile => profile.id === profileId);

      return {
        name: user.attributes.name,
        current_role: user.attributes.current_domain_role,
        id: user.id,
        avatar_url: profile.attributes.avatar_url
      };
    });

    AppDispatcher.dispatch({
      actionType: 'ALL_USERS',
      users
    });
  });
}

export function getUserRoles() {
  APIRequest.get({ resource: 'domain_roles' }).then(({ data }) => {
    AppDispatcher.dispatch({
      actionType: 'ALL_ROLES',
      roles: data
    });
  });
}

export function updateRole(userId, role) {
  APIRequest.patch({
    resource: `users/${userId}/domain_roles`,
    data: {
      data: { role }
    }
  }).then(
    ({ data }) => {
      AppDispatcher.dispatch({
        actionType: 'UPDATE_ROLE',
        role,
        userId
      });
      APIRequest.showSuccessMessage('User role updated');
    },
    () => APIRequest.showErrorMessage('Could not update user role')
  );
}

export function removeMember(userId, name) {
  APIRequest.post({
    resource: `domains/remove_user/${userId}`
  }).then(
    () => {
      AppDispatcher.dispatch({
        actionType: 'REMOVE_MEMBER',
        userId
      });
      APIRequest.showSuccessMessage(`Member ${name} removed from workspace`);
    },
    () => {
      APIRequest.showErrorMessage('Could not remove member from workspace');
      AppDispatcher.dispatch({
        actionType: 'REMOVE_MEMBER_FAIL'
      });
    }
  );
}
