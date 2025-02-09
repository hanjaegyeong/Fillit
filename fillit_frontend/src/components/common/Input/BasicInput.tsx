import React from 'react';

interface BasicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  width?: number;
  height?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
}

const BasicInput = ({
  placeholder = 'Enter the text...',
  width = 280,
  height = 35,
  value,
  onChange,
  type = 'text',
  error,
  className,
  ...props
}: BasicInputProps) => {
  return (
    <div className="w-full flex justify-center">
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type}
        style={{ width: `${width}px`, height: `${height}px` }}
        className={`w-full p-3 text-[#757575] text-sm rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] ${
          error ? 'border-red-500' : 'border-[#b5b4f2]'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default BasicInput;
