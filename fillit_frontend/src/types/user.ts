export interface User {
  type: string;
  id: string;
  name: string;
  personalId: string;
  profileImageUrl: string | null;
  introduction: string;
  birthDate: string;
  followersCount: number;
  followingCount: number;
}
