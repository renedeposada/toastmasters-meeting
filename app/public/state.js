// Application state management
class AppState {
  constructor() {
    this.meeting = { ...SAMPLE_DATA.meeting };
    this.club = { ...SAMPLE_DATA.club };
    this.feedback = [];
    this.votes = [];
    this.userVoted = {};
    this.currentPage = 'home';
    this.pageParams = {};
  }

  submitFeedback(recipientId, wellWorked, improve, senderName = null) {
    this.feedback.push({
      id: Date.now(),
      recipientId,
      wellWorked,
      improve,
      senderName: senderName || null,
      timestamp: new Date(),
    });
  }

  submitVote(categoryId, candidateId) {
    this.votes.push({
      id: Date.now(),
      categoryId,
      candidateId,
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
    SAMPLE_DATA.votingCategories.forEach((category) => {
      const categoryVotes = this.votes.filter((v) => v.categoryId === category.id);
      const candidateCounts = {};

      category.candidates.forEach((candidate) => {
        candidateCounts[candidate.id] = {
          candidate,
          count: categoryVotes.filter((v) => v.candidateId === candidate.id).length,
        };
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
    SAMPLE_DATA.feedbackEligibleRecipients.forEach((recipient) => {
      feedbackByRecipient[recipient.id] = this.feedback.filter(
        (f) => f.recipientId === recipient.id
      );
    });
    return feedbackByRecipient;
  }
}

// Global state instance
const state = new AppState();
