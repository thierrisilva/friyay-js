/* global appEnv */
import get from 'lodash/get';
import set from 'lodash/set';
import { mapLabelsByKind } from 'Src/newRedux/database/labels/selectors';
import { stateMappings } from 'Src/newRedux/stateMappings';

//function to detect click or dblclick and use corresponding method
export const getClickHandler = (onClick, onDblClick, delay) => {
  let timeoutID = null;
  delay = delay || 250;
  return event => {
    if (!timeoutID) {
      timeoutID = setTimeout(function() {
        onClick(event);
        timeoutID = null;
      }, delay);
    } else {
      timeoutID = clearTimeout(timeoutID);
      onDblClick(event);
    }
  };
};

//runs an array of items through multiple filters and returns the results:
export const applyFilters = (arrayOrObject, filters, passAllFilters) => {
  const array = Array.isArray(arrayOrObject)
    ? arrayOrObject
    : Object.values(arrayOrObject);
  return filters.length > 0
    ? passAllFilters
      ? array.filter(item => filters.every(filter => filter(item)))
      : array.filter(item => filters.some(filter => filter(item)))
    : array;
};

//used by page components to build out the card requirements they pass down to their views
export const buildCardRequirements = (cardRequirements = {}, state) => {
  const sm = stateMappings(state);
  const includeArchivedCards = sm.filters.includeArchivedCards;
  if (includeArchivedCards) {
    cardRequirements.labelId = getArchivedLabelId(state);
  }
  return cardRequirements;
};

//modifies relationship data to suit the server when POST or PATCHing records:
export const buildToOneRelationshipData = (type, id, extras) => {
  return id ? { data: { id, type, ...extras } } : '';
};

//modifies relationship data to suit the server when POST or PATCHing records:
export const buildToManyRelationshipData = (type, relationship, extras) => {
  const relationships = relationship.map(relId => ({
    id: relId,
    type: type,
    ...extras
  }));
  return relationships.length > 0 ? { data: relationships } : '';
};

//creates a cancellable promise (for cancelling on unmounts. see: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html)
export const cancellablePromise = promise => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
};

//gets the current domain from the url:
export const getThisDomain = domains =>
  domains.find(
    dom =>
      dom.attributes.tenant_name == window.location.host.split('.')[0] &&
      dom.relationships
  ) || domains[0];

//gets the URL for a domain, based on environment:
export const getDomainUrl = domain =>
  window.appEnv == 'development'
    ? `//${domain.attributes.tenant_name}.${window.APP_DOMAIN}:5000`
    : window.appEnv == 'staging'
    ? `https://${domain.attributes.tenant_name}.staging.tiphive.com`
    : `https://${domain.attributes.tenant_name}.${window.APP_DOMAIN}`;

//returns the id for the 'archived' label:
export const getArchivedLabelId = state => {
  const systemLabels = mapLabelsByKind(state)['system'];
  const archiveLabel = systemLabels.find(
    label => label.attributes.name.toLowerCase() == 'archived'
  );
  return archiveLabel.id;
};

//gets an id from a slug:
export const idFromSlug = slug => (slug ? slug.split('-')[0] : null);

//pass it a normalized record you wish to update but cant use lodash/merge:
export const overwriteRecordWithAttributesAndRelationships = ({
  existingRecord,
  attributes,
  relationships
}) => ({
  ...existingRecord,
  attributes: {
    ...existingRecord.attributes,
    ...attributes
  },
  relationships: {
    ...existingRecord.relationships,
    ...relationships
  }
});

//parses attachments.json into data used for the FileUploadBox:
export const parseAttachmentsJson = attachmentsJson => {
  const images = attachmentsJson.images || [];
  const docs = attachmentsJson.documents || [];

  return [
    ...images.map(file => ({
      response: {
        data: {
          id: file.id,
          type: 'images',
          attributes: file
        }
      },
      localData: {
        preview: null
      }
    })),
    ...docs.map(file => ({
      response: {
        data: {
          id: file.id,
          type: 'images',
          attributes: file
        }
      },
      localData: {
        preview: null
      }
    }))
  ];
};

//converts an array of key/values to an object with the keys as keys:
export const reduceArrayToObjectWithKeyAndValuePair = (array, key, value) => {
  const setUpReducer = (key, value) => (obj, next) => {
    const keyAtt = next[key];
    const keyVal = next[value];
    obj[keyAtt] = keyVal;
    return obj;
  };

  const reduceWithKey = setUpReducer(key, value);
  return array.reduce(reduceWithKey, {});
};

export const reduceArrayToMappedObjectForAttribute = (
  array,
  attribute,
  defaultAttributeValue = '0'
) =>
  array.reduce((a, b) => {
    const key = get(b, attribute, defaultAttributeValue);
    set(a, key, [...get(a, key, []), b]);
    return a;
  }, {});

//for moving an array of items back to an object keyed by Id:
export const reNormalizeArrayOfRecords = array =>
  array.reduce((a, b) => {
    a[b.id] = b;
    return a;
  }, {});

