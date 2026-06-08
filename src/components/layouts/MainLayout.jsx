import React from 'react'
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import styles from "./MainLayout.module.css";

const MainLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.main}>
        <Header />

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default MainLayout