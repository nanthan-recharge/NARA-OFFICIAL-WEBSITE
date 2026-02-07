/**
 * Public Consultation Portal Service
 *
 * Manages public consultations, citizen feedback, and policy engagement
 * for NARA Digital Ocean Platform
 *
 * Service Modules:
 * 1. Consultation Service - Manage consultation sessions
 * 2. Feedback Service - Collect and manage public feedback
 * 3. Voting Service - Enable public voting on proposals
 * 4. Comment Service - Discussion threads and moderation
 * 5. Survey Service - Create and analyze surveys
 * 6. Analytics Service - Analyze engagement and sentiment
 * 7. Report Service - Generate consultation reports
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ========== 1. CONSULTATION SERVICE ==========

/**
 * Manages public consultation sessions
 */
export const consultationService = {
  /**
   * Create a new consultation
   */
  create: async (consultationData) => {
    try {
      const consultationId = `CONSULT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        consultationId,
        ...consultationData,
        status: 'draft',
        participantCount: 0,
        feedbackCount: 0,
        commentCount: 0,
        voteCount: 0,
        viewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'consultations'), dataToSave);
      return { data: { id: docRef.id, consultationId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating consultation:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get all consultations
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'consultations');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      const consultations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: consultations, error: null };
    } catch (error) {
      console.error('Error fetching consultations:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get a single consultation by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'consultations', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: 'Consultation not found' };
      }

      // Increment view count
      await updateDoc(docRef, {
        viewCount: increment(1)
      });

      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } catch (error) {
      console.error('Error fetching consultation:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Update consultation
   */
  update: async (id, updates) => {
    try {
      const docRef = doc(db, 'consultations', id);

      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { data: { id, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating consultation:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Delete consultation
   */
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'consultations', id));
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting consultation:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Update consultation status
   */
  updateStatus: async (id, status) => {
    try {
      const docRef = doc(db, 'consultations', id);

      const statusUpdate = {
        status,
        updatedAt: serverTimestamp()
      };

      if (status === 'open') {
        statusUpdate.openedAt = serverTimestamp();
      } else if (status === 'closed') {
        statusUpdate.closedAt = serverTimestamp();
      }

      await updateDoc(docRef, statusUpdate);
      return { data: { id, status }, error: null };
    } catch (error) {
      console.error('Error updating consultation status:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 2. FEEDBACK SERVICE ==========

/**
 * Manages public feedback submissions
 */
export const feedbackService = {
  /**
   * Submit feedback
   */
  submit: async (consultationId, feedbackData) => {
    try {
      const feedbackId = `FEEDBACK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        feedbackId,
        consultationId,
        ...feedbackData,
        status: 'submitted',
        upvotes: 0,
        downvotes: 0,
        replies: [],
        flagged: false,
        submittedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'consultation_feedback'), dataToSave);

      // Update consultation feedback count
      const consultationQuery = query(
        collection(db, 'consultations'),
        where('consultationId', '==', consultationId)
      );
      const consultationSnapshot = await getDocs(consultationQuery);

      if (!consultationSnapshot.empty) {
        const consultationDoc = consultationSnapshot.docs[0];
        await updateDoc(doc(db, 'consultations', consultationDoc.id), {
          feedbackCount: increment(1),
          participantCount: increment(1),
          updatedAt: serverTimestamp()
        });
      }

      return { data: { id: docRef.id, feedbackId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get feedback for a consultation
   */
  getByConsultationId: async (consultationId, limitCount = 100) => {
    try {
      const q = query(
        collection(db, 'consultation_feedback'),
        where('consultationId', '==', consultationId),
        orderBy('submittedAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const feedback = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: feedback, error: null };
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Upvote feedback
   */
  upvote: async (feedbackId, userId) => {
    try {
      const q = query(
        collection(db, 'consultation_feedback'),
        where('feedbackId', '==', feedbackId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: 'Feedback not found' };
      }

      const feedbackDoc = snapshot.docs[0];
      await updateDoc(doc(db, 'consultation_feedback', feedbackDoc.id), {
        upvotes: increment(1)
      });

      return { data: { feedbackId, action: 'upvoted' }, error: null };
    } catch (error) {
      console.error('Error upvoting feedback:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Flag inappropriate feedback
   */
  flag: async (feedbackId, reason) => {
    try {
      const q = query(
        collection(db, 'consultation_feedback'),
        where('feedbackId', '==', feedbackId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: 'Feedback not found' };
      }

      const feedbackDoc = snapshot.docs[0];
      await updateDoc(doc(db, 'consultation_feedback', feedbackDoc.id), {
        flagged: true,
        flagReason: reason,
        flaggedAt: serverTimestamp()
      });

      return { data: { feedbackId, flagged: true }, error: null };
    } catch (error) {
      console.error('Error flagging feedback:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 3. VOTING SERVICE ==========

/**
 * Manages voting on proposals and options
 */
export const votingService = {
  /**
   * Create a vote/poll
   */
  createPoll: async (consultationId, pollData) => {
    try {
      const pollId = `POLL-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        pollId,
        consultationId,
        ...pollData,
        totalVotes: 0,
        results: {},
        status: 'active',
        createdAt: serverTimestamp()
      };

      // Initialize results for each option
      if (pollData.options) {
        pollData.options.forEach(option => {
          dataToSave.results[option] = 0;
        });
      }

      const docRef = await addDoc(collection(db, 'consultation_polls'), dataToSave);
      return { data: { id: docRef.id, pollId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating poll:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Submit a vote
   */
  vote: async (pollId, selectedOption, voterData) => {
    try {
      const voteId = `VOTE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Record individual vote
      const voteRecord = {
        voteId,
        pollId,
        selectedOption,
        voterEmail: voterData.voterEmail,
        voterName: voterData.voterName,
        votedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'consultation_votes'), voteRecord);

      // Update poll results
      const pollQuery = query(
        collection(db, 'consultation_polls'),
        where('pollId', '==', pollId)
      );
      const pollSnapshot = await getDocs(pollQuery);

      if (!pollSnapshot.empty) {
        const pollDoc = pollSnapshot.docs[0];
        const poll = pollDoc.data();

        const updatedResults = { ...poll.results };
        updatedResults[selectedOption] = (updatedResults[selectedOption] || 0) + 1;

        await updateDoc(doc(db, 'consultation_polls', pollDoc.id), {
          results: updatedResults,
          totalVotes: increment(1)
        });

        // Update consultation vote count
        const consultationQuery = query(
          collection(db, 'consultations'),
          where('consultationId', '==', poll.consultationId)
        );
        const consultationSnapshot = await getDocs(consultationQuery);

        if (!consultationSnapshot.empty) {
          const consultationDoc = consultationSnapshot.docs[0];
          await updateDoc(doc(db, 'consultations', consultationDoc.id), {
            voteCount: increment(1),
            participantCount: increment(1)
          });
        }
      }

      return { data: { voteId, selectedOption }, error: null };
    } catch (error) {
      console.error('Error submitting vote:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get poll results
   */
  getPollResults: async (pollId) => {
    try {
      const q = query(
        collection(db, 'consultation_polls'),
        where('pollId', '==', pollId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: 'Poll not found' };
      }

      const poll = snapshot.docs[0].data();

      // Calculate percentages
      const resultsWithPercentages = {};
      Object.entries(poll.results).forEach(([option, count]) => {
        resultsWithPercentages[option] = {
          count,
          percentage: poll.totalVotes > 0 ? Math.round((count / poll.totalVotes) * 100) : 0
        };
      });

      return {
        data: {
          pollId: poll.pollId,
          question: poll.question,
          totalVotes: poll.totalVotes,
          results: resultsWithPercentages
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting poll results:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 4. COMMENT SERVICE ==========

/**
 * Manages discussion threads and comments
 */
export const commentService = {
  /**
   * Add a comment
   */
  add: async (consultationId, commentData) => {
    try {
      const commentId = `COMMENT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        commentId,
        consultationId,
        ...commentData,
        replies: [],
        likes: 0,
        status: 'approved',
        postedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'consultation_comments'), dataToSave);

      // Update consultation comment count
      const consultationQuery = query(
        collection(db, 'consultations'),
        where('consultationId', '==', consultationId)
      );
      const consultationSnapshot = await getDocs(consultationQuery);

      if (!consultationSnapshot.empty) {
        const consultationDoc = consultationSnapshot.docs[0];
        await updateDoc(doc(db, 'consultations', consultationDoc.id), {
          commentCount: increment(1)
        });
      }

      return { data: { id: docRef.id, commentId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get comments for a consultation
   */
  getByConsultationId: async (consultationId, limitCount = 100) => {
    try {
      const q = query(
        collection(db, 'consultation_comments'),
        where('consultationId', '==', consultationId),
        where('status', '==', 'approved'),
        orderBy('postedAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const comments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: comments, error: null };
    } catch (error) {
      console.error('Error fetching comments:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Reply to a comment
   */
  reply: async (commentId, replyData) => {
    try {
      const q = query(
        collection(db, 'consultation_comments'),
        where('commentId', '==', commentId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: 'Comment not found' };
      }

      const commentDoc = snapshot.docs[0];
      const comment = commentDoc.data();

      const newReply = {
        replyId: `REPLY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        ...replyData,
        postedAt: new Date().toISOString()
      };

      const updatedReplies = [...(comment.replies || []), newReply];

      await updateDoc(doc(db, 'consultation_comments', commentDoc.id), {
        replies: updatedReplies
      });

      return { data: newReply, error: null };
    } catch (error) {
      console.error('Error adding reply:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Like a comment
   */
  like: async (commentId) => {
    try {
      const q = query(
        collection(db, 'consultation_comments'),
        where('commentId', '==', commentId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { data: null, error: 'Comment not found' };
      }

      const commentDoc = snapshot.docs[0];
      await updateDoc(doc(db, 'consultation_comments', commentDoc.id), {
        likes: increment(1)
      });

      return { data: { commentId, liked: true }, error: null };
    } catch (error) {
      console.error('Error liking comment:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 5. SURVEY SERVICE ==========

/**
 * Manages surveys and questionnaires
 */
export const surveyService = {
  /**
   * Create a survey
   */
  create: async (consultationId, surveyData) => {
    try {
      const surveyId = `SURVEY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        surveyId,
        consultationId,
        ...surveyData,
        responseCount: 0,
        status: 'active',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'consultation_surveys'), dataToSave);
      return { data: { id: docRef.id, surveyId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating survey:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Submit survey response
   */
  submitResponse: async (surveyId, responses) => {
    try {
      const responseId = `RESPONSE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        responseId,
        surveyId,
        responses,
        submittedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'survey_responses'), dataToSave);

      // Update survey response count
      const surveyQuery = query(
        collection(db, 'consultation_surveys'),
        where('surveyId', '==', surveyId)
      );
      const surveySnapshot = await getDocs(surveyQuery);

      if (!surveySnapshot.empty) {
        const surveyDoc = surveySnapshot.docs[0];
        await updateDoc(doc(db, 'consultation_surveys', surveyDoc.id), {
          responseCount: increment(1)
        });
      }

      return { data: { id: docRef.id, responseId }, error: null };
    } catch (error) {
      console.error('Error submitting survey response:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get survey responses
   */
  getResponses: async (surveyId) => {
    try {
      const q = query(
        collection(db, 'survey_responses'),
        where('surveyId', '==', surveyId),
        orderBy('submittedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const responses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: responses, error: null };
    } catch (error) {
      console.error('Error fetching survey responses:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 6. ANALYTICS SERVICE ==========

/**
 * Analyzes engagement and sentiment
 */
export const analyticsService = {
  /**
   * Get consultation analytics
   */
  getConsultationAnalytics: async (consultationId) => {
    try {
      const consultationQuery = query(
        collection(db, 'consultations'),
        where('consultationId', '==', consultationId)
      );
      const consultationSnapshot = await getDocs(consultationQuery);

      if (consultationSnapshot.empty) {
        return { data: null, error: 'Consultation not found' };
      }

      const consultation = consultationSnapshot.docs[0].data();

      // Get feedback sentiment analysis
      const feedbackQuery = query(
        collection(db, 'consultation_feedback'),
        where('consultationId', '==', consultationId)
      );
      const feedbackSnapshot = await getDocs(feedbackQuery);
      const feedback = feedbackSnapshot.docs.map(doc => doc.data());

      const sentimentBreakdown = {
        positive: feedback.filter(f => f.sentiment === 'positive').length,
        neutral: feedback.filter(f => f.sentiment === 'neutral').length,
        negative: feedback.filter(f => f.sentiment === 'negative').length
      };

      const analytics = {
        consultationId,
        participantCount: consultation.participantCount || 0,
        feedbackCount: consultation.feedbackCount || 0,
        commentCount: consultation.commentCount || 0,
        voteCount: consultation.voteCount || 0,
        viewCount: consultation.viewCount || 0,
        sentimentBreakdown,
        engagementRate: consultation.participantCount > 0
          ? Math.round(((consultation.feedbackCount + consultation.commentCount + consultation.voteCount) / (consultation.participantCount * 3)) * 100)
          : 0
      };

      return { data: analytics, error: null };
    } catch (error) {
      console.error('Error getting consultation analytics:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get overall platform analytics
   */
  getPlatformAnalytics: async () => {
    try {
      const consultationsSnapshot = await getDocs(collection(db, 'consultations'));
      const consultations = consultationsSnapshot.docs.map(doc => doc.data());

      const analytics = {
        totalConsultations: consultations.length,
        activeConsultations: consultations.filter(c => c.status === 'open').length,
        closedConsultations: consultations.filter(c => c.status === 'closed').length,

        totalParticipants: consultations.reduce((sum, c) => sum + (c.participantCount || 0), 0),
        totalFeedback: consultations.reduce((sum, c) => sum + (c.feedbackCount || 0), 0),
        totalComments: consultations.reduce((sum, c) => sum + (c.commentCount || 0), 0),
        totalVotes: consultations.reduce((sum, c) => sum + (c.voteCount || 0), 0),

        consultationsByCategory: {}
      };

      // Category breakdown
      consultations.forEach(consultation => {
        const category = consultation.category || 'uncategorized';
        analytics.consultationsByCategory[category] = (analytics.consultationsByCategory[category] || 0) + 1;
      });

      return { data: analytics, error: null };
    } catch (error) {
      console.error('Error getting platform analytics:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 7. REPORT SERVICE ==========

/**
 * Generates consultation reports
 */
export const reportService = {
  /**
   * Generate consultation report
   */
  generate: async (consultationId) => {
    try {
      const { data: consultation } = await consultationService.getById(consultationId);
      if (!consultation) return { data: null, error: 'Consultation not found' };

      const { data: analytics } = await analyticsService.getConsultationAnalytics(consultationId);
      const { data: feedback } = await feedbackService.getByConsultationId(consultationId);
      const { data: comments } = await commentService.getByConsultationId(consultationId);

      const report = {
        reportId: `REPORT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        consultationId,
        consultationTitle: consultation.title,
        generatedAt: new Date().toISOString(),

        summary: {
          totalParticipants: analytics.participantCount,
          totalFeedback: analytics.feedbackCount,
          totalComments: analytics.commentCount,
          totalVotes: analytics.voteCount,
          engagementRate: analytics.engagementRate
        },

        sentiment: analytics.sentimentBreakdown,

        topFeedback: feedback.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)).slice(0, 10),

        recommendations: generateRecommendations(analytics, feedback),

        conclusion: generateConclusion(analytics, feedback)
      };

      // Save report
      await addDoc(collection(db, 'consultation_reports'), {
        ...report,
        createdAt: serverTimestamp()
      });

      return { data: report, error: null };
    } catch (error) {
      console.error('Error generating report:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Export report as CSV
   */
  exportCSV: async (consultationId) => {
    try {
      const { data: feedback } = await feedbackService.getByConsultationId(consultationId);

      if (!feedback || feedback.length === 0) {
        return { data: null, error: 'No feedback to export' };
      }

      let csv = 'Feedback ID,Submitted By,Email,Message,Sentiment,Upvotes,Submitted At\n';

      feedback.forEach(item => {
        const submittedAt = item.submittedAt?.toDate?.() || new Date(item.submittedAt);
        const row = [
          item.feedbackId,
          item.submittedBy || '',
          item.submitterEmail || '',
          `"${(item.message || '').replace(/"/g, '""')}"`,
          item.sentiment || '',
          item.upvotes || 0,
          submittedAt.toISOString()
        ];
        csv += row.join(',') + '\n';
      });

      return {
        data: {
          csv,
          filename: `consultation_${consultationId}_feedback_${Date.now()}.csv`
        },
        error: null
      };
    } catch (error) {
      console.error('Error exporting CSV:', error);
      return { data: null, error: error.message };
    }
  }
};

// Helper functions
function generateRecommendations(analytics, feedback) {
  const recommendations = [];

  if (analytics.participantCount < 50) {
    recommendations.push('Increase outreach efforts to boost participation');
  }

  if (analytics.sentimentBreakdown.negative > analytics.sentimentBreakdown.positive) {
    recommendations.push('Address concerns raised in negative feedback');
  }

  if (analytics.engagementRate < 30) {
    recommendations.push('Improve consultation format to increase engagement');
  }

  const commonThemes = extractCommonThemes(feedback);
  if (commonThemes.length > 0) {
    recommendations.push(`Focus on key themes: ${commonThemes.join(', ')}`);
  }

  return recommendations;
}

function generateConclusion(analytics, feedback) {
  const participationLevel = analytics.participantCount > 100 ? 'high' :
                            analytics.participantCount > 50 ? 'moderate' : 'low';

  const overallSentiment = analytics.sentimentBreakdown.positive > analytics.sentimentBreakdown.negative
    ? 'positive' : 'mixed';

  return `The consultation received ${participationLevel} participation with ${overallSentiment} overall sentiment. Key stakeholder concerns should be addressed in the final policy decision.`;
}

function extractCommonThemes(feedback) {
  // Simple keyword extraction (in production, use NLP)
  const keywords = ['environment', 'sustainability', 'fishing', 'conservation', 'economy', 'tourism'];
  const themes = [];

  keywords.forEach(keyword => {
    const count = feedback.filter(f =>
      f.message?.toLowerCase().includes(keyword)
    ).length;

    if (count > feedback.length * 0.2) {
      themes.push(keyword);
    }
  });

  return themes;
}

export default {
  consultationService,
  feedbackService,
  votingService,
  commentService,
  surveyService,
  analyticsService,
  reportService
};
