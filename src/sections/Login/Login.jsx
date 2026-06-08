import React, { useState } from "react";
import styles from "./Login.module.css";

import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";

import { loginStaff } from "../../api/serviceapi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);

        const response = await loginStaff(email, password);

        console.log("Login Success:", response.data);

        sessionStorage.setItem("adminToken", response.data.accessToken);

        sessionStorage.setItem("userId", response.data.admin._id);

        sessionStorage.setItem("role", response.data.role);

        setLoading(false);

        setOpenSnackbar(true);

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
      } catch (error) {
        setLoading(false);

        console.error("Login failed:", error);

        setErrors({
          password:
            error.response?.data?.message || "Something went wrong",
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <p className={styles.mainTitle}>
            Monitor staff attendance in real time
          </p>

          <div className={styles.card}>
            <p className={styles.cardTitle}>Daily check-in tracking</p>

            <p className={styles.cardDesc}>Present, absent, late, on leave</p>
          </div>

          <div className={styles.card}>
            <p className={styles.cardTitle}>Monthly reports & trends</p>

            <p className={styles.cardDesc}>Exportable attendance summaries</p>
          </div>

          <div className={styles.card}>
            <p className={styles.cardTitle}>Absence alerts</p>

            <p className={styles.cardDesc}>Auto-notify on unplanned absences</p>
          </div>

          <span className={styles.footer}>
            Alo Little Steps • Academic Year {new Date().getFullYear()}-
            {String(new Date().getFullYear() + 1).slice(-2)}
          </span>
        </div>

        <div className={styles.right}>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <img src="/logo.png" alt="logo" className={styles.logo} />

            <div>
              <p className={styles.welcomeText}>Welcome back</p>

              <p className={styles.subText}>
                Please enter your details to access your dashboard.
              </p>
            </div>

            <div className={styles.inputGroup}>
              <p className={styles.inputLabel}>Email Address</p>

              <div
                className={`${styles.inputWrapper} ${
                  errors.email ? styles.errorBorder : ""
                }`}
              >
                <EmailOutlined className={styles.icon} />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (!e.target.value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        email: "Email is required",
                      }));
                    } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        e.target.value,
                      )
                    ) {
                      setErrors((prev) => ({
                        ...prev,
                        email: "Invalid email address",
                      }));
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                      }));
                    }
                  }}
                />
              </div>

              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <p className={styles.inputLabel}>Password</p>

              <div
                className={`${styles.inputWrapper} ${
                  errors.password ? styles.errorBorder : ""
                }`}
              >
                <LockOutlined className={styles.icon} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    if (!e.target.value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        password: "Password is required",
                      }));
                    } else if (e.target.value.length < 6) {
                      setErrors((prev) => ({
                        ...prev,
                        password: "Password must be at least 6 characters",
                      }));
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        password: "",
                      }));
                    }
                  }}
                />

                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <VisibilityOff className={styles.icon} />
                  ) : (
                    <Visibility className={styles.icon} />
                  )}
                </button>
              </div>

              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className={styles.loginBtn}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Log In"
              )}
            </button>

            <span className={styles.bottomText}>
              Restricted to authorized school administrators only
            </span>
          </form>
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={Fade}
      >
        <Alert
          severity="success"
          variant="filled"
          elevation={6}
          sx={{
            backgroundColor: "#ffffff",
            color: "#111827",
            borderRadius: "12px",
            fontWeight: 500,
            minWidth: "260px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          Login Successful
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
