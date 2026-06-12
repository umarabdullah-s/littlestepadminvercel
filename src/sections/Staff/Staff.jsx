import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import Pagination from "@mui/material/Pagination";
import styles from "./Staff.module.css";
import { getStaffs } from "../../api/serviceapi";
import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "react-router-dom";
const Staff = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 const fetchStaffs = async (pageNumber = 1) => {
   try {
     setLoading(true);

     const response = await getStaffs(pageNumber);

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
  fetchStaffs(page);
}, [page]);

  return (
    <MainLayout>
      <div className={styles.staffPage}>
        <div className={styles.top}>
          <div>
            <h1 className={styles.title}>Staff Directory</h1>
            <p className={styles.subtitle}>Total staff : {totalRecords} </p>
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
                <th>MOBILE NUMBER</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {loading
                ? [...Array(5)].map((_, index) => (
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
                : staffData.map((staff) => (
                    <tr
                      key={staff._id}
                      onClick={() => navigate(`/staff/${staff._id}`)}
                      className={styles.clickableRow}
                    >
                      <td>
                        <div className={styles.staffNameWrapper}>
                          <div className={styles.staffAvatar}>
                            {staff.name
                              ?.split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
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
                              : staff.status === "not yet checked in"
                                                              ? styles.out
                                                              : styles.leave
                          }`}
                        >
                          {staff.status || "--"}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

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
        </div>
      </div>
    </MainLayout>
  );
};

export default Staff;
