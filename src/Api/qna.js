import api from './auth';

// Q&A Management APIs
export const qnaAPI = {
  // Questions Management
  // Retrieve all questions for a given user type
  getQuestionsByUserType: async (userType) => {
    const response = await api.get(`/qna/questions/${userType}`);
    return response.data;
  },

  // Add a new question to a user type's question set
  addQuestion: async (userType, questionData) => {
    const response = await api.post(`/qna/questions/${userType}`, questionData);
    return response.data;
  },

  // Update an existing question
  updateQuestion: async (userType, questionId, questionData) => {
    const response = await api.put(`/qna/questions/${userType}/${questionId}`, questionData);
    return response.data;
  },

  // Delete a question and remove its answers from all user profiles
  deleteQuestion: async (userType, questionId) => {
    const response = await api.delete(`/qna/questions/${userType}/${questionId}`);
    return response.data;
  },

  // User Profile Answers
  // Retrieve a user's questionnaire answers in human-readable form
  getUserFullProfile: async (userId) => {
    const response = await api.get(`/qna/user/${userId}/fullprofile`);
    return response.data;
  },
};
