import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutModal from "../Modals/LogoutModal";

import { MdDashboard, MdCampaign, MdLogout } from "react-icons/md";

import { FaClipboardList } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";

const Sidebar = () => {
  const navigate = useNavigate();

  const [openLogout, setOpenLogout] = useState(false);

  const handleLogout = () => {
    localStorage.clear();

    sessionStorage.clear();

    setOpenLogout(false);

    navigate("/");
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
