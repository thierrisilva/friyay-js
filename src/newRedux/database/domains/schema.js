import { normalize, schema } from 'normalizr';

const domain = new schema.Entity('domains');
const domainsSchema = { data: { data: [domain] }};

export const normalizeDomains = ( serverDomainRecords ) => normalize(serverDomainRecords, domainsSchema).entities;
export const normalizeDomain = ( serverRecord ) => normalize( serverRecord.data.data, domain).entities;
