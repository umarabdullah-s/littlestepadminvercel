import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import MainLayout from "../../components/layouts/MainLayout";
import styles from "./StaffDetails.module.css";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  getStaffById,
  getStaffAttendanceByMonth,
  getStaffAttendanceSummaryById,
  getStaffLeaveById,
  deleteStaff,
  getStaffDocuments,
  downloadDocument,
  deleteDocument,
  uploadFile,
  uploadDocument,
  updateAttendanceByAdmin,
} from "../../api/serviceapi";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Pagination from "@mui/material/Pagination";
import DeleteStaffModal from "../../components/Modals/DeleteStaffModal";
import UploadDocumentModal from "../../components/Modals/UploadDocumentModal";
import EditAttendanceModal from "../../components/Modals/EditAttendanceModal";
import DeleteDocumentModal from "../../components/Modals/DeleteDocumentModal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Skeleton from "@mui/material/Skeleton";

const StaffDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState("attendance");

  const [staff, setStaff] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [attendanceTableSummary, setAttendanceTableSummary] = useState({
    daysPresent: 0,
    daysLeave: 0,
    daysPermission: 0,
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [leaveData, setLeaveData] = useState([]);
  const [leavePage, setLeavePage] = useState(1);
  const [leaveTotalPages, setLeaveTotalPages] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [documentCategory, setDocumentCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const requestsRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [attendancePage, setAttendancePage] = useState(1);
  const [attendanceTotalPages, setAttendanceTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteDocumentOpen, setDeleteDocumentOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [deletingDocument, setDeletingDocument] = useState(false);
  const availableDocuments = documents.filter((doc) => !doc.url);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({
    checkInTime: "",
    breakInTime: "",
    breakOutTime: "",
    checkOutTime: "",
  });

  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [expandedAttendance, setExpandedAttendance] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const tab = location.state?.activeTab;

    if (!tab) return;

    setActiveTab(tab);

    let timer;

    if (tab === "requests") {
      timer = setTimeout(() => {
        requestsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }

    return () => clearTimeout(timer);
  }, [location.state?.activeTab]);

  const fetchAttendanceData = useCallback(async () => {
    try {
      const attendanceTableResponse = await getStaffAttendanceByMonth(
        id,
        selectedMonth,
        selectedYear,
        attendancePage,
      );

      setAttendanceData(attendanceTableResponse.data.data.data);

      setAttendanceTableSummary(
        attendanceTableResponse.data.data.attendanceData || {},
      );

      setAttendanceTotalPages(attendanceTableResponse.data.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  }, [id, selectedMonth, selectedYear, attendancePage]);

  useEffect(() => {
   const fetchStaffDetails = async () => {
     try {
       setProfileLoading(true);

       const [staffResponse, attendanceSummaryResponse, documentResponse] =
         await Promise.all([
           getStaffById(id),
           getStaffAttendanceSummaryById(id),
           getStaffDocuments(id),
         ]);

       setStaff(staffResponse.data.data);
       setAttendanceSummary(attendanceSummaryResponse.data.data);
       setDocuments(documentResponse.data.data);
     } catch (error) {
       console.error(error);
     } finally {
       setProfileLoading(false);
     }
   };

    fetchStaffDetails();
  }, [id]);
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const leaveResponse = await getStaffLeaveById(id, leavePage);

        setLeaveData(leaveResponse.data.data.data);

        setLeaveTotalPages(leaveResponse.data.data.totalPages);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    fetchLeaveData();
  }, [id, leavePage]);
  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);
  const hasCorrectionRequest = attendanceData.some(
    (attendance) => attendance.correctionRequest,
  );

  const handleDeleteStaff = async () => {
    try {
      await deleteStaff(id);

      setDeleteOpen(false);

      navigate("/staff");
    } catch (error) {
      console.log(error);
    }
  };
  const handleDownload = async (doc) => {
    try {
      const response = await downloadDocument(id, doc._id);

      const { url } = response.data.data;

      window.location.href = url;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      setDeletingDocument(true);

      await deleteDocument(id, selectedDocument._id);

      const documentResponse = await getStaffDocuments(id);
      setDocuments(documentResponse.data.data);

      setDeleteDocumentOpen(false);
      setSelectedDocument(null);

      setSnackbar({
        open: true,
        message: "Document deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete document",
        severity: "error",
      });
    } finally {
      setDeletingDocument(false);
    }
  };
  const handleUploadDocument = async () => {
    try {
      setUploadLoading(true);

      const uploadResponse = await uploadFile(selectedFile);

      const fileUrl = uploadResponse.data.data.url;
      console.log({
        type: documentCategory,
        url: fileUrl,
      });
      await uploadDocument(id, {
        type: documentCategory,
        url: fileUrl,
      });

      const documentResponse = await getStaffDocuments(id);
      setDocuments(documentResponse.data.data);

      setOpenUploadModal(false);
      setSelectedFile(null);
      setDocumentCategory("");

      setSnackbar({
        open: true,
        message: "Document uploaded successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to upload document",
        severity: "error",
      });
    } finally {
      setUploadLoading(false);
    }
  };
  const handleUpdateAttendance = async () => {
    try {
      setUpdateLoading(true);

      // Update attendance
      await updateAttendanceByAdmin(selectedAttendanceId, attendanceForm);

      // Refresh table data
      await fetchAttendanceData();
      setAttendanceForm({
        checkInTime: "",
        breakInTime: "",
        breakOutTime: "",
        checkOutTime: "",
      });

      setSelectedAttendanceId(null);
      // Close modal
      setOpenEditModal(false);

      // Success message
      setSnackbar({
        open: true,
        message: "Attendance updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.log(error);

      setSnackbar({
        open: true,
        message: "Failed to update attendance",
        severity: "error",
      });
    } finally {
      setUpdateLoading(false);
    }
  };
  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.profileLeft}>
            <div className={styles.avatar}>
              {profileLoading ? (
                <Skeleton variant="circular" width={120} height={120} />
              ) : (
                <img
                  src={staff?.profileUrl}
                  alt={staff?.name}
                  className={styles.profileImage}
                />
              )}
            </div>

            <div>
              {profileLoading ? (
                <>
                  <Skeleton width={180} height={40} />
                  <Skeleton width={120} height={30} />
                  <Skeleton width={100} height={30} />
                </>
              ) : (
                <>
                  <h2>{staff?.name}</h2>
                  <p>{staff?.role}</p>
                  <p>Staff ID: {staff?.staffId}</p>
                </>
              )}

              <div className={styles.infoRow}>
                <div className={styles.infoItem}>
                  <EmailOutlinedIcon className={styles.infoIcon} />
                  {profileLoading ? (
                    <Skeleton width={180} />
                  ) : (
                    <span>{staff?.email}</span>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <LocalPhoneOutlinedIcon className={styles.infoIcon} />
                  {profileLoading ? (
                    <Skeleton width={120} />
                  ) : (
                    <span>{staff?.phone}</span>
                  )}
                </div>

                <div className={styles.infoItem}>
                  <CalendarMonthOutlinedIcon className={styles.infoIcon} />
                  {profileLoading ? (
                    <Skeleton width={140} />
                  ) : (
                    <span>
                      Joined{" "}
                      {staff?.dateOfJoining
                        ? new Date(staff.dateOfJoining).toLocaleDateString()
                        : "N/A"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              className={styles.editBtn}
              onClick={() => navigate(`/staff/edit/${id}`)}
            >
              Edit Profile
            </button>

            <button
              className={styles.deleteBtn}
              onClick={() => setDeleteOpen(true)}
            >
              Delete Profile
            </button>
          </div>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <h4>Role</h4>

            {profileLoading ? (
              <Skeleton width="80%" height={28} />
            ) : (
              <p>{staff?.role || "N/A"}</p>
            )}
          </div>

          <div className={styles.detailCard}>
            <h4>Work Schedule</h4>
            {profileLoading ? (
              <Skeleton width="80%" height={28} />
            ) : (
              <p>{staff?.workSchedule || "N/A"}</p>
            )}
            {/* <p>{staff?.workSchedule || "N/A"}</p> */}
          </div>

          <div className={styles.detailCard}>
            <h4>Employment Type</h4>
            {profileLoading ? (
              <Skeleton width="80%" height={28} />
            ) : (
              <p>{staff?.employmentType || "N/A"}</p>
            )}
            {/* <p>{staff?.employmentType || "N/A"}</p> */}
          </div>

          <div className={styles.detailCard}>
            <h4>Address</h4>
            {profileLoading ? (
              <Skeleton width="80%" height={28} />
            ) : (
              <p>{staff?.address || "N/A"}</p>
            )}
            {/* <p>{staff?.address || "N/A"}</p> */}
          </div>

          <div className={styles.detailCard}>
            <h4>Emergency Contact</h4>
            {profileLoading ? (
              <Skeleton width="80%" height={28} />
            ) : (
              <p>{staff?.emergencyContact || "N/A"}</p>
            )}
            {/* <p>{staff?.emergencyContact || "N/A"}</p> */}
          </div>

          <div className={styles.detailCard}>
            <h4>Blood Group</h4>
            {profileLoading ? (
              <Skeleton width="80%" height={28} />
            ) : (
              <p>{staff?.bloodGroup || "N/A"}</p>
            )}
            {/* <p>{staff?.bloodGroup || "N/A"}</p> */}
          </div>

          <div className={styles.detailCard}>
            <h4>DOB</h4>
            {profileLoading ? (
              <Skeleton width="80%" height={28} />
            ) : (
              <p>
                {staff?.dateOfBirth
                  ? new Date(staff.dateOfBirth).toLocaleDateString()
                  : "N/A"}
              </p>
            )}
          </div>

          <div className={styles.detailCard}>
            <h4>BANK NAME</h4>
            {profileLoading ? (
              <Skeleton width="80%" height={28} />
            ) : (
              <p>{staff?.bankName || "N/A"}</p>
            )}
            {/* <p>{staff?.bankName || "N/A"}</p> */}
          </div>

          <div className={styles.detailCard}>
            <h4>PAN Number</h4>
            {profileLoading ? (
              <Skeleton width="80%" height={28} />
            ) : (
              <p>{staff?.panNumber || "N/A"}</p>
            )}
            {/* <p>{staff?.panNumber || "N/A"}</p> */}
          </div>

          <div className={styles.detailCard}>
            <h4>IFSC Code</h4>
            {profileLoading ? (
              <Skeleton width="80%" height={28} />
            ) : (
              <p>{staff?.ifscCode || "N/A"}</p>
            )}
            {/* <p>{staff?.ifscCode || "N/A"}</p> */}
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h2>
              {profileLoading ? (
                <Skeleton width={40} height={40} />
              ) : (
                attendanceSummary?.daysPresent || 0
              )}
            </h2>
            <p>Working Days</p>
          </div>

          <div className={styles.statCard}>
            <h2>
              {profileLoading ? (
                <Skeleton width={40} height={40} />
              ) : (
                attendanceSummary?.daysLeave || 0
              )}
            </h2>
            <p>Leave Taken</p>
          </div>

          <div className={styles.statCard}>
            <h2>
              {profileLoading ? (
                <Skeleton width={40} height={40} />
              ) : (
                attendanceSummary?.daysPermission || 0
              )}
            </h2>
            <p>Permissions</p>
          </div>

          <div className={styles.statCard}>
            <h2>
              {profileLoading ? (
                <Skeleton width={40} height={40} />
              ) : (
                attendanceSummary?.daysLate || 0
              )}
            </h2>
            <p>Late</p>
          </div>
        </div>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "attendance" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("attendance")}
          >
            Attendance
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "documents" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("documents")}
          >
            Documents
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "requests" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Requests
          </button>
        </div>

        {activeTab === "documents" && (
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h3>Employee Files</h3>

              <button
                className={styles.uploadBtn}
                disabled={availableDocuments.length === 0}
                onClick={() => {
                  setDocumentCategory("");
                  setSelectedFile(null);
                  setOpenUploadModal(true);
                }}
              >
                Upload New Document
              </button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>DOCUMENT NAME</th>
                  <th>CATEGORY</th>
                  <th>STATUS</th>
                  <th>UPLOAD DATE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {profileLoading ? (
                  [...Array(5)].map((_, index) => (
                    <tr key={index}>
                      <td>
                        <Skeleton variant="text" width={180} height={30} />
                      </td>

                      <td>
                        <Skeleton variant="text" width={120} height={30} />
                      </td>

                      <td>
                        <Skeleton
                          variant="rounded"
                          width={90}
                          height={30}
                          sx={{ borderRadius: "20px" }}
                        />
                      </td>

                      <td>
                        <Skeleton variant="text" width={100} height={30} />
                      </td>

                      <td>
                        <div className={styles.actionIcons}>
                          <Skeleton variant="circular" width={30} height={30} />
                          <Skeleton variant="circular" width={30} height={30} />
                          <Skeleton variant="circular" width={30} height={30} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <tr key={doc._id || index}>
                      <td>{doc.label}</td>

                      <td>{doc.category}</td>

                      <td>
                        <span
                          className={
                            doc.status === "verified"
                              ? styles.verified
                              : styles.pending
                          }
                        >
                          {doc.status?.toUpperCase()}
                        </span>
                      </td>

                      <td>
                        {doc.uploadedDate
                          ? new Date(doc.uploadedDate).toLocaleDateString()
                          : "--"}
                      </td>

                      <td>
                        {doc.url ? (
                          <div className={styles.actionIcons}>
                            <VisibilityOutlinedIcon
                              className={styles.actionIcon}
                              onClick={() => window.open(doc.url, "_blank")}
                            />

                            <DownloadOutlinedIcon
                              className={styles.actionIcon}
                              onClick={() => handleDownload(doc)}
                            />

                            <DeleteOutlineOutlinedIcon
                              className={styles.actionIcon}
                              onClick={() => {
                                setSelectedDocument(doc);
                                setDeleteDocumentOpen(true);
                              }}
                            />
                          </div>
                        ) : (
                          <button
                            className={styles.uploadSmallBtn}
                            onClick={() => {
                              setDocumentCategory(doc.type);
                              setOpenUploadModal(true);
                            }}
                          >
                            Upload
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className={styles.noData}>
                        <img
                          src="/critic_no_found.svg"
                          alt="No Documents Found"
                        />
                        <p>No Documents Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "attendance" && (
          <div className={styles.attendanceContainer}>
            <div className={styles.attendanceStats}>
              <div className={styles.attendanceCard}>
                <h2>{attendanceTableSummary?.daysLeave || 0}</h2>
                <h4>Leave</h4>
                <p>This Month</p>
              </div>

              <div className={styles.attendanceCard}>
                <h2>{attendanceTableSummary?.daysPermission || 0}</h2>
                <h4>Permission</h4>
                <p> This Month</p>
              </div>

              <div className={styles.attendanceCard}>
                <h2>{attendanceTableSummary?.daysPresent || 0}</h2>
                <h4>Checked In</h4>
                <p> This Month</p>
              </div>
            </div>

            <div className={styles.attendanceHeader}>
              <h3>Staff Attendance</h3>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  label="Month & Year"
                  value={selectedDate}
                  onChange={(newValue) => {
                    if (!newValue) return;

                    setSelectedDate(newValue);
                    setSelectedMonth(newValue.month() + 1);
                    setSelectedYear(newValue.year());
                    setAttendancePage(1);
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>TOTAL HOURS</th>
                  <th>CHECK-IN</th>
                  <th>CHECK-OUT</th>
                  <th>STATUS</th>

                  {hasCorrectionRequest && <th>ACTION</th>}

                  <th>
                    <PhotoCameraIcon />
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.length > 0 ? (
                  attendanceData.map((attendance) => (
                    <React.Fragment key={attendance._id || attendance.date}>
                      <tr>
                        <td>{attendance.date}</td>

                        <td>{attendance.totalHours || "--"}</td>

                        <td>{attendance.checkInTime || "--"}</td>

                        <td>{attendance.checkOutTime || "--"}</td>

                        <td>
                          <span
                            className={
                              attendance.status?.toLowerCase() === "checked in"
                                ? styles.checkedIn
                                : attendance.status?.toLowerCase() ===
                                    "checked out"
                                  ? styles.checkedOut
                                  : styles.onLeave
                            }
                          >
                            {attendance.status}
                          </span>
                        </td>

                        {hasCorrectionRequest && (
                          <td>
                            {attendance.correctionRequest ? (
                              <button
                                className={styles.editAttendanceBtn}
                                onClick={() => {
                                  setSelectedAttendanceId(attendance._id);

                                  setAttendanceForm({
                                    checkInTime: attendance.checkInTime || "",
                                    breakInTime: attendance.breakInTime || "",
                                    breakOutTime: attendance.breakOutTime || "",
                                    checkOutTime: attendance.checkOutTime || "",
                                  });

                                  setOpenEditModal(true);
                                }}
                              >
                                Edit Attendance
                              </button>
                            ) : (
                              "--"
                            )}
                          </td>
                        )}

                        <td>
                          {attendance.imageUrl && (
                            <button
                              className={styles.expandBtn}
                              onClick={() =>
                                setExpandedAttendance(
                                  expandedAttendance === attendance._id
                                    ? null
                                    : attendance._id,
                                )
                              }
                            >
                              <ExpandMoreIcon
                                style={{
                                  transform:
                                    expandedAttendance === attendance._id
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.4s ease",
                                }}
                              />
                            </button>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td
                          colSpan={hasCorrectionRequest ? 7 : 6}
                          style={{ padding: 0, border: "none" }}
                        >
                          <Collapse
                            in={expandedAttendance === attendance._id}
                            timeout={500}
                            unmountOnExit
                          >
                            <div className={styles.expandedCard}>
                              <div className={styles.fullImageWrapper}>
                                <img
                                  src={attendance.imageUrl}
                                  alt="Attendance"
                                  className={styles.fullImage}
                                />
                              </div>
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className={styles.noData}>
                        <img
                          src="/critic_no_found.svg"
                          alt="No Attendance Found"
                        />
                        <p>No Attendance Records Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {attendanceData.length > 0 && (
              <div className={styles.paginationWrapper}>
                <Pagination
                  count={attendanceTotalPages}
                  page={attendancePage}
                  shape="rounded"
                  onChange={(event, value) => {
                    setAttendancePage(value);
                  }}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#2F64E1 !important",
                      color: "#fff",
                      borderRadius: "12px",
                    },
                    "& .MuiPaginationItem-root:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "requests" && (
          <div ref={requestsRef} className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>TYPE</th>
                  <th>DURATION </th>
                  <th>REASON</th>
                  <th>APPLIED ON</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {leaveData.length > 0 ? (
                  leaveData.map((leave) => (
                    <tr key={leave._id}>
                      <td>
                        <strong>{leave.leaveType}</strong>
                      </td>

                      <td>
                        {leave.period || "--"}
                        {leave.duration && (
                          <span style={{ color: "#64748b", fontSize: "12px" }}>
                            {" "}
                            ({leave.duration})
                          </span>
                        )}
                      </td>

                      <td>{leave.reason || "--"}</td>

                      <td>
                        {leave.requestedOn
                          ? new Date(leave.requestedOn).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "--"}
                      </td>

                      <td>
                        <span
                          className={
                            leave.status?.toLowerCase() === "approved"
                              ? styles.approved
                              : leave.status?.toLowerCase() === "rejected"
                                ? styles.declined
                                : styles.pending
                          }
                        >
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className={styles.noData}>
                        <img
                          src="/critic_no_found.svg"
                          alt="No Requests Found"
                        />
                        <p>No Requests Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {leaveData.length > 0 && (
              <div className={styles.paginationWrapper}>
                <Pagination
                  count={leaveTotalPages}
                  page={leavePage}
                  shape="rounded"
                  onChange={(event, value) => {
                    setLeavePage(value);
                  }}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#2F64E1 !important",
                      color: "#fff",
                      borderRadius: "12px",
                    },
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <UploadDocumentModal
        open={openUploadModal}
        handleClose={() => {
          setOpenUploadModal(false);
          setSelectedFile(null);
          setDocumentCategory("");
        }}
        category={documentCategory}
        setCategory={setDocumentCategory}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        documents={documents}
        onUpload={handleUploadDocument}
        uploadLoading={uploadLoading}
      />
      <DeleteStaffModal
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        handleDelete={handleDeleteStaff}
      />
      <DeleteDocumentModal
        open={deleteDocumentOpen}
        handleClose={() => {
          setDeleteDocumentOpen(false);
          setSelectedDocument(null);
        }}
        handleDelete={handleDeleteDocument}
        deleting={deletingDocument}
      />
      <EditAttendanceModal
        open={openEditModal}
        handleClose={() => setOpenEditModal(false)}
        attendanceData={attendanceForm}
        setAttendanceData={setAttendanceForm}
        onUpdate={handleUpdateAttendance}
        updateLoading={updateLoading}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={Fade}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
          sx={{
            backgroundColor: "#ffffff",
            color: "#111827",
            borderRadius: "12px",
            fontWeight: 500,
            minWidth: "260px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default StaffDetails;
