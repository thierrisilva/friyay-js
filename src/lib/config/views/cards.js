import React from 'react';

const AssignedView = React.lazy(() =>
  import('Components/views/card_views/Assigned/AssignedView')
);
const CardView = React.lazy(() =>
  import('Components/views/card_views/Card/CardView')
);
const DocumentView = React.lazy(() =>
  import('Components/views/card_views/Document/DocumentView')
);
const GoalView = React.lazy(() =>
  import('Components/views/card_views/Goal/GoalView')
);
const GridView = React.lazy(() =>
  import('Components/views/card_views/Grid/GridView')
);
const KanbanView = React.lazy(() =>
  import('Components/views/card_views/Kanban/KanbanView')
);
const SmallGridView = React.lazy(() =>
  import('Components/views/card_views/Small_Grid/SmallGridView')
);
const TaskView = React.lazy(() =>
  import('Components/views/card_views/Task/TaskView')
);
const ListView = React.lazy(() =>
  import('Components/views/card_views/List/ListView')
);
const TodoView = React.lazy(() =>
  import('Components/views/card_views/Todo/TodoView')
);
const BasicView = React.lazy(() =>
  import('Components/views/card_views/Basic/BasicView')
);
const WikiView = React.lazy(() =>
  import('Components/views/card_views/Wiki/WikiView')
);
const PlanningView = React.lazy(() =>
  import('Components/views/card_views/Planning/PlanningView')
);
const CalendarView = React.lazy(() =>
  import('Components/views/card_views/Calendar/CalendarView')
);
const TimelineView = React.lazy(() =>
  import('Components/views/card_views/Timeline/TimelineView')
);
const StatusTableView = React.lazy(() =>
  import('Components/views/card_views/StatusTable/StatusTableView')
);
const BurndownView = React.lazy(() =>
  import('Components/views/card_views/Burndown/BurndownView')
);
const SheetView = React.lazy(() =>
  import('Components/views/card_views/Sheet/SheetView')
);
const EstimationView = React.lazy(() =>
  import('Components/views/card_views/Estimation/EstimationView')
);
const PrioritizeView = React.lazy(() =>
  import('Components/views/card_views/Prioritize/PrioritizeView')
);
const PagesView = React.lazy(() =>
  import('Components/views/card_views/Pages/PagesView')
);
const MessageBoardView = React.lazy(() =>
  import('Components/views/card_views/MessageBoard/MessageBoardView')
);

const ActionPlanView = React.lazy(() =>
  import('Components/views/card_views/ActionPlan/ActionPlanView')
);

