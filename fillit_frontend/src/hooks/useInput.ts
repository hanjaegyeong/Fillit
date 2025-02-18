import useToastStore from '@/store/useToastStore';
import { useState } from 'react';

const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  const { showToast } = useToastStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value.replace(/[\u3131-\uD79D]/g, '');

    if (newValue !== e.target.value) {
      showToast('Use only English!');
    } else {
      setValue(newValue);
    }
  };

  const handleBeforeInput = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const nativeEvent = e.nativeEvent as InputEvent;
    if (nativeEvent.data && /[\u3131-\uD79D]/.test(nativeEvent.data)) {
      e.preventDefault();
      showToast('Use only English!');
    }
  };

  return {
    value,
    setValue,
    onChange: handleChange,
    onBeforeInput: handleBeforeInput,
  };
};

export default useInput;
