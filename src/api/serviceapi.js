import apiService from "./apiService";

export const loginStaff = (email, password) => {
  return apiService.post(`/auth/login/admins`, {
    email,
    password,
  });
};

export const getAttendanceSummary = () => {
  return apiService.get("/attendance/summary/admin");
};

export const getAttendanceList = (filter = "", page = 1) => {
  return apiService.get(`/attendance/admin?filter=${filter}&page=${page}`);
};

export const getNotifications = () => {
  return apiService.get("/notifications");
};

export const updateNotification = (id, data) => {
  return apiService.put(`/notifications/${id}`, data);
};

export const getLeaveRequests = (status = "") => {
  return apiService.get(`/leave/admin${status ? `?filter=${status}` : ""}`);
};

export const respondLeaveRequest = (id, data) => {
  return apiService.put(`/leave/${id}/respond`, data);
};

export const getStaffs = () => {
  return apiService.get("/staffs");
};