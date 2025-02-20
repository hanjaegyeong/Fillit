export type UserType = 'user' | 'social';

export interface User {
  type: UserType;
  id: string;
  name: string;
  personalId: string;
  profileImageUrl: string | null;
  introduction: string;
  birthDate: string;
  followerCount: number;
  followeeCount: number;
  follow: boolean | null;
  interests: string[];
}

export interface UserUpdateForm {
  update: {
    name: string;
    introduction: string;
    interests: string[];
  };
  profileImage?: File;
}