const cardViews = {
  BASIC: {
    key: 'BASIC',
    name: 'Page',
    icon: 'paragraph',
    fontAwesomeIcon: true,
    category: 'content',
    description: `For basic writing and media - text, images, tables, links, videos, etc`,
    viewComponent: BasicView,
    previewImage: 'basic',
    defaultConfig: {
      header: 'STANDARD',
      topic: false,
      card: 'WIKI'
    },
    disabledPages: ['home']
  },
  GRID: {
    key: 'GRID',
    name: 'Notes',
    icon: 'view_module',
    fontAwesomeIcon: false,
    category: 'content',
    description:
      'Card list as a grid - for quick notes, link sharing and information gathering',
    viewComponent: GridView,
    previewImage: 'grid',
    layoutConfig: {
      secondaryInitialSize: 40
    },
    defaultConfig: {
      header: 'STANDARD',
      topic: 'SMALL_HEX',
      card: 'GRID'
    }
  },
  SMALL_GRID: {
    key: 'SMALL_GRID',
    name: 'Small Notes',
    icon: 'apps',
    fontAwesomeIcon: false,
    category: 'content',
    description: 'Like Notes....but smaller',
    viewComponent: SmallGridView,
    previewImage: 'small_grid',
    layoutConfig: {
      secondaryInitialSize: 45
    },
    defaultConfig: {
      header: 'STANDARD',
      topic: 'SMALL_HEX',
      card: 'SMALL_GRID'
    }
  },
  PAGES: {
    key: 'PAGES',
    name: 'Pages',
    icon: 'newspaper-o',
    fontAwesomeIcon: true,
    category: 'content',
    description:
      'Card list as pages - for basic writing and media with multiple sections',
    viewComponent: PagesView,
    previewImage: 'pages',
    defaultConfig: {
      header: 'STANDARD',
      topic: false,
      card: 'PAGES'
    },
    disabledPages: ['home']
  },
  WIKI: {
    key: 'WIKI',
    name: 'Wiki',
    icon: 'university',
    fontAwesomeIcon: true,
    category: 'content',
    description: 'For a knowledge base',
    viewComponent: WikiView,
    previewImage: 'wiki',
    isSplitLayoutDisabled: true,
    defaultConfig: {
      header: 'STANDARD',
      topic: false,
      card: 'WIKI'
    }
  },
  MESSAGE_BOARD: {
    key: 'MESSAGE_BOARD',
    name: 'Message Board',
    icon: 'bullhorn',
    fontAwesomeIcon: true,
    category: 'content',
    description: `For announcements, discussions or share message with the team`,
    viewComponent: MessageBoardView,
    previewImage: 'message_board',
    defaultConfig: {
      header: 'STANDARD',
      topic: false,
      card: 'MESSAGE_BOARD'
    }
  },
  CARD: {
    key: 'CARD',
    name: 'Guide',
    icon: 'view_quilt',
    fontAwesomeIcon: false,
    category: 'content',
    description: `For a guide and simple knowledge base`,
    viewComponent: CardView,
    previewImage: 'card',
    isSplitLayoutDisabled: true,
    defaultConfig: {
      header: 'STANDARD',
      topic: 'SMALL_HEX',
      card: 'CARD'
    }
  },
  TODO: {
    key: 'TODO',
    name: 'Todo',
    icon: 'check_circle',
    fontAwesomeIcon: false,
    category: 'planning',
    description: 'Simple to-do list',
    viewComponent: TodoView,
    previewImage: 'todo',
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'TODO'
    }
  },
  KANBAN: {
    key: 'KANBAN',
    name: 'Kanban Board',
    icon: 'view_week',
    fontAwesomeIcon: false,
    category: 'planning',
    description: 'Each lane is a label to show status in a workflow',
    viewComponent: KanbanView,
    previewImage: 'kanban',
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'KANBAN'
    }
  },
  ASSIGNED: {
    key: 'ASSIGNED',
    name: 'Assign Board',
    icon: 'assignment_ind',
    fontAwesomeIcon: false,
    category: 'planning',
    description: 'Each lane is a team member to assign Cards to',
    viewComponent: AssignedView,
    previewImage: 'assigned',
    layoutConfig: {
      secondaryInitialSize: 35
    },
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'ASSIGNED'
    }
  },
  PRIORITIZE: {
    key: 'PRIORITIZE',
    name: 'Prioritize Board',
    icon: 'subtitles',
    fontAwesomeIcon: false,
    category: 'planning',
    description: 'Each lane or row is a priority level',
    viewComponent: PrioritizeView,
    previewImage: 'prioritize',
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'PRIORITIZE'
    }
  },
  GOAL: {
    key: 'GOAL',
    name: 'Sprint Board',
    icon: 'bullseye',
    fontAwesomeIcon: true,
    category: 'planning',
    description: 'For goal setting and sprints with completion bars',
    viewComponent: GoalView,
    previewImage: 'goal',
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'GOAL'
    }
  },
  PLANNING: {
    key: 'PLANNING',
    name: 'Planning Table',
    icon: 'date_range',
    fontAwesomeIcon: false,
    category: 'planning',
    description: 'Rows with assignees, columns with due dates',
    viewComponent: PlanningView,
    previewImage: 'planning',
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'PLANNING'
    }
  },
  TIMELINE: {
    key: 'TIMELINE',
    name: 'Timeline',
    icon: 'subtitles',
    fontAwesomeIcon: false,
    category: 'planning',
    description: `Cards on a timeline`,
    viewComponent: TimelineView,
    previewImage: 'timeline',
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'TIMELINE'
    }
  },
  CALENDAR: {
    key: 'CALENDAR',
    name: 'Calendar',
    icon: 'calendar',
    fontAwesomeIcon: true,
    category: 'planning',
    description: 'Cards on a calendar',
    viewComponent: CalendarView,
    previewImage: 'calendar',
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'CALENDAR'
    }
  },
  STATUS_TABLE: {
    key: 'STATUS_TABLE',
    name: 'Status Table',
    icon: 'delicious',
    fontAwesomeIcon: true,
    category: 'planning',
    description: 'Cards on a status table',
    viewComponent: StatusTableView,
    previewImage: 'status_table',
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'STATUS_TABLE'
    }
  },
  BURNDOWN: {
    key: 'BURNDOWN',
    name: 'Burndown',
    icon: 'cubes',
    fontAwesomeIcon: true,
    category: 'planning',
    description: 'Cards on a burndown',
    viewComponent: BurndownView,
    previewImage: 'burndown',
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'BURNDOWN'
    }
  },
  LIST: {
    key: 'LIST',
    name: 'Simple List',
    icon: 'view_stream',
    fontAwesomeIcon: false,
    category: 'database',
    description: `List of Simple cards`,
    viewComponent: ListView,
    previewImage: 'list',
    defaultConfig: {
      header: 'STANDARD',
      topic: 'SMALL_HEX',
      card: 'LIST'
    }
  },
  TASK: {
    key: 'TASK',
    name: 'List',
    icon: 'view_day',
    fontAwesomeIcon: false,
    category: 'database',
    description: `List of Simple and yays`,
    viewComponent: TaskView,
    previewImage: 'task',
    defaultConfig: {
      header: 'STANDARD',
      topic: 'SMALL_HEX',
      card: 'TASK'
    }
  },
  SHEET: {
    key: 'SHEET',
    name: 'Sheet',
    icon: 'grid_on',
    fontAwesomeIcon: false,
    category: 'database',
    description: 'Customazible grid with numerous columns for easy data access',
    viewComponent: SheetView,
    previewImage: 'sheet',
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'SHEET'
    }
  },
  ESTIMATION: {
    key: 'ESTIMATION',
    name: 'Worksheet',
    icon: 'timer',
    fontAwesomeIcon: false,
    category: 'database',
    description: 'Sheet view with pre-set columns for easy estimation',
    viewComponent: EstimationView,
    previewImage: 'sheet',
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'ESTIMATION'
    }
  },
  DOCUMENT: {
    key: 'DOCUMENT',
    name: 'File List',
    icon: 'insert_drive_file',
    fontAwesomeIcon: false,
    category: 'database',
    description: 'For file sharing',
    viewComponent: DocumentView,
    previewImage: 'document',
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'DOCUMENT'
    }
  },

  ACTION_PLAN: {
    key: 'ACTION_PLAN',
    name: 'Action Plan',
    icon: 'view_stream',
    fontAwesomeIcon: false,
    category: 'actions',
    description: 'Action views',
    previewImage: 'Topic_List',
    viewComponent: ActionPlanView,
    defaultConfig: {
      header: 'STANDARD',
      topic: null,
      card: 'SHEET'
    }
  },

  TOPIC_HEXES: {
    key: 'TOPIC_HEXES',
    name: 'Yay Hexes',
    icon: 'topic',
    fontAwesomeIcon: false,
    category: 'yay_lists',
    description: `For a list of sub yays shown as hexes`,
    previewImage: 'Topic_Hex'
  },
  TOPIC_TILES: {
    key: 'TOPIC_TILES',
    name: 'Yay Tiles',
    icon: 'view_module',
    fontAwesomeIcon: false,
    category: 'yay_lists',
    description: `For a list of sub yays shown as tiles`,
    previewImage: 'Topic_Tile'
  },
  TOPIC_LIST: {
    key: 'TOPIC_LIST',
    name: 'Yay List',
    icon: 'view_stream',
    fontAwesomeIcon: false,
    category: 'yay_lists',
    description: `For a list of sub yays shown as a list`,
    previewImage: 'Topic_List'
  }
};

export default cardViews;
