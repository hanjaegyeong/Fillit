// follow.ts

export interface FollowRequest {
  followeePersonalId: string;
}

export interface UnfollowRequest {
  followeePersonalId: string;
}

export interface FollowResponse {
  personalId: string;
  profileImageUrl: string;
  isFollow: boolean;
}

export type GetFollowerResponse = FollowResponse[];
export type GetFolloweeResponse = FollowResponse[];

export interface GetFollowerRequest {
  personalId: string;
}

export interface GetFolloweeRequest {
  personalId: string;
}
