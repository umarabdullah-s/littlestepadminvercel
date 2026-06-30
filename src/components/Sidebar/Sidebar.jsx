import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutModal from "../Modals/LogoutModal";
import { getAttendanceCorrectionRequests } from "../../api/serviceapi";
import { MdDashboard, MdCampaign, MdLogout } from "react-icons/md";

import { FaClipboardList } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import FactCheckIcon from "@mui/icons-material/FactCheck";

const Sidebar = () => {
  const navigate = useNavigate();
  const [correctionCount, setCorrectionCount] = useState(0);
  const [openLogout, setOpenLogout] = useState(false);

  const handleLogout = () => {
    localStorage.clear();

    sessionStorage.clear();

    setOpenLogout(false);

    navigate("/");
  };
  useEffect(() => {
    fetchCorrectionCount();
  }, []);

  const fetchCorrectionCount = async () => {
    try {
      const response = await getAttendanceCorrectionRequests();

      setCorrectionCount(response?.data?.data?.statusCount || 0);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className={styles.sidebar}>
        <div>
          <div
            className={styles.logoContainer}
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <img src="/logo.png" alt="logo" className={styles.logo} />
          </div>

          <ul className={styles.menu}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              <MdDashboard className={styles.icon} />
              Dashboard
            </NavLink>

            <NavLink
              to="/request"
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              <FaClipboardList className={styles.icon} />
              Request
            </NavLink>

            <NavLink
              to="/attendance-correction"
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              <FactCheckIcon className={styles.icon} />

              <span className={styles.menuText}>Correction</span>

              {correctionCount > 0 && (
                <span className={styles.badge}>{correctionCount}</span>
              )}
            </NavLink>

            <NavLink
              to="/staff"
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              <HiUserGroup className={styles.icon} />
              Staff
            </NavLink>

            <NavLink
              to="/announcement"
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              <MdCampaign className={styles.icon} />
              Announcement
            </NavLink>
          </ul>
        </div>

        <button className={styles.logout} onClick={() => setOpenLogout(true)}>
          <MdLogout className={styles.logoutIcon} />
          Sign Out
        </button>
      </div>

      <LogoutModal
        open={openLogout}
        handleClose={() => setOpenLogout(false)}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default Sidebar;
