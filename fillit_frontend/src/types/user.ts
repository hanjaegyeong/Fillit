export type UserType = 'user' | 'social';

export interface User {
  type: UserType;
  id: string;
  name: string;
  personalId: string;
  profileImageUrl: string | null;
  introduction: string;
  birthDate: string;
  followersCount: number;
  followingCount: number;
}

export interface UserUpdateForm {
  update: {
    name: string;
    introduction: string;
  };
  profileImage?: File;
}
