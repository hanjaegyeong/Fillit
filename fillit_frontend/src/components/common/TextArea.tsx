import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ value, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event.target.value);
    };

    return (
      <div className="w-full">
        <textarea
          className="bg-[#ffffff] px-3 py-1.5 w-[280px] text-[#757575] text-sm rounded-lg border-2 transition-colors duration-100 border-solid outline-none focus:border-[#596A95] border-[#b5b4f2]"
          placeholder="Introduce yourself"
          value={value}
          onChange={handleChange}
          rows={4}
          ref={ref}
          {...props}
        />
        <p className="text-xs text-gray-500 text-right">
          {value?.length || 0} / 200
        </p>
      </div>
    );
  }
);

export default Textarea;
