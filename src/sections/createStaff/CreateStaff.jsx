import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import styles from "./createStaff.module.css";
import { useNavigate,useParams } from "react-router-dom";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  createStaff,
  uploadFile,
  // getProfileCompletion,
} from "../../api/serviceapi";
import CircularProgress from "@mui/material/CircularProgress";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const CreateStaff = () => {
  // const id=useParams();
  const navigate = useNavigate();
   const initialFormData = {
     name: "",
     gender: "",
     bloodGroup: "",
     dateOfBirth: "",
     phone: "",
     emergencyContact: "",
     email: "",
     address: "",

     role: "",
     classAssigned: "",
     department: "",
     joiningDate: "",
     employmentType: "",
     staffId: "",
     password: "",
     confirmPassword: "",
     workSchedule: "",

     bankName: "",
     accountNumber: "",
     ifscCode: "",
     panNumber: "",

     idProof: null,
     offerLetter: null,
     certificate: null,
     experienceLetter: null,

     profile: null,
   };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [profileCompletion, setProfileCompletion] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    let error = "";

    const requiredFields = [
      "name",
      "gender",
      "dateOfBirth",
      "phone",
      "email",
      "address",
      "role",
      "classAssigned",
      "joiningDate",
      "password",
      "confirmPassword",
    ];

    if (requiredFields.includes(name) && !value.trim()) {
      const label = name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());

      error = `${label} is required`;
    }

    if (
      name === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = "Invalid email address";
    }

    if (name === "phone" && value && !/^\d{10}$/.test(value)) {
      error = "Phone number must be 10 digits";
    }

    if (name === "confirmPassword" && value && value !== formData.password) {
      error = "Passwords do not match";
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: files[0] ? "" : `${name} is required`,
    }));
  };

  const removeFile = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }));

    const input = document.getElementById(fieldName);

    if (input) {
      input.value = "";
    }
  };
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});

    [
      "profile",
      "idProof",
      "offerLetter",
      "certificate",
      "experienceLetter",
    ].forEach((id) => {
      const input = document.getElementById(id);
      if (input) input.value = "";
    });
  };
 const validateForm = () => {
   const newErrors = {};

   const requiredFields = [
     "name",
     "gender",
     "dateOfBirth",
     "phone",
     "email",
     "address",
     "role",
     "classAssigned",
     "joiningDate",
     "password",
     "confirmPassword",
   ];

   requiredFields.forEach((field) => {
     if (!String(formData[field] || "").trim()) {
       const label = field
         .replace(/([A-Z])/g, " $1")
         .replace(/^./, (str) => str.toUpperCase());

       newErrors[field] = `${label} is required`;
     }
   });

   if (!formData.idProof) {
     newErrors.idProof = "ID Proof is required";
   }

   if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
     newErrors.email = "Invalid email address";
   }

   if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
     newErrors.phone = "Phone number must be 10 digits";
   }

   if (
     formData.password &&
     formData.confirmPassword &&
     formData.password !== formData.confirmPassword
   ) {
     newErrors.confirmPassword = "Passwords do not match";
   }

   setErrors(newErrors);

   return Object.keys(newErrors).length === 0;
 };
