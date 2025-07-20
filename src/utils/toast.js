import { showMessage } from 'react-native-flash-message';

export const showToast = (message, type = 'default', options = {}) => {
  const defaultOptions = {
    message,
    type: type === 'error' ? 'danger' : type, // 'danger' is used for errors in flash message
    duration: 3000,
    floating: true,
    position: 'top',
    ...options,
  };

  showMessage(defaultOptions);
};

export const showSuccess = (message, options = {}) => {
  showToast(message, 'success', options);
};

export const showError = (message, options = {}) => {
  showToast(message, 'error', options);
};

export const showInfo = (message, options = {}) => {
  showToast(message, 'info', options);
};

export const showWarning = (message, options = {}) => {
  showToast(message, 'warning', options);
};
