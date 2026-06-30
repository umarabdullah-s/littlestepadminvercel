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
  TextField,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CircularProgress from "@mui/material/CircularProgress";

const EditAttendanceModal = ({
  open,
  handleClose,
  attendanceData,
  setAttendanceData,
  onUpdate,
  updateLoading,
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
          p: 2,
        }}
      >
        <DialogTitle sx={{ p: 0, fontWeight: 600 }}>
          Edit Attendance
        </DialogTitle>

        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "#EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccessTimeFilledIcon
              sx={{
                fontSize: 35,
                color: "#2563EB",
              }}
            />
          </Box>
        </Box>

        <Typography sx={{ mb: 1, fontWeight: 500 }}>Check In Time</Typography>

        <TextField
          fullWidth
          placeholder="08:45:23 AM"
          value={attendanceData.checkInTime}
          onChange={(e) =>
            setAttendanceData({
              ...attendanceData,
              checkInTime: e.target.value,
            })
          }
          sx={{ mb: 3 }}
        />

        <Typography sx={{ mb: 1, fontWeight: 500 }}>Break In Time</Typography>

        <TextField
          fullWidth
          placeholder="11:30:00 AM"
          value={attendanceData.breakInTime}
          onChange={(e) =>
            setAttendanceData({
              ...attendanceData,
              breakInTime: e.target.value,
            })
          }
          sx={{ mb: 3 }}
        />

        <Typography sx={{ mb: 1, fontWeight: 500 }}>Break Out Time</Typography>

        <TextField
          fullWidth
          placeholder="12:00:00 PM"
          value={attendanceData.breakOutTime}
          onChange={(e) =>
            setAttendanceData({
              ...attendanceData,
              breakOutTime: e.target.value,
            })
          }
          sx={{ mb: 3 }}
        />

        <Typography sx={{ mb: 1, fontWeight: 500 }}>Check Out Time</Typography>

        <TextField
          fullWidth
          placeholder="05:10:18 PM"
          value={attendanceData.checkOutTime}
          onChange={(e) =>
            setAttendanceData({
              ...attendanceData,
              checkOutTime: e.target.value,
            })
          }
        />
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
            py: 1.2,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onUpdate}
          disabled={updateLoading}
          sx={{
            minWidth: 150,
            borderRadius: "12px",
            py: 1.2,
          }}
        >
          {updateLoading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Update"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAttendanceModal;
