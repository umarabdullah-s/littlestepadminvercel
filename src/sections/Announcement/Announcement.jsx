import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import {
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementSummary,
} from "../../api/serviceapi";
import styles from "./Announcement.module.css";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import Skeleton from "@mui/material/Skeleton";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import DeleteAnnouncementModal from "../../components/Modals/DeleteAnnouncementModal";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
const Announcement = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [announcements, setAnnouncements] = useState([]);
 const [announcementDate, setAnnouncementDate] = useState(null);
 const [announcementTime, setAnnouncementTime] = useState(null);
 const [loading, setLoading] = useState(true);
 const [deleteModalOpen, setDeleteModalOpen] = useState(false);
 const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
 const [posting, setPosting] = useState(false);
 const [summary, setSummary] = useState({});
 const [summaryLoading, setSummaryLoading] = useState(true);
 const [isEditMode, setIsEditMode] = useState(false);
 const [editId, setEditId] = useState(null);
 const [openSnackbar, setOpenSnackbar] = useState(false);
 const [snackbarMessage, setSnackbarMessage] = useState("");
 const [snackbarSeverity, setSnackbarSeverity] = useState("success");
 const [deleting, setDeleting] = useState(false);
const validateForm = () => {
  let newErrors = {};

  if (!title.trim()) {
    newErrors.title = "Title is required";
  }

  if (!message.trim()) {
    newErrors.message = "Message is required";
  }

 if (!announcementDate) {
   newErrors.announcementDate = "Date is required";
 }

 if (!announcementTime) {
   newErrors.announcementTime = "Time is required";
 }
  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
const handlePostAnnouncement = async () => {
  if (!validateForm()) return;

  try {
    setPosting(true);

    const dateTime = `${announcementDate.format(
      "YYYY-MM-DD",
    )}T${announcementTime.format("HH:mm:ss")}`;

    const data = {
      title,
      message,
      announcementDate: new Date(dateTime).toISOString(),
    };

    if (isEditMode) {
      await updateAnnouncement(editId, data);
    } else {
      await createAnnouncement(data);
    }

    setTitle("");
    setMessage("");
    setAnnouncementDate(null);
    setAnnouncementTime(null);
    setErrors({});
    setEditId(null);
    setIsEditMode(false);

    await fetchAnnouncement();
    await fetchAnnouncementSummary();
    setSnackbarMessage(
      isEditMode
        ? "Announcement updated successfully"
        : "Announcement posted successfully",
    );
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  } catch (error) {
    console.error(error);

    setSnackbarMessage(error.response?.data?.message || "Something went wrong");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  } finally {
    setPosting(false);
  }
};
const handleCancel = () => {
  setTitle("");
  setMessage("");
  setAnnouncementDate(null);
  setAnnouncementTime(null);
  setErrors({});
  setIsEditMode(false);
  setEditId(null);
};
const fetchAnnouncement = async () => {
  try {
    setLoading(true);

    const response = await getAnnouncement();

    setAnnouncements(response.data.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
const openDeleteModal = (id) => {
  setSelectedAnnouncementId(id);
  setDeleteModalOpen(true);
};

const handleDeleteAnnouncement = async () => {
  try {
    setDeleting(true);
    await deleteAnnouncement(selectedAnnouncementId);

    setDeleteModalOpen(false);
    setSelectedAnnouncementId(null);

    await fetchAnnouncement();
    await fetchAnnouncementSummary();
    setSnackbarMessage("Announcement deleted successfully");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  } catch (error) {
    console.error(error);

    setSnackbarMessage(error.response?.data?.message || "Delete failed");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  } finally {
    setDeleting(false);
  }
};
const fetchAnnouncementSummary = async () => {
  try {
    setSummaryLoading(true);

    const response = await getAnnouncementSummary();
    setSummary(response.data.data);
  } catch (error) {
    console.error(error);
  } finally {
    setSummaryLoading(false);
  }
};
const handleEdit = (item) => {
  setTitle(item.title);
  setMessage(item.message);

  setAnnouncementDate(dayjs(item.announcementDate));
  setAnnouncementTime(dayjs(item.announcementDate));
  setErrors({});
  setEditId(item._id);
  setIsEditMode(true);
};
  useEffect(() => {
    fetchAnnouncement();
    fetchAnnouncementSummary();
  }, []);

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <h5>Total Posted</h5>

              {summaryLoading ? (
                <Skeleton variant="text" width={60} height={50} />
              ) : (
                <h2>{summary.monthlyAnnouncements || "--"}</h2>
              )}

              <p>This Month</p>
            </div>

            <div className={styles.statCard}>
              <h5>This Week</h5>

              {summaryLoading ? (
                <Skeleton variant="text" width={60} height={50} />
              ) : (
                <h2>{summary.weeklyAnnouncements || "--"}</h2>
              )}

              <p>Updates sent</p>
            </div>
          </div>

          <div className={styles.composeCard}>
            <h3 className={styles.composeTitle}>
              <NotesOutlinedIcon className={styles.composeIcon} />
              Compose Announcement
            </h3>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className={styles.dateTimeRow}>
                <div className={styles.formGroup}>
                  <DatePicker
                    label="Select Date"
                    value={announcementDate}
                    onChange={(newValue) => setAnnouncementDate(newValue)}
                    disablePast={!isEditMode}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                  />

                  {errors.announcementDate && (
                    <span className={styles.error}>
                      {errors.announcementDate}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <TimePicker
                    label="Select Time"
                    value={announcementTime}
                    onChange={(newValue) => setAnnouncementTime(newValue)}
                    ampm={true}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                  />

                  {errors.announcementTime && (
                    <span className={styles.error}>
                      {errors.announcementTime}
                    </span>
                  )}
                </div>
              </div>
            </LocalizationProvider>

            <div className={styles.formGroup}>
              <label>Title</label>

              <input
                type="text"
                placeholder="enter title here..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {errors.title && (
                <span className={styles.error}>{errors.title}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Message</label>

              <textarea
                rows="6"
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>

              {errors.message && (
                <span className={styles.error}>{errors.message}</span>
              )}
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.cancelBtn} onClick={handleCancel}>
                Cancel
              </button>
              <button
                className={styles.postBtn}
                onClick={handlePostAnnouncement}
                disabled={posting}
              >
                {posting ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : isEditMode ? (
                  "Update"
                ) : (
                  "Post Now"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.historyCard}>
            <h3 className={styles.historyTitle}>
              <HistoryOutlinedIcon className={styles.historyIcon} />
              Announcement History
            </h3>

            {loading ? (
              [...Array(3)].map((_, index) => (
                <div className={styles.historyItem} key={index}>
                  <Skeleton variant="text" width="60%" height={35} />

                  <Skeleton variant="text" width="35%" height={25} />

                  <Skeleton variant="text" width="100%" height={20} />

                  <Skeleton variant="text" width="90%" height={20} />

                  <Skeleton variant="rounded" width={60} height={25} />
                </div>
              ))
            ) : announcements.length > 0 ? (
              announcements.map((item) => (
                <div className={styles.historyItem} key={item._id}>
                  <div className={styles.historyTop}>
                    <div>
                      <h4>{item.title}</h4>

                      <div className={styles.dateRow}>
                        <CalendarTodayOutlinedIcon
                          className={styles.dateIcon}
                        />

                        <span>
                          {new Date(item.announcementDate).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className={styles.actionIcons}>
                      <EditOutlinedIcon onClick={() => handleEdit(item)} />
                      <DeleteOutlineOutlinedIcon
                        onClick={() => openDeleteModal(item._id)}
                      />
                    </div>
                  </div>

                  <p className={styles.message}>{item.message}</p>

                  <span className={styles.sent}>SENT</span>
                </div>
              ))
            ) : (
              <div className={styles.noData}>
                <img
                  src="/critic_no_found.svg"
                  alt="No announcements found"
                  className={styles.noDataImage}
                />
                <p>No announcements found</p>
              </div>
            )}
          </div>
        </div>
        <DeleteAnnouncementModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteAnnouncement}
          deleting={deleting}
        />
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={Fade}
      >
        <Alert
          severity={snackbarSeverity}
          variant="filled"
          elevation={6}
          sx={{
            backgroundColor: "#ffffff",
            color: "#111827",
            borderRadius: "12px",
            fontWeight: 500,
            minWidth: "280px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default Announcement;
