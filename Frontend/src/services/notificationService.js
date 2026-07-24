import api from './api';

export const getUserNotifications = async (email) => {
  return api.get('/notifications/user', {
    params: { email },
  });
};
