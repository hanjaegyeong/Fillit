import axios from 'axios';

export const getAccessToken = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/reissue`,
    null,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  console.log(response);
  return response.data;
};