const handleSave = async () => {
  console.log("Form Data:", formData);
  if (!validateForm()) return;
   setLoading(true);
  try {
    // Upload files
    const profileUrl = formData.profile
      ? (await uploadFile(formData.profile)).data.data.url
      : "";

    const aadharUrl = formData.idProof
      ? (await uploadFile(formData.idProof)).data.data.url
      : "";

    const offerLetterUrl = formData.offerLetter
      ? (await uploadFile(formData.offerLetter)).data.data.url
      : "";

    const educationCertificateUrl = formData.certificate
      ? (await uploadFile(formData.certificate)).data.data.url
      : "";

    const experienceLetterUrl = formData.experienceLetter
      ? (await uploadFile(formData.experienceLetter)).data.data.url
      : "";

    const payload = {
      name: formData.name,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      dateOfBirth: formData.dateOfBirth,
      phone: formData.phone,
      emergencyContact: formData.emergencyContact,
      email: formData.email,
      address: formData.address,

      role: formData.role,
      class: formData.classAssigned,
      department: formData.department,
      dateOfJoining: formData.joiningDate,
      employmentType: formData.employmentType,
      staffId: formData.staffId,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      workSchedule: formData.workSchedule,

      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      panNumber: formData.panNumber,

      profileUrl,
      aadharUrl,
      offerLetterUrl,
      educationCertificateUrl,
      experienceLetterUrl,
    };

    const response = await createStaff(payload);

    console.log(response.data);
    alert("Staff Created Successfully");
    resetForm();
  } 
  catch (error) {
     console.log("FULL ERROR", error.response);
     console.log("DATA", error.response?.data);
     console.log("STATUS", error.response?.status);
    alert(error.response?.data?.message || "Failed to create staff");
  } 
  finally {
    setLoading(false);
  }
};
// useEffect(() => {
//   const fetchProfileCompletion = async () => {
//     try {
//       const res = await getProfileCompletion(id);

