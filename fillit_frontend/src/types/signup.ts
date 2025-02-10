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

export interface SignupState {
  regist: {
    type: 'user';
    password: string;
    passwordConfirm: string;
    name: string;
    personalId: string;
    birthDate: Date;
    email: string;
    introduction: string;
    interest: string[];
  };
  profileImage?: File;
}
