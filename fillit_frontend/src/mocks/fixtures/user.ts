import { User } from '@/types/user';
import ProfileImage from '@/mocks/images/profile-image.png';

export const user: User = {
  type: 'type',
  id: 'id',
  name: 'Olivia',
  personalId: 'mynameis',
  profileImageUrl: ProfileImage,
  introduction:
    "Wanna be by your side Let the world know you're mine I love you a million times loving you multiplied",
  birthDate: '1990-05-15',
};

export const anotherUser: User = {
  type: 'type',
  id: 'id2',
  name: 'Alex',
  personalId: 'chocolate',
  profileImageUrl: ProfileImage,
  introduction:
    'Who are we? Just a speck of dust within the galaxy? Woe is me.',
  birthDate: '1995-08-22',
};
