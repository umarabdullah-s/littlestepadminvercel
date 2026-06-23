



import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import styles from "./MainLayout.module.css";

const MainLayout = ({ children }) => {
  const location = useLocation();

 const hideHeaderPaths = ["/staff/create-staff", "/announcement"];

 const hideHeader =
   hideHeaderPaths.includes(location.pathname) ||
   /^\/staff\/[^/]+$/.test(location.pathname);

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.main}>
        {!hideHeader && <Header />}

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
