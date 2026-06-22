import { useState, useRef, useEffect } from "react";
import { Menu, Avatar, Divider, Button } from "@mui/material";
import styles from "./Header.module.css";
import { FiSearch } from "react-icons/fi";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../Modals/LogoutModal";
import CircularProgress from "@mui/material/CircularProgress";
import { getStaffs } from "../../api/serviceapi";

const Header = () => {
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [openLogout, setOpenLogout] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearch("");
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    setOpenLogout(false);
    handleClose();

    navigate("/");
  };
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await getStaffs(1, value);

      setSearchResults(res.data.data.data || []);
    } catch (error) {
      console.log(error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchWrapper} ref={searchRef}>
          <FiSearch className={styles.searchIcon} />

          <input
            type="text"
            placeholder="Search staff..."
            className={styles.search}
            value={search}
            onChange={handleSearch}
          />
          {loading && (
            <div className={styles.searchResultBox}>
              <div className={styles.loaderWrapper}>
                <CircularProgress size={24} />
              </div>
            </div>
          )}

          {search && !loading && (
            <div className={styles.searchResultBox}>
              {searchResults.length > 0 ? (
                searchResults.map((staff) => (
                  <div
                    key={staff._id}
                    className={styles.staffItem}
                    onClick={() => navigate(`/staff/${staff._id}`)}
                  >
                    <img
                      src={staff.profileUrl || "/default-avatar.png"}
                      alt={staff.name}
                      className={styles.staffAvatar}
                    />

                    <div className={styles.staffInfo}>
                      <h4>{staff.name}</h4>
                      {/* <p>{staff.role}</p> */}
                      <small>{staff.staffId}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    margin: 0,
                    color: "#64748b",
                  }}
                >
                  No staff found
                </p>
              )}
            </div>
          )}
        </div>

        <div
          className={`${styles.profile} ${
            anchorEl ? styles.profileActive : ""
          }`}
          onClick={handleOpen}
        >
          <span>Admin</span>
          <div className={styles.avatar}>A</div>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: 220,
              mt: 1,
              borderRadius: "16px",
              border: "1px solid #dbe2ea",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              overflow: "hidden",
            },
          },
        }}
      >
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            background: "#f8fafc",
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Avatar
            sx={{
              width: 50,
              height: 50,
              margin: "0 auto",
              bgcolor: "#d9fbe6",
              color: "#16a34a",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            A
          </Avatar>

          <p
            style={{
              marginTop: "10px",

              color: "#64748b",
              fontSize: "17px",
            }}
          >
            Admin
          </p>
        </div>

        <Divider />

        <div style={{ padding: "16px" }}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={() => setOpenLogout(true)}
          >
            Sign Out
          </Button>
        </div>
      </Menu>
      <LogoutModal
        open={openLogout}
        handleClose={() => setOpenLogout(false)}
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default Header;
