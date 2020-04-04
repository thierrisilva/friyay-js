import { normalize, schema } from 'normalizr';

const other = new schema.Entity('other');

const dbRecord = new schema.Entity('notifications')

const multiSchema = { data: { data: [dbRecord] }};

export const normalizeNotification = ( serverRecord ) => normalize(serverRecord.data.data, dbRecord).entities;
export const normalizeNotifications = ( serverRecords ) => normalize(serverRecords, multiSchema).entities;
