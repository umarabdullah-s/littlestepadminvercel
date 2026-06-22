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

export const getStaffs = (page = 1, search = "",filter="") => {
  return apiService.get(
    `/staffs?page=${page}${search ? `&search=${search}` : ""}${filter ? `&filter=${filter}` : ""}`,
  );
};

export const getStaffById = (id) => {
  return apiService.get(`/staffs/${id}`);
};

export const createStaff = (data) => {
  return apiService.post("/staffs", data);
};export const deleteStaff = (id) => {
  return apiService.delete(`/staffs/${id}`);
};

export const updateStaff = (id, data) => {
  return apiService.put(`/staffs/${id}`, data);
};

export const getStaffDocuments = (staffId) => {
  return apiService.get(`/document/${staffId}`);
};
export const downloadDocument = (staffId, documentId) => {
  return apiService.get(`/document/${staffId}/${documentId}/download`);
};
export const deleteDocument = (staffId, documentId) => {
  return apiService.delete(`/document/${staffId}/${documentId}`);
};

export const uploadDocument = (staffId, fileData) => {
  return apiService.post(`/document/${staffId}`, {
    type: fileData.type,
    url: fileData.url,
  });
};
export const uploadFile = (file) => {            
  const formData = new FormData();
  formData.append("file", file);

  return apiService.post("/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
                       
export const getStaffAttendanceSummaryById = (id) => {
  return apiService.get(`/attendance/summary/${id}`);
};

export const getStaffAttendanceByMonth = (id, month, year, page = 1) => {
  return apiService.get(
    `/attendance/me/${id}?month=${month}&year=${year}&page=${page}`,
  );
};

export const getStaffLeaveById = (id, page = 1) => {
  return apiService.get(`/leave/me/${id}?page=${page}`);
};

export const getAnnouncement = () => {
  return apiService.get("/announcement");
};

export const createAnnouncement = (data) => {
  return apiService.post("/announcement", data);
};

export const deleteAnnouncement = (id) => {
  return apiService.delete(`/announcement/${id}`);
};

export const getAnnouncementSummary = () => {
  return apiService.get("/announcement/summary");
};

export const updateAnnouncement = (id, data) => {
  return apiService.put(`/announcement/${id}`, data);
};