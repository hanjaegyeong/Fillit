import axiosInstance from './axiosInstance';

/* 팔로우 */
export const postFollow = async (followeePersonalId: string) => {
  const response = await axiosInstance.post('/api/follows/follow', {
    followeePersonalId,
  });
  return response.data;
};

/* 팔로우 취소 */
export const postUnfollow = async (followeePersonalId: string) => {
  const response = await axiosInstance.post('/api/follows/unfollow', {
    followeePersonalId,
  });
  return response.data;
};

/* 팔로워 조회 */
export const getFollowerList = async (personalId: string) => {
  const response = await axiosInstance.get('/api/follows/getfollower', {
    params: { personalId },
  });
  return response.data;
};

/* 팔로잉 조회 */
export const getFolloweeList = async (personalId: string) => {
  const response = await axiosInstance.get('/api/follows/getfollowee', {
    params: { personalId },
  });
  return response.data;
};
