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

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const LogoutModal = ({ open, handleClose, handleLogout }) => {
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

            background: "#eef4ff",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LogoutRoundedIcon
            sx={{
              fontSize: 35,
              color: "#2563eb",
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
        Sign Out
      </DialogTitle>

     

      <DialogContent>
        <Typography
          sx={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: "15px",
          }}
        >
          Are you sure you want to sign out from your account?
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
          onClick={handleLogout}
          variant="contained"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            padding: "10px 24px",
            background: "#2563eb",

            "&:hover": {
              background: "#1d4ed8",
            },
          }}
        >
          Sign out
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutModal;
