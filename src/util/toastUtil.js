import { toast } from "react-toastify";

// Common config
const config = {
  position: "top-right",
  autoClose: 3000,
};

// Success
export const showSuccess = (msg) => {
  toast.success(msg, config);
};

// Error
export const showError = (msg) => {
  toast.error(msg, config);
};

// Info
export const showInfo = (msg) => {
  toast.info(msg, config);
};

// Warning
export const showWarning = (msg) => {
  toast.warning(msg, config);
};

// Clear all toasts
export const clearToasts = () => {
  toast.dismiss();
};
