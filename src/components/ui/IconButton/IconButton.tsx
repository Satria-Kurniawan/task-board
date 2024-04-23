import { IconButtonProps } from "./type";

export default function IconButton({
  icon,
  withBorder = false,
  onClick,
  className = "",
}: IconButtonProps) {
  return (
    <button
      className={`rounded-full h-6 w-6 flex justify-center items-center border-2 ${
        withBorder ? "border-primary" : "border-transparent"
      } hover:bg-gray-100 duration-300 ${className}`}
      onMouseDown={onClick}
    >
      {icon}
    </button>
  );
}
