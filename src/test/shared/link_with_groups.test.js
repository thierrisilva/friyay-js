import React from 'react';
import LinkWithGroups from '../../components/shared/link_with_groups';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

test('Check LinkWithGroups component url props with or without "/" and without group', () => {
  const linkWithGroups = shallow(
    <LinkWithGroups url="/users/123" groupID="123" />
  );

  const linkWithGroupsWithoutSlash = shallow(
    <LinkWithGroups url="users/321" groupID="123" />
  );

  const linkWithGroupsWithoutGroups = shallow(
    <LinkWithGroups url="users/321" />
  );
  expect(linkWithGroups.props().to).toEqual('/groups/123/users/123');
  expect(linkWithGroupsWithoutSlash.props().to).toEqual('/groups/123/users/321');
  expect(linkWithGroupsWithoutGroups.props().to).toEqual('/users/321');

});
