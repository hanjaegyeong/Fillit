interface BirthInputProps {
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
}

const BirthInput = ({ value, onChange, error, ...props }: BirthInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(new Date(event.target.value));
  };

  return (
    <div className="flex flex-col items-center w-full">
      <input
        {...props}
        type="date"
        className="w-full p-3 text-[#757575] text-sm rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#b5b4f2]"
        value={value.toISOString().split('T')[0]}
        onChange={handleChange}
        max={new Date().toISOString().split('T')[0]} // 미래 날짜 선택 방지
      />
      <p className="text-xs text-gray-500 text-right mt-2">
        {value
          ? `Selected: ${value.toISOString().split('T')[0]}`
          : 'Select your birthdate'}
      </p>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default BirthInput;
