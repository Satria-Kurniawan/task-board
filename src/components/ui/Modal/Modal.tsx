import React from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

import { Props } from "./type";

export default function Modal({ children, show, close }: Props) {
  const modalRoot = document.getElementById("modal-root");

  React.useEffect(() => {
    const root = document.getElementById("root");
    if (show) {
      root?.classList.add("overflow-hidden");
      root?.classList.add("h-screen");
    } else {
      root?.classList.remove("overflow-hidden");
      root?.classList.remove("h-screen");
    }
  }, [show]);

  if (!show || !modalRoot) return null;

  return ReactDOM.createPortal(
    <main>
      <div className="bg-black/50 fixed inset-0" onClick={close} />
      <motion.section
        initial={{
          opacity: 0,
          scale: 0,
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: show ? 1 : 0,
          scale: show ? 1 : 0,
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
        }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        className="p-5 w-[32rem] rounded-xl bg-white absolute -translate-x-1/2 -translate-y-1/2"
      >
        {children}
      </motion.section>
    </main>,
    modalRoot
  );
}
