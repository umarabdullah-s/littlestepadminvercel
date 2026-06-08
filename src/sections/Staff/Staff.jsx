import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import Pagination from "@mui/material/Pagination";
import styles from "./Staff.module.css";
import { getStaffs } from "../../api/serviceapi";
import Skeleton from "@mui/material/Skeleton";
const Staff = () => {
  const [page, setPage] = useState(1);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchStaffs = async () => {
    try {
      setLoading(true);

      const response = await getStaffs();

      console.log(response.data);

      setStaffData(response.data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStaffs();
  }, []);

  return (
    <MainLayout>
      <div className={styles.staffPage}>
        <div className={styles.top}>
          <div>
            <h1 className={styles.title}>Staff Directory</h1>
            <p className={styles.subtitle}>Total {staffData.length} staff</p>
          </div>

          <button className={styles.addBtn}>+ Staff</button>
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
                    <tr key={staff._id}>
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

                      <td>{staff.mobileNumber}</td>

                      <td>
                        <span
                          className={`${styles.status} ${
                            staff.isCheckedIn ? styles.in : styles.out
                          }`}
                        >
                          ● {staff.isCheckedIn ? "Checked In" : "Checked Out"}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          <div className={styles.paginationWrapper}>
            <Pagination
              count={3}
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
                  color: "rgb(255, 255, 255)",
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
