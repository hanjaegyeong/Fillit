import React from 'react';

interface BasicInputProps {
  placeholder?: string;
  width?: number;
  height?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const BasicInput: React.FC<BasicInputProps> = ({
  placeholder = 'Enter the text...',
  width = 280,
  height = 35,
  value,
  onChange,
  type = 'text',
}) => {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      style={{ width: `${width}px`, height: `${height}px` }}
      className="bg-[#ffffff] px-3 py-1.5 text-[#757575] text-sm rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#b5b4f2] outline-none resize-none overflow-hidden"
    />
  );
};

export default BasicInput;