//       setProfileCompletion(res.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (id) {
//     fetchProfileCompletion();
//   }
// }, [id]);
return (
  <MainLayout>
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.header}>
          <div>
            <p className={styles.title}>Onboard New Employee</p>

            <p className={styles.subtitle}>
              Complete the details below to register a new member.
            </p>
          </div>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.stepBadge}>1</span>
            <span className={styles.iconCircle}>
              <PersonOutlineOutlinedIcon />
            </span>
            Personal Information
          </h3>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>
                Name <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
              />

              {errors.name && (
                <small className={styles.error}>{errors.name}</small>
              )}
            </div>
            <div className={styles.field}>
              <label>
                Gender <span>*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <small className={styles.error}>{errors.gender}</small>
              )}
            </div>
            <div className={styles.field}>
              <label>Blood Group</label>
              <input
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                placeholder="e.g. O+"
              />
            </div>
            <div className={styles.field}>
              <label>
                Date of Birth <span>*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />

              {errors.dateOfBirth && (
                <small className={styles.error}>{errors.dateOfBirth}</small>
              )}
            </div>
            <div className={styles.field}>
              <label>
                Phone Number <span>*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="enter phone number"
              />

              {errors.phone && (
                <small className={styles.error}>{errors.phone}</small>
              )}
            </div>
            <div className={styles.field}>
              <label>Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="enter emergency contact number"
              />
            </div>
            <div className={styles.field}>
              <label>
                Email address <span>*</span>
              </label>
              <input
                type="email"
                name="email"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                placeholder="enter email address"
                className={styles.fullWidth}
              />
              {errors.email && (
                <small className={styles.error}>{errors.email}</small>
              )}
            </div>
          </div>

          <div className={`${styles.field} ${styles.requiredField}`}>
            <label>
              Residential Address <span>*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="enter your address"
            />

            {errors.address && (
              <small className={styles.error}>{errors.address}</small>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.stepBadge}>2</span>
            <span className={styles.iconCircle}>
              <WorkOutlineOutlinedIcon />
            </span>
            Work Details
          </h3>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>
                Role <span>*</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Role"
              />

              {errors.role && (
                <small className={styles.error}>{errors.role}</small>
              )}
            </div>
            <div className={styles.field}>
              <label>
                Class Assigned <span>*</span>
              </label>
              <input
                type="text"
                name="classAssigned"
                value={formData.classAssigned}
                onChange={handleChange}
                placeholder="Class Assigned"
              />
              {errors.classAssigned && (
                <small className={styles.error}>{errors.classAssigned}</small>
              )}
            </div>
            <div className={styles.field}>
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
              />
            </div>
            <div className={styles.field}>
              <label>
                Joining Date <span>*</span>
              </label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />

              {errors.joiningDate && (
                <small className={styles.error}>{errors.joiningDate}</small>
              )}
            </div>
            <div className={styles.field}>
              <label>Employment Type</label>
              <input
                type="text"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                placeholder="Eg: Full Time"
              />
            </div>
            <div className={styles.field}>
              <label>Staff ID</label>
              <input
                type="text"
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                placeholder="Staff ID"
              />
            </div>

            <div className={styles.field}>
              <label>
                Password <span>*</span>
              </label>

              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />

                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>

              {errors.password && (
                <small className={styles.error}>{errors.password}</small>
              )}
            </div>
            <div className={styles.field}>
              <label>
                Confirm Password <span>*</span>
              </label>

              <div className={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                />

                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>

              {errors.confirmPassword && (
                <small className={styles.error}>{errors.confirmPassword}</small>
              )}
            </div>
          </div>

          <div className={`${styles.field} ${styles.requiredField}`}>
            <label>Work Schedule</label>
            <input
              type="text"
              name="workSchedule"
              value={formData.workSchedule}
              onChange={handleChange}
              placeholder="Work Schedule"
              className={styles.fullWidth}
            />
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.stepBadge}>3</span>
            <span className={styles.iconCircle}>
              <AccountBalanceOutlinedIcon />
            </span>
            Bank Details
          </h3>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Bank Name"
              />
            </div>
            <div className={styles.field}>
              <label>Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Account Number"
              />
            </div>
            <div className={styles.field}>
              <label>IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="IFSC Code"
              />
            </div>
            <div className={styles.field}>
              <label>PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="PAN Number"
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.stepBadge}>4</span>
            <span className={styles.iconCircle}>
              <DescriptionOutlinedIcon />
            </span>
            Documents
          </h3>

          <div className={styles.documentGrid}>
            <div>
              <div className={styles.uploadWrapper}>
                {formData.idProof && (
                  <CloseIcon
                    className={styles.closeIcon}
                    onClick={(e) => {
                      e.preventDefault();
                      removeFile("idProof");
                    }}
                  />
                )}

                <label htmlFor="idProof" className={styles.uploadBox}>
                  <input
                    type="file"
                    id="idProof"
                    name="idProof"
                    accept=".pdf,.jpg,.jpeg,.png"
                    hidden
                    onChange={handleFileChange}
                  />

                  <BadgeOutlinedIcon className={styles.uploadIcon} />

                  <h4>
                    {formData.idProof
                      ? formData.idProof.name
                      : "Click to upload ID proof"}
                    <span>*</span>
                  </h4>

                  <p>PDF, JPG, PNG - max 5 MB</p>
                </label>
              </div>
              {errors.idProof && (
                <small className={styles.error}>{errors.idProof}</small>
              )}
            </div>

            <div className={styles.uploadWrapper}>
              {formData.offerLetter && (
                <CloseIcon
                  className={styles.closeIcon}
                  onClick={(e) => {
                    e.preventDefault();
                    removeFile("offerLetter");
                  }}
                />
              )}

              <label htmlFor="offerLetter" className={styles.uploadBox}>
                <input
                  type="file"
                  id="offerLetter"
                  name="offerLetter"
                  accept=".pdf"
                  hidden
                  onChange={handleFileChange}
                />

                <ForwardToInboxOutlinedIcon className={styles.uploadIcon} />

                <h4>
                  {formData.offerLetter
                    ? formData.offerLetter.name
                    : "Click to upload Offer letter"}
                </h4>

                <p>PDF - max 5 MB</p>
              </label>
            </div>

            <div className={styles.uploadWrapper}>
              {formData.certificate && (
                <CloseIcon
                  className={styles.closeIcon}
                  onClick={(e) => {
                    e.preventDefault();
                    removeFile("certificate");
                  }}
                />
              )}

              <label htmlFor="certificate" className={styles.uploadBox}>
                <input
                  type="file"
                  id="certificate"
                  name="certificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  hidden
                  onChange={handleFileChange}
                />

                <SchoolOutlinedIcon className={styles.uploadIcon} />

                <h4>
                  {formData.certificate
                    ? formData.certificate.name
                    : "Educational certificates"}
                </h4>

                <p>PDF, JPG - max 10 MB each</p>
              </label>
            </div>

            <div className={styles.uploadWrapper}>
              {formData.experienceLetter && (
                <CloseIcon
                  className={styles.closeIcon}
                  onClick={(e) => {
                    e.preventDefault();
                    removeFile("experienceLetter");
                  }}
                />
              )}

              <label htmlFor="experienceLetter" className={styles.uploadBox}>
                <input
                  type="file"
                  id="experienceLetter"
                  name="experienceLetter"
                  accept=".pdf"
                  hidden
                  onChange={handleFileChange}
                />

                <WorkHistoryOutlinedIcon className={styles.uploadIcon} />

                <h4>
                  {formData.experienceLetter
                    ? formData.experienceLetter.name
                    : "Experience letter"}
                </h4>

                <p>PDF - max 5 MB</p>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.photoCard}>
          <h4 className={styles.cardTitle}>
            <PhotoCameraOutlinedIcon className={styles.titleIcon} />
            Staff Photo
          </h4>

          <div className={styles.uploadWrapper1}>
            {formData.profile && (
              <CloseIcon
                className={styles.closeIcon1}
                onClick={(e) => {
                  e.preventDefault();
                  removeFile("profile");
                }}
              />
            )}

            <label htmlFor="profile">
              <input
                type="file"
                id="profile"
                name="profile"
                accept=".jpg,.jpeg,.png"
                hidden
                onChange={handleFileChange}
              />

              <div className={styles.avatar}>
                {formData.profile ? (
                  <img
                    src={URL.createObjectURL(formData.profile)}
                    alt="Staff"
                    className={styles.previewImage}
                  />
                ) : (
                  <AddAPhotoOutlinedIcon className={styles.photoIcon} />
                )}
              </div>
            </label>
          </div>

          <p className={styles.uploadText}>
            {formData.profile
              ? formData.profile.name.length > 20
                ? formData.profile.name.substring(0, 20) + "..."
                : formData.profile.name
              : "No file selected"}
          </p>
          <p className={styles.uploadInfo}>JPG, PNG - max 2 MB</p>

          <label htmlFor="profile" className={styles.uploadBtn}>
            <UploadOutlinedIcon className={styles.uploadBtnIcon} />
            {formData.profile ? "Upload" : "Click Here To Upload"}
          </label>
        </div>

        <div className={styles.photoCard}>
          <h4 className={styles.cardTitle}>
            <FactCheckOutlinedIcon className={styles.titleIcon} />
            Document Checklist
          </h4>

          <div className={styles.checkItem}>
            <div className={styles.checkLeft}>
              <DescriptionOutlinedIcon />
              <span>ID proof</span>
            </div>
            <span className={styles.uploaded}>UPLOADED</span>
          </div>

          <div className={styles.checkItem}>
            <div className={styles.checkLeft}>
              <ForwardToInboxOutlinedIcon />
              <span>Offer letter</span>
            </div>
            <span className={styles.uploaded}>UPLOADED</span>
          </div>

          <div className={styles.checkItem}>
            <div className={styles.checkLeft}>
              <SchoolOutlinedIcon />
              <span>Certificate</span>
            </div>
            <span className={styles.missing}>MISSING</span>
          </div>

          <div className={styles.checkItem}>
            <div className={styles.checkLeft}>
              <AssignmentOutlinedIcon />
              <span>Experience Letter</span>
            </div>
            <span className={styles.missing}>MISSING</span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.progress}>
            <span>Profile complete</span>
            <span>40%</span>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={resetForm}>
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={18}
                  color="inherit"
                  style={{ marginRight: "8px" }}
                />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
);
};

export default CreateStaff;
