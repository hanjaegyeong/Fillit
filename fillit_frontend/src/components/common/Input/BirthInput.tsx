import { useState } from 'react';

const BirthInput = () => {
  const [birthdate, setBirthdate] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBirthdate(event.target.value);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <input
        type="date"
        className="w-full p-3 text-[#757575] text-sm rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#b5b4f2]"
        value={birthdate}
        onChange={handleChange}
        max={new Date().toISOString().split('T')[0]} // 미래 날짜 선택 방지
      />
      <p className="text-xs text-gray-500 text-right mt-2">
        {birthdate ? `Selected: ${birthdate}` : 'Select your birthdate'}
      </p>
    </div>
  );
};

export default BirthInput;
