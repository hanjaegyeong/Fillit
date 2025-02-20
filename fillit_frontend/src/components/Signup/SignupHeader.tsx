import React from 'react';
import FillitLongLog from '@/assets/icons/fillit-long-logo.svg';

const SignUpHeader: React.FC = () => {
  return (
    <header className="fixed top-0 w-full py-4 px-6 z-10">
      <img src={FillitLongLog} className="h-10" alt="logo" />
    </header>
  );
};

export default SignUpHeader;
