import ReactDOM from "react-dom";
import { motion } from "framer-motion";

import { Props } from "./type";

export default function Modal({ children, show, close }: Props) {
  const modalRoot = document.getElementById("modal-root");

  if (!show || !modalRoot) return null;

  return ReactDOM.createPortal(
    <main className="flex justify-center items-center">
      <div className="bg-black/50 fixed inset-0" onClick={close} />
      <motion.section
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        className="p-5 w-[32rem] rounded-xl bg-white absolute"
      >
        {children}
      </motion.section>
    </main>,
    modalRoot
  );
}
