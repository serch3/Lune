import { useEffect } from 'react';
import { useAlertStore } from '@/stores/alert';

export default function Alert() {
  const { alert, alertMessage, alertType, removeAlert } = useAlertStore();

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        removeAlert();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert, removeAlert]);

  if (!alert) return null;

  const alertClass = alertType === 'error' ? 'alert-error' : 'alert-success';

  return (
    <div className="toast toast-top toast-center z-[9999]">
      <div className={`alert ${alertClass} shadow-lg`}>
        <span>{alertMessage}</span>
      </div>
    </div>
  );
}
