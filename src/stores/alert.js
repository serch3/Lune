import { create } from 'zustand';

export const useAlertStore = create((set, get) => ({
  // state
  alert: false,
  alertMessage: 'Error occurred',
  alertType: 'success',

  // getters
  getAlertStatus: () => get().alert,

  // actions
  setAlert: (message, type) =>
    set({
      alert: true,
      alertMessage: message,
      alertType: type,
    }),

  removeAlert: () =>
    set({
      alert: false,
    }),
}));
