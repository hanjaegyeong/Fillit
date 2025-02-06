export interface SignupForm {
  regist: {
    type: 'user';
    password: string;
    name: string;
    personalId: string;
    birthDate: Date;
    email: string;
    introduction: string;
  };
  profileImage?: File;
}
