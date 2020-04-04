import { is, ifElse, compose, length, map, filter, assoc } from 'ramda';

const returnNull = () => null;
const isArray = is(Array);
const assocIdentity = identity => assoc('data', identity, {});
const nullIfEmpty = ifElse(length, assocIdentity, () =>
  assoc('data', null, {})
);

const placeholderIfEmpty = placeholder =>
  ifElse(length, assocIdentity, () => assoc('data', placeholder, {}));
  
const labelIfEmpty = placeholderIfEmpty([{ id: '', type: 'labels' }]);
const labelCategoryIfEmpty = placeholderIfEmpty([]);
const attachIfEmpty = placeholderIfEmpty([{ id: '', type: 'attachments' }]);
const arrayIfEmpty = placeholderIfEmpty([]);

const splitId = id => id.split('-');
const mapIdSplit = ([type, id]) => ({ id, type });

const getTopicData = compose(arrayIfEmpty, map(id => ({ id, type: 'topics' })));
const getLabelCategoryData = compose(labelCategoryIfEmpty, map(id => ({ id, type: 'label_categories' })));
const getLabelData = compose(labelIfEmpty, map(id => ({ id, type: 'labels' })));
const getGroupData = compose(
  nullIfEmpty,
  map(mapIdSplit),
  filter(([type]) => type === 'groups'),
  map(splitId)
);
const getUsersData = compose(
  nullIfEmpty,
  map(mapIdSplit),
  filter(([type]) => type === 'users' || type === 'emails'),
  map(splitId)
);
// const getAdminData = compose(
//   arrayIfEmpty,
//   map(id => ({ name: 'admin', user_id: id })),
//   filter(([type]) => type === 'users'),
//   map(splitId)
// );
const getAttachData = compose(
  attachIfEmpty,
  map(id => ({ id, type: 'attachments' }))
);

export const buildTopicData = ifElse(isArray, getTopicData, returnNull);
export const buildLabelData = ifElse(isArray, getLabelData, returnNull);
export const buildLabelCategoryData = ifElse(isArray, getLabelCategoryData ,returnNull);
export const buildUserData = ifElse(isArray, getUsersData, returnNull);
export const buildGroupData = ifElse(isArray, getGroupData, returnNull);
// export const buildAdminRolesData = ifElse(isArray, getAdminData, returnNull);
export const buildAttachmentsData = ifElse(isArray, getAttachData, returnNull);

export const buildAdminRolesData = (adminUserIDs) => {
  if (adminUserIDs) {
    const adminRolesData = [];
    adminUserIDs.forEach(userID => {
      const itemData = userID.split('-');
      if (itemData[0] !== 'users') {
        // next item
        return true;
      }
      adminRolesData.push({name: 'admin', user_id: itemData[1]});
    });

    return { data: adminRolesData };
  }
  return null;
}