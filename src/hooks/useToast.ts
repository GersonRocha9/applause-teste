import toast from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = (message: string) => {
    return toast.success(message, {
      duration: 4000,
      style: {
        background: '#f0fdf4',
        color: '#15803d',
        border: '1px solid #bbf7d0',
        padding: '16px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#ffffff',
      },
    });
  };

  const showError = (message: string) => {
    return toast.error(message, {
      duration: 5000,
      style: {
        background: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca',
        padding: '16px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#ffffff',
      },
    });
  };

  const showInfo = (message: string) => {
    return toast(message, {
      duration: 3500,
      style: {
        background: '#eff6ff',
        color: '#1d4ed8',
        border: '1px solid #bfdbfe',
        padding: '16px',
        fontWeight: '500',
      },
      icon: 'ℹ️',
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#ffffff',
        color: '#374151',
        border: '1px solid #e5e7eb',
        padding: '16px',
        fontWeight: '500',
      },
    });
  };

  const dismiss = (toastId?: string) => {
    return toast.dismiss(toastId);
  };

  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    loading: showLoading,
    dismiss,
  };
}; 