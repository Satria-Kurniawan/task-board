import ReactDOM from "react-dom";

import { Props } from "./type";

export default function Modal({ children, show, close }: Props) {
  const modalRoot = document.getElementById("modal-root");

  if (!show || !modalRoot) return null;

  return ReactDOM.createPortal(
    <main>
      <div className="bg-black/50 fixed inset-0" onClick={close} />
      <section className="p-5 w-[32rem] rounded-xl bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </section>
    </main>,
    modalRoot
  );
}