//get the before and after cardIds to determine card order, from the itemOrder returned at drag and drop:
export const returnBeforeAndAfterCardIdsFromItemOrder = (
  movedCardId,
  itemOrder
) => {
  const mappedItemOrder = itemOrder.map(item => item.id);
  const indexOfMovedCardInItemOrder = mappedItemOrder.indexOf(movedCardId);
  const beforeCardId = mappedItemOrder[indexOfMovedCardInItemOrder + 1];
  const afterCardId = beforeCardId
    ? null
    : mappedItemOrder[indexOfMovedCardInItemOrder - 1];
  return { afterCardId, beforeCardId };
};

//for toggles that may or may not receive a bool as an arg.  Pass the bool and the current val, get back the bool or the opposite of the current val
export const returnToggleValOrBool = (bool, currentVal) =>
  bool == undefined ? !currentVal : bool;

//make a copy of a record and update particular attributes
export const returnRecordWithNewAttributes = ({
  record = {},
  attributes = [],
  values = []
}) => {
  const replacementRecord = { ...record };
  attributes.forEach((attr, index) => {
    set(replacementRecord, attr, values[index]);
  });
  return replacementRecord;
};

//make a copy of a record and replace a value in an array attribute/relationship.  Good for changing one Id in a list
export const returnRecordWithRemovedOrReplacedValueInArrayForAttribute = ({
  record = {},
  attributePath = '',
  oldValue,
  newValue,
  isArrayAttrubuteValue = true
}) => {
  const replacementRecord = { ...record };
  const attributeValue = get(replacementRecord, attributePath);
  const currentArray = isArrayAttrubuteValue
    ? attributeValue || []
    : attributeValue
    ? [attributeValue]
    : [];
  const newArray = currentArray.filter(item => item != oldValue);
  newValue && newArray.push(newValue);
  set(replacementRecord, attributePath, newArray);
  return replacementRecord;
};

//sorts an array of records alphabetically on a particular attribute
export const sortAlpha = (array, attribute) =>
  array.sort((a, b) => {
    const stringA = (get(a, `attributes.${attribute}`, '') || '').toLowerCase();
    const stringB = (get(b, `attributes.${attribute}`, '') || '').toLowerCase();
    return stringA.localeCompare(stringB);
  });

//sorts an array of records alphabetically on a particular attribute
export const sortAnythingAlpha = (array, attribute) =>
  array.sort((a, b) => {
    const stringA = (get(a, attribute, '') || '').toLowerCase();
    const stringB = (get(b, attribute, '') || '').toLowerCase();
    return stringA.localeCompare(stringB);
  });

//create a delay
export const timeout = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

//pass an item an an array - if the item is in the array, get back an array without it, if not, get back an array with it
export const toggleItemInclusionInArray = (item, array) => {
  return array.includes(item)
    ? array.filter(arrayItem => arrayItem != item)
    : [...array, item];
};

export const getRedirectUriForSlack = () => {
  const includePort =
    window.appEnv === 'development' && window.APP_PORT
      ? ':' + window.APP_PORT
      : '';
  // const staging = window.appEnv == 'staging' ? 'staging.' : '';
  return `${window.currentProtocol}://${
    window.APP_HOST
  }${includePort}/slack/auth`;
};

export const mapRelationship = (
  cardDatum,
  included,
  relation,
  includedType
) => {
  const relationships = [];
  for (let item of cardDatum.relationships[relation].data) {
    const includedItem = included.find(
      includedRelation =>
        includedRelation.id === item.id &&
        includedRelation.type === (includedType || relation)
    );
    if (includedItem) {
      relationships.push({
        ...includedItem.attributes,
        id: item.id,
        type: relation
      });
    }
  }
  return relationships;
};

export const scrollToShow = (elem, fontStart, fontEnd) => {
  elem.scrollIntoView({ block: 'end', behavior: 'smooth' });
  const id = setInterval(() => {
    let fontSize = parseInt(elem.style.fontSize);
    fontSize = isNaN(fontSize) ? fontStart : fontSize;
    if (fontSize < fontEnd) {
      elem.style.fontSize = fontSize + 1 + 'px';
    } else {
      clearInterval(id);
      const id2 = setInterval(() => {
        const fontSize = parseInt(elem.style.fontSize);
        if (fontSize > fontStart) {
          elem.style.fontSize = fontSize - 1 + 'px';
        } else {
          clearInterval(id2);
        }
      }, 100);
    }
  }, 100);
};

export function getSidePaneArrowTop(ref) {
  if (ref.current) {
    const top = ref.current.getBoundingClientRect().top + 20;
    return `${top}px`;
  }
  return '';
}

export function getSidePaneArrowLeft(isOpen) {
  return isOpen ? 270 : 2;
}

export function yayDesign(topicId, topic) {
  let active_design;
  if (topic) {
    const currentDesign = topic.attributes.topic_design_id_for_current_user;
    const topic_designs = get(topic, 'attributes.topic_designs', []);
    active_design = topic_designs.find(
      d => Number(d.id) === Number(currentDesign)
    );
    if (!active_design && topic.attributes.default_design_id) {
      active_design = topic_designs.find(
        d => Number(d.id) === Number(topic.attributes.default_design_id)
      );
    }
  }
  return active_design || {};
}
