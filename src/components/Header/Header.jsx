import React from "react";

import styles from "./Header.module.css";

import { FiSearch } from "react-icons/fi";

const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />

          <input
            type="text"
            placeholder="Search staff..."
            className={styles.search}
          />
        </div>

        

        <div className={styles.profile}>
          <span>Admin</span>

          <div className={styles.avatar}>A</div>
        </div>
      </div>
      
    </div>
  );
};

export default Header;
