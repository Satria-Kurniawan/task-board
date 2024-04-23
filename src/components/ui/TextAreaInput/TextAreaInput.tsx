import { TextAreaInputProps } from "./type";

export default function TextAreaInput({
  onChange,
  ...restProps
}: TextAreaInputProps) {
  return (
    <textarea
      onChange={onChange}
      {...restProps}
      className="w-full rounded-xl focus:outline-none"
    ></textarea>
  );
}
