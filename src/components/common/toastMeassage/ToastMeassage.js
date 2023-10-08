

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ToastMeassage.css'; 

const toastStyles = {
  success: 'toast-success',
  error: 'toast-error',
};

// Function to show a success toast notification
export const showSuccessToast = (message) => {
  toast.success(message, {
    className: toastStyles.success,
  });
};

// Function to show an error toast notification
export const showErrorToast = (message) => {
  toast.error(message, {
    className: toastStyles.error,
  });
};