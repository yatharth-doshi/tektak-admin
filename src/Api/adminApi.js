import axios from 'axios';

// Fallback to live server if environment variable is not set
const BASE_URL = process.env.REACT_APP_BACK_URL || 'http://3.231.197.106:5000';

if (!process.env.REACT_APP_BACK_URL) {
  console.warn('REACT_APP_BACK_URL is not set. Using default: http://3.231.197.106:5000');
}

// Helper function to get auth token from cookies
const getAuthToken = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'teqtak-admin-token') {
      return value;
    }
  }
  return null;
};

// Create axios instance with default config
const api = axios.create({
  baseURL: `${BASE_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// 1. USER MANAGEMENT ENDPOINTS
// ============================================

// Get all registered users
export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/allusers');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// Get all users with role: viewer
export const fetchViewers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching viewers:', error);
    throw error;
  }
};

// Get all users with role: investor
export const fetchInvestors = async () => {
  try {
    const response = await api.get('/investors');
    return response.data;
  } catch (error) {
    console.error('Error fetching investors:', error);
    throw error;
  }
};

// Get all users with role: entrepreneur
export const fetchEntrepreneurs = async () => {
  try {
    const response = await api.get('/entrepreneur');
    return response.data;
  } catch (error) {
    console.error('Error fetching entrepreneurs:', error);
    throw error;
  }
};

// Get all blocked users
export const fetchBlockedUsers = async () => {
  try {
    const response = await api.get('/blocked');
    return response.data;
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    throw error;
  }
};

// ============================================
// 2. DASHBOARD ANALYTICS ENDPOINTS
// ============================================

// Analytics for total user registrations
export const fetchUserAnalytics = async () => {
  try {
    const response = await api.get('/info/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    throw error;
  }
};

// Analytics for viewer registrations
export const fetchViewerAnalytics = async () => {
  try {
    const response = await api.get('/info/viewers');
    return response.data;
  } catch (error) {
    console.error('Error fetching viewer analytics:', error);
    throw error;
  }
};

// Analytics for investor registrations
export const fetchInvestorAnalytics = async () => {
  try {
    const response = await api.get('/info/investors');
    return response.data;
  } catch (error) {
    console.error('Error fetching investor analytics:', error);
    throw error;
  }
};

// Analytics for entrepreneur registrations
export const fetchEntrepreneurAnalytics = async () => {
  try {
    const response = await api.get('/info/entrepreneur');
    return response.data;
  } catch (error) {
    console.error('Error fetching entrepreneur analytics:', error);
    throw error;
  }
};

// Analytics for support/help tickets
export const fetchTicketAnalytics = async () => {
  try {
    const response = await api.get('/info/tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket analytics:', error);
    throw error;
  }
};

// Analytics for job postings
export const fetchJobAnalytics = async () => {
  try {
    const response = await api.get('/info/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching job analytics:', error);
    throw error;
  }
};

// Analytics for scheduled events
export const fetchEventAnalytics = async () => {
  try {
    const response = await api.get('/info/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching event analytics:', error);
    throw error;
  }
};

// Analytics for uploaded podcasts
export const fetchPodcastAnalytics = async () => {
  try {
    const response = await api.get('/info/podcasts');
    return response.data;
  } catch (error) {
    console.error('Error fetching podcast analytics:', error);
    throw error;
  }
};

// Analytics for uploaded videos
export const fetchVideoAnalytics = async () => {
  try {
    const response = await api.get('/info/videos');
    return response.data;
  } catch (error) {
    console.error('Error fetching video analytics:', error);
    throw error;
  }
};

// ============================================
// 3. ADMIN & SUB-ADMIN CONTROL ENDPOINTS
// ============================================

// Admin/Sub-Admin authentication
export const adminLogin = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error during admin login:', error);
    throw error;
  }
};

// Get current logged-in admin info
export const fetchAdminProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};

// Update admin profile details
export const updateAdminProfile = async (profileData) => {
  try {
    const response = await api.post('/profile/update', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating admin profile:', error);
    throw error;
  }
};

// List all sub-admin accounts
export const fetchSubAdmins = async () => {
  try {
    const response = await api.get('/subadmin');
    return response.data;
  } catch (error) {
    console.error('Error fetching sub-admins:', error);
    throw error;
  }
};

// Create a new sub-admin account
export const createSubAdmin = async (subAdminData) => {
  try {
    const response = await api.post('/subadmin', subAdminData);
    return response.data;
  } catch (error) {
    console.error('Error creating sub-admin:', error);
    throw error;
  }
};

// Remove a sub-admin by ID
export const deleteSubAdmin = async (id) => {
  try {
    const response = await api.delete(`/subadmin/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sub-admin:', error);
    throw error;
  }
};

// ============================================
// 4. SYSTEM NOTIFICATIONS ENDPOINT
// ============================================

// Retrieve all system-wide notifications
export const fetchNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// ============================================
// 5. JOBS CRUD ENDPOINTS
// ============================================

