import React from "react";
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

const UploadDocumentModal = ({
  open,
  handleClose,
  category,
  setCategory,
  selectedFile,
  setSelectedFile,
  documents,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          p: 3,
        }}
      >
        <DialogTitle sx={{ p: 0, fontWeight: 600 }}>
          Upload Document
        </DialogTitle>

        <IconButton onClick={handleClose}>
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
            marginBottom: "30px",
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
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            background: "#F9FAFB",
          }}
        >
          <input
            hidden
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          <Box
            sx={{
              width: 80,
              height: 80,
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
                fontSize: 40,
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: "24px",
              textAlign: "center",
              mb: 1,
            }}
          >
            Click to Upload or Drag and Drop
          </Typography>

          <Typography color="text.secondary">
            PDF, JPG, or PNG (Max 10MB)
          </Typography>

          {selectedFile && (
            <Typography
              sx={{
                mt: 2,
                color: "#2563eb",
                fontWeight: 600,
              }}
            >
              {selectedFile.name}
            </Typography>
          )}
        </Box>
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
          onClick={handleClose}
          sx={{
            minWidth: 150,
            borderRadius: "12px",
            py: 1.5,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          sx={{
            minWidth: 150,
            borderRadius: "12px",
            py: 1.5,
          }}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDocumentModal;
