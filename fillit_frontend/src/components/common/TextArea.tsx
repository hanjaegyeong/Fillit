import { useState } from 'react';

const Textarea = () => {
  const [bio, setBio] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };

  return (
    <div className="w-full">
      <textarea
        className="bg-[#ffffff] px-3 py-1.5 w-[280px] text-[#757575] text-sm rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#b5b4f2]"
        placeholder="Introduce yourself"
        value={bio}
        onChange={handleChange}
        rows={4}
      />
      <p className="text-xs text-gray-500 text-right">{bio.length} / 200</p>
    </div>
  );
};

export default Textarea;
