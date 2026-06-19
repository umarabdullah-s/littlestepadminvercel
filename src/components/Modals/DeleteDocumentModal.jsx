import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CircularProgress from "@mui/material/CircularProgress";

const DeleteDocumentModal = ({ open, handleClose, handleDelete, deleting }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "32px",
          padding: "10px",
          width: "380px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DeleteOutlineRoundedIcon
            sx={{
              fontSize: 35,
              color: "#ef4444",
            }}
          />
        </Box>
      </Box>

      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "24px",
        }}
      >
        Delete Document
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          Are you sure you want to delete this document? This action cannot be
          undone.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 2,
          pb: 3,
        }}
      >
        <Button onClick={handleClose} disabled={deleting} variant="outlined">
          Cancel
        </Button>

        <Button
          onClick={handleDelete}
          disabled={deleting}
          variant="contained"
          sx={{
            background: "#ef4444",
            "&:hover": {
              background: "#dc2626",
            },
          }}
        >
          {deleting ? (
            <CircularProgress size={20} sx={{ color: "#fff" }} />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDocumentModal;
