import React, { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CircularProgress from "@mui/material/CircularProgress";

const UploadDocumentModal = ({
  open,
  handleClose,
  category,
  setCategory,
  selectedFile,
  setSelectedFile,
  documents,
  onUpload,
  uploadLoading,
}) => {
  const [isFileValid, setIsFileValid] = useState(true);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (!selectedFile && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [selectedFile]);
  const handleModalClose = () => {
    setFileError("");
    setSelectedFile(null);
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "24px",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <DialogTitle sx={{ p: 0, fontWeight: 600 }}>
          Upload Document
        </DialogTitle>

        <IconButton onClick={handleModalClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ p: 4 }}>
        <Typography
          sx={{
            mb: 1,
            fontWeight: 500,
          }}
        >
          Document Category
        </Typography>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            marginBottom: "20px",
          }}
        >
          <option value="">Select Document</option>

          {documents
            .filter((doc) => !doc.url)
            .map((doc) => (
              <option key={doc.type} value={doc.type}>
                {doc.label}
              </option>
            ))}
        </select>
        <Typography
          sx={{
            mb: 1,
            fontWeight: 500,
          }}
        >
          File Upload
        </Typography>

        <Box
          component="label"
          sx={{
            border: "2px dashed #D1D5DB",
            borderRadius: "20px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            background: "#F9FAFB",
          }}
        >
          <input
            ref={fileInputRef}
            hidden
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              const maxSize = 5 * 1024 * 1024;
              setSelectedFile(file);

              if (file.size > maxSize) {
                setFileError("File size should not exceed 5 MB");
                setIsFileValid(false);
              } else {
                setFileError("");
                setIsFileValid(true);
              }
            }}
          />

          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#2F8EF3",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <CloudUploadOutlinedIcon
              sx={{
                color: "#fff",
                fontSize: 30,
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: "18px",
              textAlign: "center",
              mb: 1,
            }}
          >
            Click to Upload or Drag and Drop
          </Typography>

          <Typography color="text.secondary">
            PDF, JPG, or PNG (Max 5MB)
          </Typography>

          {selectedFile && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "350px",
                background: "#EFF6FF",
                p: 1.5,
                borderRadius: "10px",
              }}
            >
              <Typography
                sx={{
                  color: "#2563eb",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedFile.name}
              </Typography>

              <CloseIcon
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setSelectedFile(null);
                  setFileError("");
                  setIsFileValid(true);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                sx={{
                  color: "#ef4444",
                  cursor: "pointer",
                }}
              />
            </Box>
          )}
        </Box>

        {fileError && (
          <Typography
            variant="caption"
            sx={{
              color: "error.main",
              display: "block",
              mt: 1,
            }}
          >
            {fileError}
          </Typography>
        )}
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          p: 3,
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleModalClose}
          sx={{
            minWidth: 150,
            borderRadius: "12px",
            py: 1.2,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onUpload}
          disabled={!category || !selectedFile || !isFileValid || uploadLoading}
          sx={{
            minWidth: 150,
            borderRadius: "12px",
            py: 1.2,
          }}
        >
          {uploadLoading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Upload"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDocumentModal;
