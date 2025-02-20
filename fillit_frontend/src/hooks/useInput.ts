import useToastStore from '@/store/useToastStore';
import { useState, useCallback } from 'react';

const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  const { showToast } = useToastStore();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const koreanRegex = /[^A-Za-z\d\p{P}\p{S}\p{Emoji}\s\n\r]+/gu;
      const newValue = e.target.value;

      if (koreanRegex.test(newValue)) {
        showToast('Use only English!');
        // 한글이 포함된 경우 이전 값을 유지
        e.target.value = value;
        return;
      }

      setValue(newValue);
    },
    [value, showToast]
  );

  const handleBeforeInput = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const nativeEvent = e.nativeEvent as InputEvent;
    if (
      nativeEvent.data &&
      /[^A-Za-z\d\p{P}\p{S}\p{Emoji}\s\n\r]+/u.test(nativeEvent.data)
    ) {
      e.preventDefault();
      showToast('Use only English!');
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.code === 'Process') {
        e.preventDefault();
        showToast('Use only English!');
      }
    },
    [showToast]
  );

  return {
    value,
    setValue,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onBeforeInput: handleBeforeInput,
  };
};

export default useInput;
