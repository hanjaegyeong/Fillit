interface BasicInputProps {
  placeholder?: string;
  width?: number;
  height?: number;
}

const BasicInput = ({
  placeholder = 'Enter the text...',
  width = 280,
  height = 35,
}: BasicInputProps) => {
  return (
    <input
      placeholder={placeholder}
      className={`bg-[#ffffff] px-3 py-1.5 w-[${width}px] h-[${height}px] text-[#757575] text-sm rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#b5b4f2] outline-none`}
    />
  );
};

export default BasicInput;
