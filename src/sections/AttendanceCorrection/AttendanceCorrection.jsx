import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import {
  getAttendanceCorrectionRequests,
  respondAttendanceCorrectionRequest,
} from "../../api/serviceapi";
import styles from "./AttendanceCorrection.module.css";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useCorrection } from "../../context/CorrectionContext";

const AttendanceCorrection = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tableLoading, setTableLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchCorrectionCount } = useCorrection();

const fetchRequests = async (currentPage = 1) => {
  try {
    setTableLoading(true);

    const response = await getAttendanceCorrectionRequests(currentPage);

    setRequests(response?.data?.data?.data || []);
    setPage(response?.data?.data?.currentPage || 1);
    setTotalPages(response?.data?.data?.totalPages || 1);
  } catch (error) {
    console.log(error);
  } finally {
    setTableLoading(false);
  }
};
  useEffect(() => {
    fetchRequests();
  }, []);

const handleResponse = async (requestId, status, staffId) => {
  try {
    await respondAttendanceCorrectionRequest(requestId, {
      status,
    });

    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status } : req)),
    );

    
    await fetchCorrectionCount();

    
    if (status === "approved") {
      navigate(`/staff/${staffId}`);
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <MainLayout>
      <div className={styles.pageHeader}>
        <h2>Attendance Correction Requests</h2>
      </div>

      <div className={styles.container}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Staff ID</th>
                <th>Email</th>
                <th>Request Type</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {tableLoading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <div className={styles.staffNameWrapper}>
                        <Skeleton variant="circular" width={36} height={36} />
                        <Skeleton variant="text" width={100} height={30} />
                      </div>
                    </td>

                    <td>
                      <Skeleton variant="text" width={70} />
                    </td>

                    <td>
                      <Skeleton variant="text" width={180} />
                    </td>

                    <td>
                      <Skeleton variant="text" width={140} />
                    </td>

                    <td>
                      <Skeleton variant="text" width={220} />
                    </td>

                    <td>
                      <Skeleton variant="rounded" width={90} height={32} />
                    </td>
                  </tr>
                ))
              ) : requests.length > 0 ? (
                requests.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.staffNameWrapper}>
                        <div className={styles.staffAvatar}>
                          <img
                            src={
                              item.staff?.profileUrl || "/defaultProfile.png"
                            }
                            alt={item.staff?.staffName}
                          />
                        </div>

                        <span>{item.staff?.staffName}</span>
                      </div>
                    </td>

                    <td>{item.staff?.staffId}</td>
                    <td>{item.staff?.email}</td>
                    <td>{item.requestType}</td>
                    <td className={styles.reason}>{item.reason}</td>

                    <td>
                      {item.status === "pending" ? (
                        <div className={styles.actionButtons}>
                          <CheckIcon
                            className={styles.approveIcon}
                            onClick={() =>
                              handleResponse(item.id, "approved", item.staff.id)
                            }
                            style={{ cursor: "pointer" }}
                          />

                          <CloseIcon
                            className={styles.rejectIcon}
                            onClick={() =>
                              handleResponse(item.id, "rejected", item.staff.id)
                            }
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      ) : (
                        <span
                          className={`${styles.statusBadge} ${
                            item.status === "approved"
                              ? styles.approved
                              : styles.rejected
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </td>
                  </tr>
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
        </div>

        {!tableLoading && requests.length > 0 && (
          <div className={styles.paginationWrapper}>
            <Pagination
              count={totalPages || 1}
              page={page}
              shape="rounded"
              onChange={(event, value) => {
                if (value === page) return;

                setPage(value);
                fetchRequests(value);
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
    </MainLayout>
  );
};

export default AttendanceCorrection;
