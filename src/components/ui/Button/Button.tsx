import { ButtonProps } from "./type";

export default function Button({
  text,
  variant,
  type,
  onClick,
  className = "",
}: ButtonProps) {
  let buttonStyle: string = "";

  switch (variant) {
    case "primary":
      buttonStyle += "bg-primary text-white hover:bg-primary/80";
      break;
    case "secondary":
      buttonStyle += "bg-lightGlass hover:bg-primary/10";
      break;
    case "disabled":
      buttonStyle += "bg-primary/20 text-white";
      break;
    default:
      buttonStyle += "";
      break;
  }

  return (
    <button
      type={type}
      onMouseDown={onClick}
      className={`py-2 px-4 w-fit rounded-lg font-semibold text-sm duration-300 ${buttonStyle} ${className} ${
        variant == "disabled" ? "pointer-events-none" : ""
      }`}
    >
      {text}
    </button>
  );
}
