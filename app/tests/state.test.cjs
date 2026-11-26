const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createState() {
  const context = vm.createContext({ structuredClone });
  for (const file of ['data.js', 'state.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../public', file), 'utf8'), context);
  }
  return vm.runInContext('({ state, sample: SAMPLE_DATA, escapeHtml })', context);
}

test('meeting setup determines feedback recipients and voting candidates', () => {
  const { state, sample } = createState();
  state.meeting.preparedSpeakers = [{ id: 'member-3', name: 'Rene' }];
  state.meeting.evaluators = [];
  state.meeting.tableTopicsParticipants = [{ id: 'guest-1', name: 'Guest', isGuest: true }];

  assert.equal(state.getFeedbackRecipients()[0].name, 'Rene');
  assert.equal(state.getVotingCategories()[0].candidates[0].id, 'member-3');
  assert.equal(state.getVotingCategories()[1].candidates.length, 0);
  assert.equal(state.getVotingCategories()[2].candidates[0].id, 'guest-1');
  assert.equal(sample.meeting.preparedSpeakers[0].id, 'member-1');
});

test('votes and feedback are counted and cleared on reset', () => {
  const { state } = createState();
  state.submitVote('best-speaker', 'member-1');
  state.submitVote('best-speaker', 'member-2');
  state.submitFeedback('member-1', 'Clear', 'Slower', 'Guest');
  const votes = state.getVoteResults()['best-speaker'].votes;
  assert.equal(votes['member-1'].count, 1);
  assert.equal(votes['member-2'].count, 1);
  assert.equal(state.getFeedbackByRecipient()['member-1'][0].senderName, 'Guest');
  state.meeting.preparedSpeakers = [];
  assert.equal(state.getVoteResults()['best-speaker'].votes['member-1'].candidate.name, 'Maria Smith');
  assert.equal(state.getVoteResults()['best-speaker'].votes['member-1'].count, 1);
  assert.equal(state.feedback[0].recipientName, 'Maria Smith');

  state.finishMeeting();
  state.resetMeeting();
  assert.equal(state.meeting.status, 'ready');
  assert.equal(state.feedback.length, 0);
  assert.equal(state.votes.length, 0);
  assert.equal(state.getVotingCategories()[0].candidates.length, 0);
});

test('user-provided text is escaped for HTML', () => {
  const { escapeHtml } = createState();
  assert.equal(escapeHtml(`<img src="x" onerror='x'>&`), '&lt;img src=&quot;x&quot; onerror=&#39;x&#39;&gt;&amp;');
});
