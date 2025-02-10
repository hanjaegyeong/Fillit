const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full gap-x-2 flex justify-center items-center">
        <div className="w-4 h-4 bg-[#d991c2] rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-[#9869b8] rounded-full animate-bounce [animation-delay:150ms]"></div>
        <div className="w-4 h-4 bg-[#6756cc] rounded-full animate-bounce [animation-delay:300ms]"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
