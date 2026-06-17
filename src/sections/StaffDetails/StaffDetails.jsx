import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  getStaffAttendanceSummaryById,
  getStaffAttendanceByMonth,
  getStaffLeaveById,
  deleteStaff,
} from "../../api/serviceapi";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Pagination from "@mui/material/Pagination";
import DeleteStaffModal from "../../components/Modals/DeleteStaffModal";
import UploadDocumentModal from "../../components/Modals/UploadDocumentModal";

const StaffDetails = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [leaveData, setLeaveData] = useState([]);
  const [leavePage, setLeavePage] = useState(1);
  const [leaveTotalPages, setLeaveTotalPages] = useState(1);
  const [attendancePage, setAttendancePage] = useState(1);
  const [attendanceTotalPages, setAttendanceTotalPages] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [documentCategory, setDocumentCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

 useEffect(() => {
   const fetchStaff = async () => {
     try {
       const response = await getStaffById(id);
       setStaff(response.data.data);

       const attendanceResponse = await getStaffAttendanceSummaryById(id);

       setAttendanceSummary(attendanceResponse.data.data);

       const attendanceTableResponse = await getStaffAttendanceByMonth(
         id,
         selectedMonth,
         selectedYear,
         attendancePage,
       );
       console.log(attendanceTableResponse.data);
       setAttendanceData(attendanceTableResponse.data.data.data);
       setAttendanceTotalPages(attendanceTableResponse.data.data.totalPages);
       const leaveResponse = await getStaffLeaveById(id, leavePage);

       setLeaveData(leaveResponse.data.data.data);
       setLeaveTotalPages(leaveResponse.data.data.totalPages);
     } catch (error) {
       console.error("Error fetching data:", error);
     }
   };

   fetchStaff();
 }, [id, selectedMonth, selectedYear, attendancePage, leavePage]);
 const handleDeleteStaff = async () => {
   try {
     await deleteStaff(id);

     setDeleteOpen(false);

     navigate("/staff");
   } catch (error) {
     console.log(error);
    
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
              <img
                src={staff?.profileUrl}
                alt={staff?.name}
                className={styles.profileImage}
              />
            </div>

            <div>
              <h2>{staff?.name}</h2>

              <p>{staff?.role}</p>

              <p>Staff ID: {staff?.staffId}</p>

              <div className={styles.infoRow}>
                <div className={styles.infoItem}>
                  <EmailOutlinedIcon className={styles.infoIcon} />
                  <span>{staff?.email}</span>
                </div>

                <div className={styles.infoItem}>
                  <LocalPhoneOutlinedIcon className={styles.infoIcon} />
                  <span>{staff?.phone}</span>
                </div>

                <div className={styles.infoItem}>
                  <CalendarMonthOutlinedIcon className={styles.infoIcon} />
                  <span>
                    Joined{" "}
                    {staff?.dateOfJoining
                      ? new Date(staff.dateOfJoining).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className={styles.editBtn}
              onClick={() => navigate(`/staff/edit/${id}`)}
            >
              Edit Profile
            </button>

            <button
              onClick={() => setDeleteOpen(true)}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Delete Profile
            </button>
          </div>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <h4>Role</h4>
            <p>{staff?.role || "N/A"}</p>
          </div>

          <div className={styles.detailCard}>
            <h4>Work Schedule</h4>
            <p>{staff?.workSchedule || "N/A"}</p>
          </div>

          <div className={styles.detailCard}>
            <h4>Employment Type</h4>
            <p>{staff?.employmentType || "N/A"}</p>
          </div>

          <div className={styles.detailCard}>
            <h4>Address</h4>
            <p>{staff?.address || "N/A"}</p>
          </div>

          <div className={styles.detailCard}>
            <h4>Emergency Contact</h4>
            <p>{staff?.emergencyContact || "N/A"}</p>
          </div>

          <div className={styles.detailCard}>
            <h4>Blood Group</h4>
            <p>{staff?.bloodGroup || "N/A"}</p>
          </div>

          <div className={styles.detailCard}>
            <h4>DOB</h4>
            <p>
              {staff?.dateOfBirth
                ? new Date(staff.dateOfBirth).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          <div className={styles.detailCard}>
            <h4>Payment Mode</h4>
            <p>{staff?.paymentMode || "N/A"}</p>
          </div>

          <div className={styles.detailCard}>
            <h4>PAN Number</h4>
            <p>{staff?.panNumber || "N/A"}</p>
          </div>

          <div className={styles.detailCard}>
            <h4>IFSC Code</h4>
            <p>{staff?.ifscCode || "N/A"}</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h2>{attendanceSummary?.daysPresent || 0}</h2>
            <p>Working Days</p>
          </div>

          <div className={styles.statCard}>
            <h2>{attendanceSummary?.daysLeave || 0}</h2>
            <p>Leave Taken</p>
          </div>

          <div className={styles.statCard}>
            <h2>{attendanceSummary?.daysPermission || 0}</h2>
            <p>Permissions</p>
          </div>

          <div className={styles.statCard}>
            <h2>{attendanceSummary?.daysLate || 0}</h2>
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
                onClick={() => setOpenUploadModal(true)}
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
                <tr>
                  <td>Aadhar.pdf</td>
                  <td>Identity Proof</td>
                  <td>
                    <span className={styles.verified}>VERIFIED</span>
                  </td>
                  <td>12 Jun 2025</td>
                  <td>
                    <div className={styles.actionIcons}>
                      <VisibilityOutlinedIcon className={styles.actionIcon} />

                      <DownloadOutlinedIcon className={styles.actionIcon} />

                      <DeleteOutlineOutlinedIcon
                        className={styles.actionIcon}
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>PAN Card.pdf</td>
                  <td>Identity Proof</td>
                  <td>
                    <span className={styles.pending}>PENDING</span>
                  </td>
                  <td>--</td>
                  <td>
                    <button className={styles.uploadSmallBtn}>Upload</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "attendance" && (
          <div className={styles.attendanceContainer}>
            <div className={styles.attendanceStats}>
              <div className={styles.attendanceCard}>
                <h2>{attendanceSummary?.daysLeave || 0}</h2>
                <h4>Leave</h4>
                <p>This Month</p>
              </div>

              <div className={styles.attendanceCard}>
                <h2>{attendanceSummary?.daysPermission || 0}</h2>
                <h4>Permission</h4>
                <p> This Month</p>
              </div>

              <div className={styles.attendanceCard}>
                <h2>{attendanceSummary?.daysPresent || 0}</h2>
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
                    setSelectedDate(newValue);

                    setSelectedMonth(newValue.month() + 1);
                    setSelectedYear(newValue.year());
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
                </tr>
              </thead>

              <tbody>
                {attendanceData.length > 0 ? (
                  attendanceData.map((attendance) => (
                    <tr key={attendance._id}>
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
                    </tr>
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
          </div>
        )}

        {activeTab === "requests" && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>TYPE</th>
                  <th>DATE</th>
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

                      <td>{leave.period || "--"}</td>

                      <td>{leave.reason || "--"}</td>

                      <td>{leave.requestedOn || "--"}</td>

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

                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
      <UploadDocumentModal
        open={openUploadModal}
        handleClose={() => setOpenUploadModal(false)}
        // handleUpload={handleDocumentUpload}
        category={documentCategory}
        setCategory={setDocumentCategory}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
      <DeleteStaffModal
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        handleDelete={handleDeleteStaff}
      />
    </MainLayout>
  );
};

export default StaffDetails;
