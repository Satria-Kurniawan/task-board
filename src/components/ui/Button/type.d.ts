export type ButtonProps = {
  text: string;
  variant: "primary" | "secondary" | "disabled";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
};
