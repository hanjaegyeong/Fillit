import useToastStore from '@/store/useToastStore';
import { useEffect, useState } from 'react';

const useToast = () => {
  const { toast, showToast, hideToast } = useToastStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (toast) {
      setShow(true);
      const timer = setTimeout(() => {
        hideToast();
        setShow(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  return { toast, showToast, show };
};

export default useToast;
