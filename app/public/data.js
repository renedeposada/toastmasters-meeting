// Sample data for Doral Toastmasters club
const SAMPLE_DATA = {
  club: {
    id: 'doral-tm',
    name: 'Doral Toastmasters',
    members: [
      { id: 'member-1', name: 'Maria Smith', email: 'maria@example.com', active: true },
      { id: 'member-2', name: 'John Smith', email: 'john@example.com', active: true },
      { id: 'member-3', name: 'Rene De Posada', email: 'rene@example.com', active: true },
      { id: 'member-4', name: 'Sarah Smith', email: 'sarah@example.com', active: true },
      { id: 'member-5', name: 'Alex Smith', email: 'alex@example.com', active: true },
      { id: 'member-6', name: 'Jennifer Smith', email: 'jennifer@example.com', active: true },
      { id: 'member-7', name: 'Michael Smith', email: 'michael@example.com', active: true },
    ],
  },

  meeting: {
    id: 'meeting-1',
    clubId: 'doral-tm',
    status: 'active', // 'ready' | 'active' | 'finished'
    preparedSpeakers: [
      { id: 'member-1', name: 'Maria Smith', role: 'Prepared Speaker' },
      { id: 'member-2', name: 'John Smith', role: 'Prepared Speaker' },
    ],
    toastmaster: { id: 'member-3', name: 'Rene De Posada', role: 'Toastmaster' },
    topicsmaster: { id: 'member-4', name: 'Sarah Smith', role: 'Topicsmaster' },
    generalEvaluator: { id: 'member-5', name: 'Alex Smith', role: 'General Evaluator' },
    evaluators: [
      { id: 'member-6', name: 'Jennifer Smith' },
      { id: 'member-7', name: 'Michael Smith' },
    ],
    tableTopicsParticipants: [
      { id: 'tt-1', name: 'Sarah Johnson', isGuest: true },
      { id: 'member-1', name: 'Maria Smith', isGuest: false },
    ],
  },

  feedbackEligibleRecipients: [
    { id: 'member-1', name: 'Maria Smith', role: 'Prepared Speaker' },
    { id: 'member-2', name: 'John Smith', role: 'Prepared Speaker' },
    { id: 'member-3', name: 'Rene De Posada', role: 'Toastmaster' },
    { id: 'member-4', name: 'Sarah Smith', role: 'Topicsmaster' },
    { id: 'member-5', name: 'Alex Smith', role: 'General Evaluator' },
  ],

  votingCategories: [
    {
      id: 'best-speaker',
      name: 'Best Speaker',
      candidates: [
        { id: 'member-1', name: 'Maria Smith' },
        { id: 'member-2', name: 'John Smith' },
      ],
    },
    {
      id: 'best-evaluator',
      name: 'Best Evaluator',
      candidates: [
        { id: 'member-6', name: 'Jennifer Smith' },
        { id: 'member-7', name: 'Michael Smith' },
      ],
    },
    {
      id: 'best-table-topics',
      name: 'Best Table Topics Speaker',
      candidates: [
        { id: 'tt-1', name: 'Sarah Johnson' },
        { id: 'member-1', name: 'Maria Smith' },
      ],
    },
  ],
};
