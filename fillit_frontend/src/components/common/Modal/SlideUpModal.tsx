import { useEffect } from "react";

interface SlideUpModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const SlideUpModal = ({ open, onClose, children }: SlideUpModalProps) => {
    useEffect(() => {
        if(open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    return (
        <>
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
              open ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={onClose}
          />
          <div
            className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg transition-transform duration-300 ${
              open ? "translate-y-0" : "translate-y-full"
            } h-[90vh] overflow-y-auto`}
          >
            <div className="p-6">
              <button
                className="absolute top-4 right-4 text-gray-500 text-lg"
                onClick={onClose}
              >
                ✕
              </button>
              {children}
            </div>
          </div>
        </>
      );
    };
    
    export default SlideUpModal;