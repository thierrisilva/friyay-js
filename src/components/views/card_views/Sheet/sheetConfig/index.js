import actualWork from './actualWork';
import completion from './completion';
import completionDate from './completionDate';
import confidenceRange from './confidenceRange';
import creationDate from './creationDate';
import dueDate from './dueDate';
import estimatedWork from './estimatedWork';
import expectedCompletionDate from './expectedCompletionDate';
import priority from './priority';
import startDate from './startDate';
import variance from './variance';
import yays from './yays';
import labels from './labels';
import assignee from './assignee';
import cardBody from './cardBody';
import files from './files';
import links from './links';
import images from './images';

export const columns = {
  actual_work: 'actual_work',
  completion: 'completion',
  completion_date: 'completion_date',
  confidence_range: 'confidence_range',
  creation_date: 'creation_date',
  due_date: 'due_date',
  estimated_work: 'estimated_work',
  expected_completion_date: 'expected_completion_date',
  priority: 'priority',
  start_date: 'start_date',
  variance: 'variance',
  yays: 'yays',
  labels: 'labels',
  assignee: 'assignee',
  card_body: 'card_body',
  files: 'files',
  links: 'links',
  images: 'images'
};

export const sheetConfig = {
  default: {
    cssModifier: null,
    display: null,
    render: () => null,
    renderSummary: () => null
  },
  [columns.actual_work]: actualWork,
  [columns.completion]: completion,
  [columns.completion_date]: completionDate,
  [columns.confidence_range]: confidenceRange,
  [columns.creation_date]: creationDate,
  [columns.due_date]: dueDate,
  [columns.estimated_work]: estimatedWork,
  [columns.expected_completion_date]: expectedCompletionDate,
  [columns.priority]: priority,
  [columns.start_date]: startDate,
  [columns.variance]: variance,
  [columns.yays]: yays,
  [columns.labels]: labels,
  [columns.assignee]: assignee,
  [columns.card_body]: cardBody,
  [columns.files]: files,
  [columns.links]: links,
  [columns.images]: images
};
