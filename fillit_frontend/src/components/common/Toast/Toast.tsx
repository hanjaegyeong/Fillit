import useToast from '@/hooks/useToast';

const Toast = () => {
  const { toast, show } = useToast();

  if (!toast) return null;

  return (
    <div
      className={`fixed top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] ${
        show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
      style={{
        transition: 'opacity 0.3s, transform 0.3s ease-in-out',
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
        <p className="text-[#4F4A85] text-sm font-medium">{toast}</p>
      </div>
    </div>
  );
};

export default Toast;
