import React, { useEffect, useState } from "react";

import MainLayout from "../../components/layouts/MainLayout";

import styles from "./Dashboard.module.css";
import {
  getAttendanceSummary,
  getAttendanceList,
} from "../../api/serviceapi";
import Skeleton from "@mui/material/Skeleton";
import Pagination from "@mui/material/Pagination";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Avatar from "@mui/material/Avatar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Collapse from "@mui/material/Collapse";


const Dashboard = () => {
  const [summary, setSummary] = useState({
    checkedInStaffs: 0,
    onLeaveStaffs: 0,
    checkedOutStaffs: 0,
    onPermissionStaffs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [staffData, setStaffData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);
 useEffect(() => {
   fetchAttendanceSummary();
   fetchAttendanceList();
 }, []);
 const fetchAttendanceSummary = async () => {
   try {
     setLoading(true);

     const response = await getAttendanceSummary();

     setSummary(response.data.data);
   } catch (error) {
     console.log(error);
   } finally {
     setLoading(false);
   }
 };
const fetchAttendanceList = async (filter = "", currentPage = 1) => {
  try {
    setTableLoading(true);

    const response = await getAttendanceList(filter, currentPage);

    setStaffData(response.data.data.data);

    setPage(response.data.data.currentPage);
    setTotalPages(response.data.data.totalPages);
  } catch (error) {
    console.log(error);
  } finally {
    setTableLoading(false);
  }
};

  const stats = [
    {
      id: 1,
      count: summary.totalStaffs,
      title: "Total Staff",
      subtitle: "registered employees",
    },
    {
      id: 2,
      count: summary.checkedInStaffs,
      title: "Checked In",
      subtitle: "present today",
    },
    {
      id: 3,
      count: summary.notCheckedInStaffs,
      title: "Not Checked In",
      subtitle: "awaiting check-in",
    },
    {
      id: 4,
      count: summary.onPermissionStaffs,
      title: "On Permission",
      subtitle: "temporary absence",
    },
    {
      id: 5,
      count: summary.onLeaveStaffs,
      title: "On Leave",
      subtitle: "approved leave",
    },
  ];

  const greeting = (() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";

    return "Good Night";
  })();
  return (
    <MainLayout>
      <div className={styles.dashboard}>
        <div className={styles.top}>
          <p className={styles.title}>{greeting}, Admin</p>

          <p className={styles.subtitle}>
            Here’s what’s happening with your team today.
          </p>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((item) => (
            <div key={item.id} className={styles.card}>
              <p className={styles.count}>
                {loading ? (
                  <Skeleton variant="text" width={50} height={40} />
                ) : (
                  item.count
                )}
              </p>

              <p className={styles.cardTitle}>{item.title}</p>

              <p className={styles.cardSubtitle}>{item.subtitle}</p>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <p>Staff Status</p>

              <select
                value={statusFilter}
                onChange={(e) => {
                  const value = e.target.value;

                  setStatusFilter(value);

                  fetchAttendanceList(value === "all" ? "" : value, 1);
                }}
              >
                <option value="all">All</option>
                <option value="checked in">Checked In</option>
                <option value="not checked in">Not Checked In</option>
                <option value="on leave">On Leave</option>
              </select>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Staff Id</th>
                  <th>Role</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Status</th>
                  <th>
                    <PhotoCameraIcon />
                  </th>
                </tr>
              </thead>

              <tbody>
                {tableLoading ? (
                  [...Array(5)].map((_, index) => (
                    <tr key={index}>
                      <td>
                        <Skeleton variant="text" width={100} />
                      </td>

                      <td>
                        <Skeleton variant="text" width={60} />
                      </td>

                      <td>
                        <Skeleton variant="text" width={80} />
                      </td>

                      <td>
                        <Skeleton variant="text" width={90} />
                      </td>

                      <td>
                        <Skeleton variant="text" width={90} />
                      </td>

                      <td>
                        <Skeleton variant="rounded" width={80} height={30} />
                      </td>
                    </tr>
                  ))
                ) : staffData.length > 0 ? (
                  staffData.map((staff) => (
                    <React.Fragment key={staff.id}>
                      <tr>
                        <td>
                          <div className={styles.staffNameWrapper}>
                            <div className={styles.staffAvatar}>
                              <img src={staff.profileUrl} alt="img" />
                            </div>

                            <span>{staff.name}</span>
                          </div>
                        </td>

                        <td>{staff.staffId}</td>

                        <td>{staff.role || "--"}</td>

                        <td>{staff.checkInTime || "--"}</td>

                        <td>{staff.checkOutTime || "--"}</td>

                        <td>
                          <span
                            className={`${styles.status} ${
                              staff.status === "checked in"
                                ? styles.in
                                : staff.status === "not checked in"
                                  ? styles.out
                                  : styles.leave
                            }`}
                          >
                            {staff.status}
                          </span>
                        </td>

                        <td>
                          {staff.imageUrl && (
                            <button
                              className={styles.expandBtn}
                              onClick={() =>
                                setExpandedRow(
                                  expandedRow === staff.id ? null : staff.id,
                                )
                              }
                            >
                              <ExpandMoreIcon
                                style={{
                                  transform:
                                    expandedRow === staff.id
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.5s ease",
                                }}
                              />
                            </button>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td
                          colSpan="7"
                          style={{
                            padding: 0,
                            border: "none",
                          }}
                        >
                          <Collapse
                            in={expandedRow === staff.id}
                            timeout={500}
                            unmountOnExit
                          >
                            <div className={styles.expandedCard}>
                              <div className={styles.fullImageWrapper}>
                                <img
                                  src={staff.imageUrl}
                                  alt={staff.name}
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
                    <td colSpan="6">
                      <div className={styles.noData}>
                        <img src="/critic_no_found.svg" alt="No Data Found" />

                        <p>No Data Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!tableLoading && staffData.length > 0 && (
              <div className={styles.paginationWrapper}>
                <Pagination
                  count={totalPages || 1}
                  page={page}
                  shape="rounded"
                  onChange={(event, value) => {
                    if (value === page) return;

                    setPage(value);

                    fetchAttendanceList(
                      statusFilter === "all" ? "" : statusFilter,
                      value,
                    );
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
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