// Get all jobs
export const fetchAllJobs = async () => {
  try {
    const response = await api.get('/jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Get single job by ID
export const fetchJobById = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

// Create new job
export const createJob = async (jobData) => {
  try {
    const response = await api.post('/jobs', jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Update job by ID
export const updateJob = async (jobId, jobData) => {
  try {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// Delete job by ID
export const deleteJob = async (jobId) => {
  try {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// Toggle job activation status
export const toggleJobActivation = async (jobId, isActivated) => {
  try {
    const response = await api.put(`/jobs/${jobId}`, { isActivated });
    return response.data;
  } catch (error) {
    console.error('Error toggling job activation:', error);
    throw error;
  }
};

// ============================================
// 6. EVENTS CRUD ENDPOINTS
// ============================================

// Get all events
export const fetchAllEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get single event by ID
export const fetchEventById = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

// Create new event
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update event by ID
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete event by ID
export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Toggle event activation status
export const toggleEventActivation = async (eventId, isActivated) => {
  try {
    const response = await api.put(`/events/${eventId}`, { isActivated });
    return response.data;
  } catch (error) {
    console.error('Error toggling event activation:', error);
    throw error;
  }
};

// ============================================
// 7. PODCASTS CRUD ENDPOINTS
// ============================================

// Get all podcasts
export const fetchAllPodcasts = async () => {
  try {
    const response = await api.get('/podcasts');
    return response.data;
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw error;
  }
};

// Get single podcast by ID
export const fetchPodcastById = async (podcastId) => {
  try {
    const response = await api.get(`/podcasts/${podcastId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching podcast:', error);
    throw error;
  }
};

// Create new podcast
export const createPodcast = async (podcastData) => {
  try {
    const response = await api.post('/podcasts', podcastData);
    return response.data;
  } catch (error) {
    console.error('Error creating podcast:', error);
    throw error;
  }
};

// Update podcast by ID
export const updatePodcast = async (podcastId, podcastData) => {
  try {
    const response = await api.put(`/podcasts/${podcastId}`, podcastData);
    return response.data;
  } catch (error) {
    console.error('Error updating podcast:', error);
    throw error;
  }
};

// Delete podcast by ID
export const deletePodcast = async (podcastId) => {
  try {
    const response = await api.delete(`/podcasts/${podcastId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting podcast:', error);
    throw error;
  }
};

// ============================================
// 8. VIDEOS CRUD ENDPOINTS
// ============================================

// Get all videos
export const fetchAllVideos = async () => {
  try {
    const response = await api.get('/videos');
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

// Get single video by ID
export const fetchVideoById = async (videoId) => {
  try {
    const response = await api.get(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
};

// Create new video
export const createVideo = async (videoData) => {
  try {
    const response = await api.post('/videos', videoData);
    return response.data;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

// Update video by ID
export const updateVideo = async (videoId, videoData) => {
  try {
    const response = await api.put(`/videos/${videoId}`, videoData);
    return response.data;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

// Delete video by ID
export const deleteVideo = async (videoId) => {
  try {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

// ============================================
// 9. TICKETS CRUD ENDPOINTS
// ============================================

// Get all tickets
export const fetchAllTickets = async () => {
  try {
    const response = await api.get('/tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

// Get single ticket by ID
export const fetchTicketById = async (ticketId) => {
  try {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
};

// Get tickets by event
export const fetchTicketsByEvent = async (eventId) => {
  try {
    const response = await api.get(`/tickets/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets by event:', error);
    throw error;
  }
};

// Create new ticket
export const createTicket = async (ticketData) => {
  try {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

// Update ticket by ID
export const updateTicket = async (ticketId, ticketData) => {
  try {
    const response = await api.put(`/tickets/${ticketId}`, ticketData);
    return response.data;
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

// Delete ticket by ID
export const deleteTicket = async (ticketId) => {
  try {
    const response = await api.delete(`/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};

// ============================================
// 10. USER MANAGEMENT CRUD ENDPOINTS
// ============================================

// Get user by ID
export const fetchUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Update user (block/unblock)
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.post(`/users/update/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Block user
export const blockUser = async (userId) => {
  try {
    const response = await api.post(`/users/update/${userId}`, { isBlocked: "true" });
    return response.data;
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

// Unblock user
export const unblockUser = async (userId) => {
  try {
    const response = await api.post(`/users/update/${userId}`, { isBlocked: "false" });
    return response.data;
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
};

// Delete user by ID
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// ============================================
// 11. MEETINGS CRUD ENDPOINTS
// ============================================

// Get all meetings
export const fetchAllMeetings = async () => {
  try {
    const response = await api.get('/meetings');
    return response.data;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
};

// Get single meeting by ID
export const fetchMeetingById = async (meetingId) => {
  try {
    const response = await api.get(`/meetings/${meetingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meeting:', error);
    throw error;
  }
};

// Create new meeting
export const createMeeting = async (meetingData) => {
  try {
    const response = await api.post('/meetings', meetingData);
    return response.data;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};

// Update meeting by ID
export const updateMeeting = async (meetingId, meetingData) => {
  try {
    const response = await api.put(`/meetings/${meetingId}`, meetingData);
    return response.data;
  } catch (error) {
    console.error('Error updating meeting:', error);
    throw error;
  }
};

// Delete meeting by ID
export const deleteMeeting = async (meetingId) => {
  try {
    const response = await api.delete(`/meetings/${meetingId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting meeting:', error);
    throw error;
  }
};

// ============================================
// 12. PAYMENT REQUESTS ENDPOINTS
// ============================================

// Get all payment requests
export const fetchPaymentRequests = async () => {
  try {
    const response = await api.get('/payreq');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment requests:', error);
    throw error;
  }
};

// Get payment request by ID
export const fetchPaymentRequestById = async (reqId) => {
  try {
    const response = await api.get(`/payreq/${reqId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment request:', error);
    throw error;
  }
};

// Create payment request
export const createPaymentRequest = async (paymentData) => {
  try {
    const response = await api.post('/payreq', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment request:', error);
    throw error;
  }
};

// Update payment request status
export const updatePaymentRequest = async (reqId, status) => {
  try {
    const response = await api.put(`/payreq/${reqId}`, { requestStatus: status });
    return response.data;
  } catch (error) {
    console.error('Error updating payment request:', error);
    throw error;
  }
};

// Approve payment request
export const approvePaymentRequest = async (reqId) => {
  try {
    const response = await api.put(`/payreq/${reqId}`, { requestStatus: 'approve' });
    return response.data;
  } catch (error) {
    console.error('Error approving payment request:', error);
    throw error;
  }
};

// Decline payment request
export const declinePaymentRequest = async (reqId) => {
  try {
    const response = await api.put(`/payreq/${reqId}`, { requestStatus: 'decline' });
    return response.data;
  } catch (error) {
    console.error('Error declining payment request:', error);
    throw error;
  }
};

// Process payment request
export const processPaymentRequest = async (reqId) => {
  try {
    const response = await api.put(`/payreq/${reqId}`, { requestStatus: 'process' });
    return response.data;
  } catch (error) {
    console.error('Error processing payment request:', error);
    throw error;
  }
};

// Delete payment request
export const deletePaymentRequest = async (reqId) => {
  try {
    const response = await api.delete(`/payreq/${reqId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting payment request:', error);
    throw error;
  }
};

// ============================================
// 13. REPORTS ENDPOINTS
// ============================================

// Get all reports
export const fetchAllReports = async () => {
  try {
    const response = await api.get('/reports');
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

// Get report by ID
export const fetchReportById = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

// Create new report
export const createReport = async (reportData) => {
  try {
    const response = await api.post('/reports', reportData);
    return response.data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

// Update report by ID
export const updateReport = async (reportId, reportData) => {
  try {
    const response = await api.put(`/reports/${reportId}`, reportData);
    return response.data;
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
};

// Delete report by ID
export const deleteReport = async (reportId) => {
  try {
    const response = await api.delete(`/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
};

// Resolve report
export const resolveReport = async (reportId) => {
  try {
    const response = await api.put(`/reports/${reportId}`, { status: 'resolved' });
    return response.data;
  } catch (error) {
    console.error('Error resolving report:', error);
    throw error;
  }
};

// ============================================
// 14. QNA/QUESTIONS ENDPOINTS
// ============================================

// Get all questions
export const fetchAllQuestions = async () => {
  try {
    const response = await api.get('/qna/ques');
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// Get question by ID
export const fetchQuestionById = async (questionId) => {
  try {
    const response = await api.get(`/qna/ques/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
};

// Create new question
export const createQuestion = async (questionData) => {
  try {
    const response = await api.post('/qna/ques', questionData);
    return response.data;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

// Update question by ID
export const updateQuestion = async (questionId, questionData) => {
  try {
    const response = await api.put(`/qna/ques/${questionId}`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

// Delete question by ID
export const deleteQuestion = async (questionId) => {
  try {
    const response = await api.delete(`/qna/ques/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

// ============================================
// 15. NOTIFICATIONS CRUD ENDPOINTS
// ============================================

// Create new notification
export const createNotification = async (notificationData) => {
  try {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get notification by ID
export const fetchNotificationById = async (notificationId) => {
  try {
    const response = await api.get(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notification:', error);
    throw error;
  }
};

// Update notification by ID
export const updateNotification = async (notificationId, notificationData) => {
  try {
    const response = await api.put(`/notifications/${notificationId}`, notificationData);
    return response.data;
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};

// Delete notification by ID
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}`, { isRead: true });
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Helper to extract analytics counts
export const getAnalyticsCounts = (analyticsData) => {
  return {
    daily: analyticsData?.count?.daily || 0,
    weekly: analyticsData?.count?.weekly || 0,
    monthly: analyticsData?.count?.monthly || 0,
  };
};

// Helper to extract analytics data arrays
export const getAnalyticsData = (analyticsData) => {
  return {
    todayData: analyticsData?.todayData || [],
    weekData: analyticsData?.weekData || [],
    monthData: analyticsData?.monthData || [],
  };
};

export default api;
