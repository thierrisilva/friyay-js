export const Views = {
  GeneralPurpose: 'General Purpose',
  Project: 'Project',
  KnowledgeBase: 'Knowledge Base',
  FileSharing: 'File Sharing',
  NoteTaking: 'Note Taking',
  TaskList: 'Task List',
  Database: 'Database'
};

export const cardSample = {
  [Views.GeneralPurpose]: [
    { id: 1, title: 'Briefings', type: 'tips', children: [] },
    { id: 2, title: 'Roadmap planning', type: 'tips', children: [] },
    {
      id: 3,
      title: 'Team message board',
      type: 'topics',
      children: [
        { id: 31, title: 'Message1', type: 'tips', children: [], parent: 3 },
        { id: 32, title: 'Message2', type: 'topics', children: [], parent: 3 }
      ]
    }
  ],
  [Views.Project]: [
    {
      id: 1,
      title: 'Briefings',
      type: 'topics',
      children: [
        {
          id: 11,
          title: 'Briefing card',
          type: 'tips',
          children: [],
          parent: 1
        },
        {
          id: 12,
          title: 'Briefing card',
          type: 'tips',
          children: [],
          parent: 1
        }
      ]
    },
    {
      id: 2,
      title: 'Meeting notes',
      type: 'topics',
      children: [
        {
          id: 21,
          title: 'Meeting notes',
          type: 'tips',
          children: [],
          parent: 2
        },
        {
          id: 22,
          title: 'Meeting notes',
          type: 'tips',
          children: [],
          parent: 2
        }
      ]
    },
    {
      id: 3,
      title: 'Tasks',
      type: 'topics',
      children: [
        { id: 31, title: 'Task card', type: 'tips', children: [], parent: 3 },
        { id: 32, title: 'Task card', type: 'tips', children: [], parent: 3 }
      ]
    },
    {
      id: 4,
      title: 'Files',
      type: 'topics',
      children: [
        { id: 41, title: 'File card', type: 'tips', children: [], parent: 4 },
        { id: 42, title: 'File card', type: 'tips', children: [], parent: 4 }
      ]
    },
    {
      id: 5,
      title: 'Project knowledge',
      type: 'topics',
      children: [
        {
          id: 51,
          title: 'Knowledge card',
          type: 'tips',
          children: [],
          parent: 5
        },
        {
          id: 52,
          title: 'Knowledge card',
          type: 'tips',
          children: [],
          parent: 5
        }
      ]
    },
    {
      id: 6,
      title: 'Message board',
      type: 'topics',
      children: [
        { id: 61, title: 'Message', type: 'tips', children: [], parent: 6 },
        { id: 62, title: 'Message', type: 'tips', children: [], parent: 6 }
      ]
    },
    {
      id: 7,
      title: 'Ideas',
      type: 'topics',
      children: [
        { id: 71, title: 'Idea card', type: 'tips', children: [], parent: 7 },
        { id: 72, title: 'Idea card', type: 'tips', children: [], parent: 7 }
      ]
    },
    {
      id: 8,
      title: 'Research',
      type: 'topics',
      children: [
        {
          id: 81,
          title: 'Research card',
          type: 'tips',
          children: [],
          parent: 8
        },
        {
          id: 82,
          title: 'Research card',
          type: 'tips',
          children: [],
          parent: 8
        }
      ]
    },
    {
      id: 9,
      title: 'Sprints',
      type: 'topics',
      children: [
        { id: 91, title: 'Task card', type: 'tips', children: [], parent: 9 },
        { id: 92, title: 'Task card', type: 'tips', children: [], parent: 9 }
      ]
    }
  ],
  [Views.KnowledgeBase]: [
    { id: 1, title: 'Knowledge card', type: 'tips', children: [] },
    { id: 2, title: 'Knowledge card', type: 'tips', children: [] },
    {
      id: 3,
      title: 'Knowledge section',
      type: 'topics',
      children: [
        {
          id: 31,
          title: 'Knowledge card',
          type: 'tips',
          children: [],
          parent: 3
        },
        {
          id: 32,
          title: 'Knowledge card',
          type: 'tips',
          children: [],
          parent: 3
        },
        {
          id: 33,
          title: 'Knowledge card',
          type: 'tips',
          children: [],
          parent: 3
        }
      ]
    },
    {
      id: 4,
      title: 'Knowledge section',
      type: 'topics',
      children: [
        {
          id: 41,
          title: 'Knowledge card',
          type: 'tips',
          children: [],
          parent: 4
        },
        {
          id: 42,
          title: 'Knowledge card',
          type: 'tips',
          children: [],
          parent: 4
        },
        {
          id: 43,
          title: 'Knowledge card',
          type: 'tips',
          children: [],
          parent: 4
        }
      ]
    }
  ],
  [Views.FileSharing]: [
    { id: 1, title: 'File card', type: 'tips', children: [] },
    { id: 2, title: 'File card', type: 'tips', children: [] },
    {
      id: 3,
      title: 'File Folder',
      type: 'topics',
      children: [
        { id: 31, title: 'File card', type: 'tips', children: [], parent: 3 },
        { id: 32, title: 'File card', type: 'tips', children: [], parent: 3 },
        { id: 33, title: 'File card', type: 'tips', children: [], parent: 3 }
      ]
    },
    {
      id: 4,
      title: 'File Folder',
      type: 'topics',
      children: [
        { id: 41, title: 'File card', type: 'tips', children: [], parent: 4 },
        { id: 42, title: 'File card', type: 'tips', children: [], parent: 4 },
        { id: 43, title: 'File card', type: 'tips', children: [], parent: 4 }
      ]
    }
  ],
  [Views.NoteTaking]: [
    { id: 1, title: 'Note card', type: 'tips', children: [] },
    { id: 2, title: 'Note card', type: 'tips', children: [] },
    {
      id: 3,
      title: 'Note section',
      type: 'topics',
      children: [
        { id: 31, title: 'Note card', type: 'tips', children: [], parent: 3 },
        { id: 32, title: 'Note card', type: 'tips', children: [], parent: 3 },
        { id: 33, title: 'Note card', type: 'tips', children: [], parent: 3 }
      ]
    },
    {
      id: 4,
      title: 'Note section',
      type: 'topics',
      children: [
        { id: 41, title: 'Note card', type: 'tips', children: [], parent: 4 },
        { id: 42, title: 'Note card', type: 'tips', children: [], parent: 4 },
        { id: 43, title: 'Note card', type: 'tips', children: [], parent: 4 }
      ]
    }
  ],
  [Views.TaskList]: [
    { id: 1, title: 'Task card', type: 'tips', children: [] },
    { id: 2, title: 'Task card', type: 'tips', children: [] },
    {
      id: 3,
      title: 'Task Group',
      type: 'topics',
      children: [
        { id: 31, title: 'Task card', type: 'tips', children: [], parent: 3 },
        { id: 32, title: 'Task card', type: 'tips', children: [], parent: 3 },
        { id: 33, title: 'Task card', type: 'tips', children: [], parent: 3 }
      ]
    },
    {
      id: 4,
      title: 'Task Group',
      type: 'topics',
      children: [
        { id: 41, title: 'Task card', type: 'tips', children: [], parent: 4 },
        { id: 42, title: 'Task card', type: 'tips', children: [], parent: 4 },
        { id: 43, title: 'Task card', type: 'tips', children: [], parent: 4 }
      ]
    }
  ],
  [Views.Database]: [
    { id: 1, title: 'Database card', type: 'tips', children: [] },
    { id: 2, title: 'Database card', type: 'tips', children: [] },
    {
      id: 3,
      title: 'Database Group',
      type: 'topics',
      children: [
        {
          id: 31,
          title: 'Database card',
          type: 'tips',
          children: [],
          parent: 3
        },
        {
          id: 32,
          title: 'Database card',
          type: 'tips',
          children: [],
          parent: 3
        },
        {
          id: 33,
          title: 'Database card',
          type: 'tips',
          children: [],
          parent: 3
        }
      ]
    },
    {
      id: 4,
      title: 'Database Group',
      type: 'topics',
      children: [
        {
          id: 41,
          title: 'Database card',
          type: 'tips',
          children: [],
          parent: 4
        },
        {
          id: 42,
          title: 'Database card',
          type: 'tips',
          children: [],
          parent: 4
        },
        {
          id: 43,
          title: 'Database card',
          type: 'tips',
          children: [],
          parent: 4
        }
      ]
    }
  ]
};
