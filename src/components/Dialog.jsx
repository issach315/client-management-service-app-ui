import React from "react";
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Dialog = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "sm",
  fullWidth = true,
  showActions = false,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  loading = false,
}) => {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Body */}
      <DialogContent dividers>{children}</DialogContent>

      {/* Footer */}
      {showActions && (
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">
            {cancelText}
          </Button>

          <Button onClick={onSubmit} variant="contained" disabled={loading}>
            {loading ? "Please wait..." : submitText}
          </Button>
        </DialogActions>
      )}
    </MuiDialog>
  );
};

export default Dialog;
