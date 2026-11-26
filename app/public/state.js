// Application state management
class AppState {
  constructor() {
    this.meeting = structuredClone(SAMPLE_DATA.meeting);
    this.club = structuredClone(SAMPLE_DATA.club);
    this.feedback = [];
    this.votes = [];
    this.userVoted = {};
    this.currentPage = 'home';
    this.pageParams = {};
    this.nextId = 0;
  }

  createId() {
    this.nextId += 1;
    return `local-${this.nextId}`;
  }

  submitFeedback(recipientId, wellWorked, improve, senderName = null) {
    this.feedback.push({
      id: Date.now(),
      recipientId,
      recipientName: this.getFeedbackRecipients().find((recipient) => recipient.id === recipientId)?.name,
      wellWorked,
      improve,
      senderName: senderName || null,
      timestamp: new Date(),
    });
  }

  submitVote(categoryId, candidateId) {
    const category = this.getVotingCategories().find((item) => item.id === categoryId);
    this.votes.push({
      id: Date.now(),
      categoryId,
      candidateId,
      candidateName: category?.candidates.find((candidate) => candidate.id === candidateId)?.name,
      timestamp: new Date(),
    });
    this.userVoted[categoryId] = true;
  }

  startMeeting() {
    this.meeting.status = 'active';
  }

  finishMeeting() {
    this.meeting.status = 'finished';
  }

  resetMeeting() {
    this.meeting = {
      ...this.meeting,
      status: 'ready',
      preparedSpeakers: [],
      toastmaster: null,
      topicsmaster: null,
      generalEvaluator: null,
      evaluators: [],
      tableTopicsParticipants: [],
    };
    this.feedback = [];
    this.votes = [];
    this.userVoted = {};
  }

  getVoteResults() {
    const results = {};
    this.getVotingCategories().forEach((category) => {
      const categoryVotes = this.votes.filter((v) => v.categoryId === category.id);
      const candidateCounts = {};

      category.candidates.forEach((candidate) => {
        candidateCounts[candidate.id] = {
          candidate,
          count: 0,
        };
      });

      categoryVotes.forEach((vote) => {
        if (!candidateCounts[vote.candidateId]) {
          candidateCounts[vote.candidateId] = {
            candidate: { id: vote.candidateId, name: vote.candidateName },
            count: 0,
          };
        }
        candidateCounts[vote.candidateId].count += 1;
      });

      results[category.id] = {
        category,
        votes: candidateCounts,
      };
    });

    return results;
  }

  getFeedbackByRecipient() {
    const feedbackByRecipient = {};
    this.getFeedbackRecipients().forEach((recipient) => {
      feedbackByRecipient[recipient.id] = this.feedback.filter(
        (f) => f.recipientId === recipient.id
      );
    });
    return feedbackByRecipient;
  }

  getFeedbackRecipients() {
    const roles = [
      ...this.meeting.preparedSpeakers.map((member) => ({ ...member, role: 'Prepared Speaker' })),
      ...[
        [this.meeting.toastmaster, 'Toastmaster'],
        [this.meeting.topicsmaster, 'Topicsmaster'],
        [this.meeting.generalEvaluator, 'General Evaluator'],
      ].filter(([member]) => member).map(([member, role]) => ({ ...member, role })),
    ];
    return roles.filter((member, index) => roles.findIndex((other) => other.id === member.id) === index);
  }

  getVotingCategories() {
    const candidates = [
      this.meeting.preparedSpeakers,
      this.meeting.evaluators,
      this.meeting.tableTopicsParticipants,
    ];
    return SAMPLE_DATA.votingCategories.map((category, index) => ({
      id: category.id,
      name: category.name,
      candidates: candidates[index],
    }));
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

// Global state instance
const state = new AppState();
