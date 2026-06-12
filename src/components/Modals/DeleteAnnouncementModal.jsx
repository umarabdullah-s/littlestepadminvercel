

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

const DeleteAnnouncementModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          pb: 1,
        }}
      >
        Delete Announcement
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: "15px",
          }}
        >
          Are you sure you want to delete this announcement? This action cannot
          be undone.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          pb: 3,
          px: 3,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            padding: "10px 24px",
            borderColor: "#d1d5db",
            color: "#374151",
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            padding: "10px 24px",
            background: "#ef4444",
            "&:hover": {
              background: "#dc2626",
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAnnouncementModal;