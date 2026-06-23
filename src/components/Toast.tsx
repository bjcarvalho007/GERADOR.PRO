import { type FC, useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  visible: boolean;
}

export const Toast: FC<ToastProps> = ({ message, type, onClose, visible }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="errorToast"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:w-80 sm:-ml-40 z-[9999] safe-pt"
        >
          <div
            id="toastContainer"
            className={`bg-white/95 backdrop-blur-xl border-l-4 shadow-2xl rounded-2xl p-4 flex items-center gap-4 border-slate-200 ${
              type === "success" ? "border-emerald-500" : "border-rose-500"
            }`}
          >
            <div
              id="toastIconBg"
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                type === "success" ? "bg-emerald-50" : "bg-rose-50"
              }`}
            >
              {type === "success" ? (
                <CheckCircle className="text-emerald-600 w-5 h-5" />
              ) : (
                <AlertCircle className="text-rose-600 w-5 h-5" />
              )}
            </div>
            <div className="flex-grow">
              <h4
                id="toastTitle"
                className={`text-[10px] font-black uppercase tracking-widest ${
                  type === "success" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {type === "success" ? "Sucesso!" : "Atenção Técnico"}
              </h4>
              <p id="errorMessage" className="text-xs font-bold text-slate-700">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
