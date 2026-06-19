import React, { useEffect, useState } from "react";

import MainLayout from "../../components/layouts/MainLayout";

import styles from "./Request.module.css";

import { FiCalendar, FiClock, FiTag, FiFileText } from "react-icons/fi";

import { getLeaveRequests, respondLeaveRequest } from "../../api/serviceapi";

import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "react-router-dom";

const filters = ["All requests", "Leave", "Permission", "Pending", "Resolved"];
const getStatusFromFilter = (filter) => {
  switch (filter) {
    case "Pending":
      return "pending";

    case "Resolved":
      return "resolved";

    case "Leave":
      return "leave";

    case "Permission":
      return "permission";

    default:
      return "";
  }
};
const Request = () => {
  const [activeFilter, setActiveFilter] = useState("All requests");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const leaveRequests = async (status = "") => {
    try {
      setLoading(true);

      const response = await getLeaveRequests(status);

      setRequests(response.data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await respondLeaveRequest(id, {
        status: "approved",
      });

      await leaveRequests(getStatusFromFilter(activeFilter));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await respondLeaveRequest(id, {
        status: "rejected",
      });

      await leaveRequests(getStatusFromFilter(activeFilter));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    leaveRequests(getStatusFromFilter(activeFilter));
  }, [activeFilter]);
  return (
    <MainLayout>
      <div className={styles.requestPage}>
        <div className={styles.top}>
          <p className={styles.title}>Requests</p>

          <p className={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <p className={styles.subtitle}>
            Review and take action on pending staff requests.
          </p>
        </div>

        <div className={styles.filters}>
          {filters.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(item)}
              className={
                activeFilter === item ? styles.activeFilter : styles.filterBtn
              }
            >
              {item}
            </button>
          ))}
        </div>

        <div className={styles.cards}>
          {loading ? (
            [...Array(5)].map((_, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.userInfo}>
                    <Skeleton variant="circular" width={50} height={50} />

                    <div>
                      <Skeleton width={120} height={25} />

                      <Skeleton width={100} height={20} />
                    </div>
                  </div>

                  <Skeleton width={80} />
                </div>

                <div className={styles.details}>
                  <Skeleton width={100} />
                  <Skeleton width={80} />
                  <Skeleton width={90} />
                </div>

                <Skeleton variant="text" width="100%" height={40} />

                <div className={styles.actions}>
                  <Skeleton variant="rounded" width={100} height={36} />

                  <Skeleton variant="rounded" width={100} height={36} />

                  <Skeleton variant="rounded" width={120} height={36} />
                </div>
              </div>
            ))
          ) : requests.length > 0 ? (
            <>
              {requests.map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        <img src={item.staff?.profileUrl} alt="img" />
                      </div>

                      <div>
                        <p className={styles.name}>
                          {item.staff?.name || "Unknown Staff"}
                        </p>
                        <div className={styles.badges}>
                          <span className={styles.leave}>
                            {item.leaveRequestType}
                          </span>

                          {activeFilter !== "Resolved" && (
                            <span
                              className={`${styles.statusBadge} ${
                                item.status?.toLowerCase() === "approved" ||
                                item.status?.toLowerCase() === "resolved"
                                  ? styles.approved
                                  : item.status?.toLowerCase() === "rejected"
                                    ? styles.rejected
                                    : styles.pending
                              }`}
                            >
                              {item.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className={styles.time}>{item.requestedOn}</p>
                  </div>

                  <div className={styles.details}>
                    <span>
                      <FiCalendar />
                      {item.period}
                    </span>

                    <span>
                      <FiClock />
                      {item.duration}
                    </span>

                    <span>
                      <FiTag />
                      {item.leaveType}
                    </span>
                  </div>

                  <p className={styles.description}>{item.reason}</p>

                  <div className={styles.actions}>
                    <div className={styles.leftActions}>
                      {item.status?.toLowerCase() === "approved" ? (
                        <button className={styles.approvedBtn}>
                          ✓ Approved
                        </button>
                      ) : item.status?.toLowerCase() === "rejected" ? (
                        <button className={styles.rejectedBtn}>
                          ✕ Rejected
                        </button>
                      ) : (
                        <>
                          <button
                            className={styles.approve}
                            onClick={() => handleApprove(item.id)}
                          >
                            ✓ Approve
                          </button>

                          <button
                            className={styles.deny}
                            onClick={() => handleReject(item.id)}
                          >
                            ✕ Deny
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      className={styles.recordBtn}
                      // onClick={() =>
                      //   item.staff?.id && navigate(`/staff/${item.staff.id}`)
                      // }
                      onClick={() =>
                        navigate(`/staff/${item.staff.id}`, {
                          state: {
                            activeTab: "requests",
                          },
                        })
                      }
                    >
                      <FiFileText />
                      View Record
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.noData}>
              <img src="/critic_no_found.svg" alt="No Data Found" />
              <p>No Requests Found</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Request;
