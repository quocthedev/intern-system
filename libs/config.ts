export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://intern-system-amazing-tech.azurewebsites.net/api";

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/signin`,
  requestResetPassword: `${API_BASE_URL}/user/request-password-reset`,
  resetPassword: `${API_BASE_URL}/user/reset-password`,
  googleLogin: `${API_BASE_URL}/auth/signin-google`,
  project: `${API_BASE_URL}/project`,
  candidate: `${API_BASE_URL}/candidate`,
  university: `${API_BASE_URL}/university`,
  internPeriod: `${API_BASE_URL}/intern-period`,
  position: `${API_BASE_URL}/position`,
  technology: `${API_BASE_URL}/technology`,
  sendEmail: `${API_BASE_URL}/mail/multi-recipients`,
  responseEmail: `${API_BASE_URL}/mail/response`,
  interviewQuestion: `${API_BASE_URL}/interview-question`,
  candidateUser: `${API_BASE_URL}/user/candidate`,
  task: `${API_BASE_URL}/task-info`,
  user: `${API_BASE_URL}/user`,
  interviewSchedule: `${API_BASE_URL}/interview-schedule`,
  questionTemplate: `${API_BASE_URL}/question-template`,
  internshipReport: `${API_BASE_URL}/internship-report`,
  statistic: `${API_BASE_URL}/statistics`,
  role: `${API_BASE_URL}/role`,
  rank: `${API_BASE_URL}/rank`,
};
