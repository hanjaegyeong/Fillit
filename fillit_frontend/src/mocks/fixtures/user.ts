import { User } from '@/types/user';
import ProfileImage from '@/mocks/images/profile-image.png';

export const user: User[] = [
  {
    type: 'user',
    id: 'id1',
    name: 'Olivia',
    personalId: 'mynameis',
    profileImageUrl: ProfileImage,
    introduction:
      "Wanna be by your side Let the world know you're mine I love you a million times loving you multiplied",
    birthDate: '1990-05-15',
    followersCount: 100,
    followingCount: 100,
    follow: false,
  },

  {
    type: 'user',
    id: 'id2',
    name: 'Clarence',
    personalId: 'chocolate',
    profileImageUrl: ProfileImage,
    introduction:
      'Who are we? Just a speck of dust within the galaxy? Woe is me.',
    birthDate: '1995-08-22',
    followersCount: 140,
    followingCount: 100,
    follow: false,
  },
  {
    type: 'user',
    id: 'id3',
    name: 'Alex',
    personalId: 'alex',
    profileImageUrl: ProfileImage,
    introduction:
      'Welcome to our community, where creativity meets innovation. Join us and explore endless possibilities!',
    birthDate: '1990-05-15',
    followersCount: 1221,
    followingCount: 134,
    follow: false,
  },
  {
    type: 'user',
    id: 'id4',
    name: 'Sophia',
    personalId: 'dreamer',

    profileImageUrl: ProfileImage,
    introduction:
      'Every great journey begins with a single step. Keep moving forward!',
    birthDate: '1998-11-03',
    followersCount: 100,
    followingCount: 100,
    follow: false,
  },

  {
    type: 'user',
    id: 'id5',
    name: 'Ethan',
    personalId: 'starrynight',
    profileImageUrl: ProfileImage,
    introduction:
      'Life is a canvas, and you are the artist. Paint your dreams into reality.',
    birthDate: '1992-07-18',
    followersCount: 100,
    followingCount: 100,
    follow: false,
  },
  {
    type: 'user',
    id: 'id6',
    name: 'Maya',
    personalId: 'sunshine',

    profileImageUrl: ProfileImage,
    introduction:
      'The sun will rise and we will try again. Tomorrow is a new opportunity.',
    birthDate: '1994-03-11',
    followersCount: 100,
    followingCount: 100,
    follow: false,
  },
  {
    type: 'user',
    id: 'id7',
    name: 'Liam',
    personalId: 'wildheart',
    profileImageUrl: ProfileImage,

    introduction: 'The adventure of life awaits. Dont just dream it, live it.',
    birthDate: '1989-12-29',
    followersCount: 100,
    followingCount: 100,
    follow: false,
  },
];
