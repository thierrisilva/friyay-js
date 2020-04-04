import { getPeople, getPerson } from 'Src/newRedux/database/people/thunks';

const dmRequirements = {
  people: {
    action: ({ }) => [ getPeople, {}],
    key: ({ }) => `people`,
    test: ({ callHistory }) => callHistory && callHistory.lastCall >= moment().unix() - 600,
  },
  person: {
    action: ({ personId }) => [ getPerson, { personId: personId }],
    key: ({ personId }) => `person-${ personId }`,
    test: ({ callHistory }) => callHistory && callHistory.lastCall >= moment().unix() - 600
  },
}

export default dmRequirements;
