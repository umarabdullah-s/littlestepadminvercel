import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import Pagination from "@mui/material/Pagination";
import styles from "./Staff.module.css";
import { getStaffs, deleteStaff } from "../../api/serviceapi";
import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "react-router-dom";
import DeleteStaffModal from "../../components/Modals/DeleteStaffModal";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
const Staff = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleting, setDeleting] = useState(false);
  
 const fetchStaffs = async (pageNumber = 1, filter = "") => {
   try {
     setLoading(true);

     const response = await getStaffs(pageNumber, "", filter);

     setStaffData(response.data.data.data);
     setTotalRecords(response.data.data.totalRecords);
     setTotalPages(response.data.data.totalPages);
   } catch (error) {
     console.log(error);
   } finally {
     setLoading(false);
   }
 };
useEffect(() => {
  fetchStaffs(page, statusFilter === "all" ? "" : statusFilter);
}, [page, statusFilter]);
const handleDeleteClick = (staffId) => {
  setSelectedStaffId(staffId);
  setDeleteOpen(true);
};

const handleDeleteConfirm = async () => {
  try {
    setDeleting(true);

    await deleteStaff(selectedStaffId);

    setDeleteOpen(false);
    setSelectedStaffId(null);

    fetchStaffs(page);
  } catch (error) {
    console.log(error);
  } finally {
    setDeleting(false);
  }
};
  return (
    <MainLayout>
      <div className={styles.staffPage}>
        <div className={styles.top}>
          <div>
            <h1 className={styles.title}>Staff Directory</h1>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginTop: "8px",
              }}
            >
              <p className={styles.subtitle}>Total staff : {totalRecords}</p>

              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => {
                  setPage(1);
                  setStatusFilter(e.target.value);
                }}
              >
                <option value="all">All</option>
                <option value="checked in">Checked In</option>
                <option value="not checked in">Not Checked In</option>
                <option value="on leave">On Leave</option>
              </select>
            </div>
          </div>

          <button
            className={styles.addBtn}
            onClick={() => navigate("/staff/create-staff")}
          >
            + Staff
          </button>
        </div>

        <div className={styles.tableSection}>
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>EM-ID</th>
                <th>ROLE</th>
                <th>DATE OF JOIN</th>
                <th>No. OF MONTH</th>
                <th>E-MAIL</th>
                <th>NUMBER</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <Skeleton width={120} />
                    </td>
                    <td>
                      <Skeleton width={80} />
                    </td>
                    <td>
                      <Skeleton width={100} />
                    </td>
                    <td>
                      <Skeleton width={100} />
                    </td>
                    <td>
                      <Skeleton width={80} />
                    </td>
                    <td>
                      <Skeleton width={150} />
                    </td>
                    <td>
                      <Skeleton width={120} />
                    </td>
                    <td>
                      <Skeleton width={100} />
                    </td>
                  </tr>
                ))
              ) : staffData.length === 0 ? (
                <tr>
                  <td colSpan="9" className={styles.noDataCell}>
                    <img
                      src="/critic_no_found.svg"
                      alt="No Data Found"
                      className={styles.noDataImage}
                    />
                    <p>No Data Found</p>
                  </td>
                </tr>
              ) : (
                staffData.map((staff) => (
                  <tr
                    key={staff._id}
                    onClick={() => navigate(`/staff/${staff._id}`)}
                    className={styles.clickableRow}
                  >
                    <td>
                      <div className={styles.staffNameWrapper}>
                        <div className={styles.staffAvatar}>
                          <img src={staff.profileUrl} alt="" />
                        </div>

                        <span>{staff.name}</span>
                      </div>
                    </td>

                    <td>{staff.staffId}</td>

                    <td>{staff.role || "--"}</td>

                    <td>
                      {new Date(staff.dateOfJoining).toLocaleDateString(
                        "en-GB",
                      )}
                    </td>

                    <td>{staff.noOfMonths || "--"}</td>

                    <td>{staff.email}</td>

                    <td>{staff.phone}</td>

                    <td>
                      <span
                        className={`${styles.status} ${
                          staff.status?.toLowerCase() === "checked in"
                            ? styles.in
                            : staff.status === "not checked in"
                              ? styles.out
                              : styles.leave
                        }`}
                      >
                        {staff.status || "--"}
                      </span>
                    </td>
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <EditOutlinedIcon
                          onClick={() => navigate(`/staff/edit/${staff._id}`)}
                          sx={{
                            color: "#2563eb",
                            cursor: "pointer",
                          }}
                        />

                        <DeleteOutlineOutlinedIcon
                          onClick={() => handleDeleteClick(staff._id)}
                          sx={{
                            color: "#ef4444",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && staffData.length > 0 && (
            <div className={styles.paginationWrapper}>
              <Pagination
                count={totalPages}
                page={page}
                shape="rounded"
                onChange={(event, value) => setPage(value)}
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#2F64E1 !important",
                    color: "#fff",
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
      <DeleteStaffModal
        open={deleteOpen}
        handleClose={() => {
          setDeleteOpen(false);
          setSelectedStaffId(null);
        }}
        handleDelete={handleDeleteConfirm}
        deleting={deleting}
      />
    </MainLayout>
  );
};

export default Staff;
