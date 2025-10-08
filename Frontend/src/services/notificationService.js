import axios from 'axios';

export const getUserNotifications = async (email) => {
  return axios.get(`http://localhost:3000/api/notifications/user`, {
    params: { email },
    withCredentials: true,
  });
};
