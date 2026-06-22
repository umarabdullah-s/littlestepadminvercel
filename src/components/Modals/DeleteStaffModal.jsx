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

import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import CircularProgress from "@mui/material/CircularProgress";

const DeleteStaffModal = ({ open, handleClose, handleDelete, deleting }) => {
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
            background: "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DeleteForeverRoundedIcon
            sx={{
              fontSize: 35,
              color: "#dc2626",
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
        Delete Staff
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: "15px",
          }}
        >
          Are you sure you want to delete this staff member? This action cannot
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
          onClick={handleClose}
          disabled={deleting}
          variant="outlined"
          sx={{
            "&.Mui-disabled": {
              cursor: "not-allowed",
            },
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
          onClick={handleDelete}
          variant="contained"
          disabled={deleting}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            padding: "10px 24px",
            background: "#dc2626",
            minWidth: "110px",

            "&:hover": {
              background: "#b91c1c",
            },

            "&.Mui-disabled": {
              background: "#dc2626",
              opacity: 0.7,
              cursor: "not-allowed",
              color: "#fff",
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

export default DeleteStaffModal;
